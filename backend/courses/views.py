from rest_framework import generics, permissions, parsers
from rest_framework.exceptions import PermissionDenied
from .models import (
    Course,
    CourseItem,
    TextLesson,
    VideoLesson,
    Enrollment,
    Test,
    Question,
    AnswerOption,
    TestAttempt,
    Certificate,
    StudentAnswer,
    StudentSelectedOption,
)
from .serializers import (
    CourseSerializer,
    CourseItemSerializer,
    CourseItemPublicSerializer,
    TextLessonSerializer,
    VideoLessonSerializer,
    EnrollmentSerializer,
    TestSerializer,
    CertificateSerializer,
    CourseItemReorderSerializer,
    QuestionCreateSerializer,
    AnswerOptionCreateSerializer,
    QuestionSerializer,
    TestAttemptSerializer,
    TestSubmissionSerializer,
    StudentAnswerCheckSerializer,
)
from .permissions import IsTeacher, IsStudent
import uuid

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import uuid

from django.db import transaction
from django.shortcuts import get_object_or_404


def can_access_course(user, course):
    if not user.is_authenticated:
        return False

    if user.role == 'admin':
        return True

    if user.role == 'teacher' and course.teacher_id == user.id:
        return True

    if user.role == 'student':
        return Enrollment.objects.filter(
            student=user,
            course=course,
            status__in=['approved', 'completed']
        ).exists()

    return False

class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]


class CourseCreateView(generics.CreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class MyTeachingCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Course.objects.filter(teacher=self.request.user)


class EnrollmentCreateView(generics.CreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def perform_create(self, serializer):
        course = serializer.validated_data['course']

        existing = Enrollment.objects.filter(
            student=self.request.user,
            course=course
        ).first()

        if existing:
            raise PermissionDenied("Ви вже записані на цей курс.")

        serializer.save(student=self.request.user)


class TestCreateView(generics.CreateAPIView):
    serializer_class = TestSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def perform_create(self, serializer):
        course = serializer.validated_data['course']
        course_item = serializer.validated_data['course_item']

        if course.teacher != self.request.user:
            raise PermissionDenied("Ви не можете створювати тест для чужого курсу.")

        if course_item.course != course:
            raise PermissionDenied("Елемент курсу не належить цьому курсу.")

        if course_item.item_type != 'test':
            raise PermissionDenied("Тест можна створити тільки для блоку типу 'test'.")

        serializer.save(created_by=self.request.user)


class CourseTestDetailView(generics.RetrieveAPIView):
    serializer_class = TestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        course_id = self.kwargs['course_id']
        test = get_object_or_404(Test.objects.prefetch_related('questions__options'), course_id=course_id)

        if not can_access_course(self.request.user, test.course):
            raise PermissionDenied("У вас немає доступу до тесту цього курсу.")

        return test


class TestAttemptCreateView(generics.CreateAPIView):
    serializer_class = TestAttemptSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def perform_create(self, serializer):
        test = serializer.validated_data['test']

        if not can_access_course(self.request.user, test.course):
            raise PermissionDenied("У вас немає доступу до проходження тесту цього курсу.")

        score = serializer.validated_data['score']
        passed = score >= test.passing_score

        attempt = serializer.save(student=self.request.user, passed=passed)

        if passed:
            Certificate.objects.get_or_create(
                student=self.request.user,
                course=test.course,
                defaults={
                    'certificate_number': f"CERT-{uuid.uuid4().hex[:10].upper()}"
                }
            )


class MyCertificatesView(generics.ListAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        return Certificate.objects.filter(student=self.request.user)

class SubmitTestView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    @transaction.atomic
    def post(self, request):
        serializer = TestSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        test_id = serializer.validated_data['test_id']
        answers_data = serializer.validated_data['answers']

        test = get_object_or_404(Test.objects.prefetch_related('questions__options'), id=test_id)

        if not can_access_course(request.user, test.course):
            raise PermissionDenied("У вас немає доступу до проходження тесту цього курсу.")

        questions = list(test.questions.all().order_by('order'))
        if not questions:
            return Response(
                {"detail": "У тесті немає запитань."},
                status=status.HTTP_400_BAD_REQUEST
            )

        attempt = TestAttempt.objects.create(
            student=request.user,
            test=test,
            status='submitted',
            total_score=0,
            passed=False,
        )

        answers_map = {item['question_id']: item for item in answers_data}

        total_score = 0
        requires_manual_check = False

        for question in questions:
            submitted = answers_map.get(question.id, None)

            student_answer = StudentAnswer.objects.create(
                attempt=attempt,
                question=question,
            )

            if not submitted:
                student_answer.is_checked = True
                student_answer.is_correct = False
                student_answer.awarded_score = 0
                student_answer.save()
                continue

            question_type = question.question_type

            if question_type == 'single_choice':
                selected_ids = submitted.get('selected_option_ids', [])

                if len(selected_ids) > 1:
                    return Response(
                        {"detail": f"Питання {question.id} допускає лише одну відповідь."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                selected_options = list(
                    AnswerOption.objects.filter(id__in=selected_ids, question=question)
                )

                for option in selected_options:
                    StudentSelectedOption.objects.create(
                        student_answer=student_answer,
                        option=option
                    )

                correct_options = list(question.options.filter(is_correct=True))
                is_correct = (
                    len(selected_options) == 1 and
                    len(correct_options) == 1 and
                    selected_options[0].id == correct_options[0].id
                )

                student_answer.is_checked = True
                student_answer.is_correct = is_correct
                student_answer.awarded_score = question.max_score if is_correct else 0
                student_answer.save()

                total_score += student_answer.awarded_score

            elif question_type == 'multiple_choice':
                selected_ids = submitted.get('selected_option_ids', [])

                selected_options = list(
                    AnswerOption.objects.filter(id__in=selected_ids, question=question)
                )

                for option in selected_options:
                    StudentSelectedOption.objects.create(
                        student_answer=student_answer,
                        option=option
                    )

                selected_set = set(option.id for option in selected_options)
                correct_set = set(question.options.filter(is_correct=True).values_list('id', flat=True))

                is_correct = selected_set == correct_set and len(correct_set) > 0

                student_answer.is_checked = True
                student_answer.is_correct = is_correct
                student_answer.awarded_score = question.max_score if is_correct else 0
                student_answer.save()

                total_score += student_answer.awarded_score

            elif question_type == 'text':
                text_answer = submitted.get('text_answer', '').strip()

                student_answer.text_answer = text_answer
                student_answer.is_checked = False
                student_answer.is_correct = False
                student_answer.awarded_score = 0
                student_answer.save()

                requires_manual_check = True

            elif question_type == 'file':
                # Для file-питань потрібен окремий multipart submit,
                # тому поки залишаємо їх на ручну/окрему реалізацію.
                student_answer.is_checked = False
                student_answer.is_correct = False
                student_answer.awarded_score = 0
                student_answer.save()

                requires_manual_check = True

        attempt.total_score = total_score

        if requires_manual_check:
            attempt.status = 'checking'
            attempt.passed = False
        else:
            attempt.status = 'checked'
            attempt.passed = total_score >= test.passing_score

            if attempt.passed:
                Certificate.objects.get_or_create(
                    student=request.user,
                    course=test.course,
                    defaults={
                        'certificate_number': f"CERT-{uuid.uuid4().hex[:10].upper()}"
                    }
                )

        attempt.save()

        return Response({
            "attempt_id": attempt.id,
            "status": attempt.status,
            "total_score": attempt.total_score,
            "passed": attempt.passed,
        }, status=status.HTTP_201_CREATED)


class CourseItemCreateView(generics.CreateAPIView):
    serializer_class = CourseItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def perform_create(self, serializer):
        course = serializer.validated_data['course']
        if course.teacher != self.request.user:
            raise PermissionDenied("Ви не можете додавати елементи до чужого курсу.")
        serializer.save()


class TextLessonCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def post(self, request):
        course_item_id = request.data.get('course_item')
        content = request.data.get('content')

        course_item = CourseItem.objects.get(id=course_item_id)

        if course_item.course.teacher != request.user:
            raise PermissionDenied("Ви не можете додавати текст до чужого курсу.")

        if course_item.item_type != 'text':
            return Response({'detail': 'Цей елемент не є текстовим блоком.'}, status=400)

        text_lesson = TextLesson.objects.create(
            course_item=course_item,
            content=content
        )

        return Response(TextLessonSerializer(text_lesson).data, status=201)

class VideoLessonCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def post(self, request):
        course_item_id = request.data.get('course_item')
        video_url = request.data.get('video_url')
        description = request.data.get('description', '')

        course_item = CourseItem.objects.get(id=course_item_id)

        if course_item.course.teacher != request.user:
            raise PermissionDenied("Ви не можете додавати відео до чужого курсу.")

        if course_item.item_type != 'video':
            return Response({'detail': 'Цей елемент не є відеоблоком.'}, status=400)

        video_lesson = VideoLesson.objects.create(
            course_item=course_item,
            video_url=video_url,
            description=description
        )

        return Response(VideoLessonSerializer(video_lesson).data, status=201)

class CourseItemsView(generics.ListAPIView):
    serializer_class = CourseItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        course = Course.objects.get(id=course_id)

        if not can_access_course(self.request.user, course):
            raise PermissionDenied("У вас немає доступу до цього курсу.")

        return CourseItem.objects.filter(course=course).order_by('order')

class NextCourseItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, course_id, current_order):
        course = Course.objects.get(id=course_id)

        if not can_access_course(request.user, course):
            raise PermissionDenied("У вас немає доступу до цього курсу.")

        next_item = CourseItem.objects.filter(
            course=course,
            order__gt=current_order
        ).order_by('order').first()

        if not next_item:
            return Response({'detail': 'Наступного елемента немає.'}, status=404)

        return Response(CourseItemSerializer(next_item).data)

class CourseItemReorderView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def post(self, request, course_id):
        course = Course.objects.get(id=course_id)

        if course.teacher != request.user:
            raise PermissionDenied("Ви не можете змінювати порядок елементів чужого курсу.")

        serializer = CourseItemReorderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        items_data = serializer.validated_data['items']
        course_items = {item.id: item for item in CourseItem.objects.filter(course=course)}

        used_orders = [item_data['order'] for item_data in items_data]
        if len(used_orders) != len(set(used_orders)):
            return Response(
                {"detail": "Порядкові номери не повинні повторюватися."},
                status=400
            )

        for item_data in items_data:
            item_id = item_data['id']
            if item_id not in course_items:
                raise PermissionDenied(f"Елемент з id={item_id} не належить цьому курсу.")

        # Тимчасово зсуваємо order, щоб уникнути конфліктів unique_together
        temp_shift = 1000
        for item_data in items_data:
            item = course_items[item_data['id']]
            item.order = item.order + temp_shift
            item.save()

        # Встановлюємо новий порядок
        for item_data in items_data:
            item = course_items[item_data['id']]
            item.order = item_data['order']
            item.save()

        updated_items = CourseItem.objects.filter(course=course).order_by('order')
        return Response(CourseItemSerializer(updated_items, many=True).data, status=200)
    
class QuestionCreateView(generics.CreateAPIView):
    serializer_class = QuestionCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def perform_create(self, serializer):
        test = serializer.validated_data['test']

        if test.course.teacher != self.request.user:
            raise PermissionDenied("Ви не можете додавати питання до чужого тесту.")

        serializer.save()
        
class AnswerOptionCreateView(generics.CreateAPIView):
    serializer_class = AnswerOptionCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def perform_create(self, serializer):
        question = serializer.validated_data['question']

        if question.test.course.teacher != self.request.user:
            raise PermissionDenied("Ви не можете додавати варіанти до чужого тесту.")

        serializer.save()
        
class TestQuestionsView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        test_id = self.kwargs['test_id']
        test = get_object_or_404(Test, id=test_id)

        if not can_access_course(self.request.user, test.course):
            raise PermissionDenied("У вас немає доступу до цього тесту.")

        return Question.objects.filter(test=test).prefetch_related('options').order_by('order')
    
class TestAttemptsByTeacherView(generics.ListAPIView):
    serializer_class = TestAttemptSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        test_id = self.kwargs['test_id']
        test = get_object_or_404(Test, id=test_id)

        if test.course.teacher != self.request.user:
            raise PermissionDenied("Ви не можете переглядати спроби чужого тесту.")

        return TestAttempt.objects.filter(test=test).select_related(
            'student',
            'test',
            'checked_by'
        ).prefetch_related(
            'answers__selected_options__option',
            'answers__question'
        ).order_by('-completed_at')
    
class PublicCourseItemsView(generics.ListAPIView):
    serializer_class = CourseItemPublicSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return CourseItem.objects.filter(course_id=course_id).order_by('order')
    
class MyEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user)
    
class StudentAnswerCheckView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    @transaction.atomic
    def post(self, request, answer_id):
        student_answer = get_object_or_404(
            StudentAnswer.objects.select_related(
                'attempt__test__course',
                'question'
            ),
            id=answer_id
        )

        if student_answer.attempt.test.course.teacher != request.user:
            raise PermissionDenied("Ви не можете перевіряти відповіді чужого курсу.")

        serializer = StudentAnswerCheckSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        awarded_score = serializer.validated_data['awarded_score']
        is_correct = serializer.validated_data['is_correct']

        if awarded_score > student_answer.question.max_score:
            return Response(
                {"detail": "Нарахований бал не може перевищувати max_score питання."},
                status=status.HTTP_400_BAD_REQUEST
            )

        student_answer.awarded_score = awarded_score
        student_answer.is_correct = is_correct
        student_answer.is_checked = True
        student_answer.save()

        attempt = student_answer.attempt
        all_answers = attempt.answers.select_related('question').all()

        if all(answer.is_checked for answer in all_answers):
            total_score = sum(answer.awarded_score for answer in all_answers)
            attempt.total_score = total_score
            attempt.status = 'checked'
            attempt.checked_by = request.user
            attempt.passed = total_score >= attempt.test.passing_score
            attempt.save()

            if attempt.passed:
                Certificate.objects.get_or_create(
                    student=attempt.student,
                    course=attempt.test.course,
                    defaults={
                        'certificate_number': f"CERT-{uuid.uuid4().hex[:10].upper()}"
                    }
                )
        else:
            attempt.status = 'checking'
            attempt.checked_by = request.user
            attempt.save()

        return Response({
            "answer_id": student_answer.id,
            "awarded_score": student_answer.awarded_score,
            "is_correct": student_answer.is_correct,
            "is_checked": student_answer.is_checked,
            "attempt_status": attempt.status,
            "attempt_total_score": attempt.total_score,
            "attempt_passed": attempt.passed,
        })

class CourseEnrollmentsView(generics.ListAPIView):
    """Teacher sees all enrollment requests for their course."""
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        course = get_object_or_404(Course, id=course_id)
        if course.teacher != self.request.user:
            raise PermissionDenied("Ви не є викладачем цього курсу.")
        return Enrollment.objects.filter(course=course).select_related('student').order_by('-enrollment_date')


class EnrollmentStatusView(APIView):
    """Teacher approves or rejects an enrollment."""
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def patch(self, request, pk):
        enrollment = get_object_or_404(Enrollment, id=pk)
        if enrollment.course.teacher != request.user:
            raise PermissionDenied("Ви не є викладачем цього курсу.")
        new_status = request.data.get('status')
        if new_status not in ['approved', 'rejected', 'completed']:
            return Response({'detail': 'Невірний статус. Допустимі: approved, rejected, completed.'},
                            status=status.HTTP_400_BAD_REQUEST)
        enrollment.status = new_status
        enrollment.save()
        return Response(EnrollmentSerializer(enrollment).data)


# ── Progress tracking ──────────────────────────────────────────────────────────
class MarkItemCompleteView(APIView):
    """Student marks a course item as completed."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, item_id):
        item = get_object_or_404(CourseItem, id=item_id)
        if not can_access_course(request.user, item.course):
            raise PermissionDenied("Немає доступу до цього курсу.")
        from .models import CourseItemProgress
        obj, created = CourseItemProgress.objects.get_or_create(
            student=request.user,
            course_item=item
        )
        return Response({'item_id': item_id, 'completed': True, 'created': created})


class CourseProgressView(APIView):
    """Returns list of completed item ids for a course."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, course_id):
        from .models import CourseItemProgress
        completed_ids = list(
            CourseItemProgress.objects.filter(
                student=request.user,
                course_item__course_id=course_id
            ).values_list('course_item_id', flat=True)
        )
        return Response({'completed_item_ids': completed_ids})


# ── File answer upload ─────────────────────────────────────────────────────────
class UploadFileAnswerView(APIView):
    """Student uploads a file answer for a question."""
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    @transaction.atomic
    def post(self, request):
        question_id = request.data.get('question_id')
        attempt_id = request.data.get('attempt_id')
        file = request.FILES.get('file')

        if not all([question_id, attempt_id, file]):
            return Response({'detail': 'Потрібні question_id, attempt_id та file.'}, status=400)

        question = get_object_or_404(Question, id=question_id)
        attempt = get_object_or_404(TestAttempt, id=attempt_id, student=request.user)

        answer, _ = StudentAnswer.objects.get_or_create(
            attempt=attempt,
            question=question,
            defaults={'is_checked': False, 'awarded_score': 0}
        )
        answer.file_answer = file
        answer.save()
        return Response({'answer_id': answer.id, 'file': answer.file_answer.url if answer.file_answer else None})


# ── Teacher: get all attempts for their courses ────────────────────────────────
class TeacherCourseAttemptsView(generics.ListAPIView):
    """All test attempts across all teacher's courses, with answers."""
    serializer_class = TestAttemptSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        qs = TestAttempt.objects.filter(
            test__course__teacher=self.request.user
        ).select_related('student', 'test', 'test__course', 'checked_by') \
         .prefetch_related('answers__selected_options__option', 'answers__question')
        if course_id:
            qs = qs.filter(test__course_id=course_id)
        return qs.order_by('-completed_at')


class CourseItemDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def delete(self, request, item_id):
        item = get_object_or_404(CourseItem, id=item_id)

        if item.course.teacher != request.user:
            raise PermissionDenied("Ви не можете видаляти цей розділ.")

        item.delete()
        return Response({"detail": "Розділ видалено."}, status=204)
    
class TextLessonDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def delete(self, request, lesson_id):
        lesson = get_object_or_404(TextLesson, id=lesson_id)

        if lesson.course_item.course.teacher != request.user:
            raise PermissionDenied("Ви не можете видаляти цей контент.")

        lesson.delete()
        return Response({"detail": "Текстовий урок видалено."}, status=204)
    
class VideoLessonDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def delete(self, request, lesson_id):
        lesson = get_object_or_404(VideoLesson, id=lesson_id)

        if lesson.course_item.course.teacher != request.user:
            raise PermissionDenied("Ви не можете видаляти цей контент.")

        lesson.delete()
        return Response({"detail": "Відеоурок видалено."}, status=204)
    
class TestDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def delete(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)

        if test.course.teacher != request.user:
            raise PermissionDenied("Ви не можете видаляти цей тест.")

        test.delete()
        return Response({"detail": "Тест видалено."}, status=204)
    
class CourseItemUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def patch(self, request, item_id):
        item = get_object_or_404(CourseItem, id=item_id)

        if item.course.teacher != request.user:
            raise PermissionDenied("Ви не можете редагувати цей розділ.")

        serializer = CourseItemSerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TextLessonUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def patch(self, request, lesson_id):
        lesson = get_object_or_404(TextLesson, id=lesson_id)

        if lesson.course_item.course.teacher != request.user:
            raise PermissionDenied("Ви не можете редагувати цей урок.")

        serializer = TextLessonSerializer(lesson, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class VideoLessonUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def patch(self, request, lesson_id):
        lesson = get_object_or_404(VideoLesson, id=lesson_id)

        if lesson.course_item.course.teacher != request.user:
            raise PermissionDenied("Ви не можете редагувати цей відеоурок.")

        serializer = VideoLessonSerializer(lesson, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TestUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def patch(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)

        if test.course.teacher != request.user:
            raise PermissionDenied("Ви не можете редагувати цей тест.")

        serializer = TestSerializer(test, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)