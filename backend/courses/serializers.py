from rest_framework import serializers
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


class TextLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextLesson
        fields = ['id', 'content']


class VideoLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoLesson
        fields = ['id', 'video_url', 'description']


class CourseItemPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseItem
        fields = ['id', 'title', 'item_type', 'order']


class CourseItemSerializer(serializers.ModelSerializer):
    text_lesson = TextLessonSerializer(read_only=True)
    video_lesson = VideoLessonSerializer(read_only=True)

    class Meta:
        model = CourseItem
        fields = [
            'id',
            'course',
            'title',
            'item_type',
            'order',
            'text_lesson',
            'video_lesson',
        ]


class CourseSerializer(serializers.ModelSerializer):
    teacher_username = serializers.CharField(source='teacher.username', read_only=True)
    items = CourseItemSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'description',
            'start_date',
            'end_date',
            'duration_hours',
            'teacher',
            'teacher_username',
            'created_by',
            'items',
        ]
        read_only_fields = ['created_by']


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'course_title', 'enrollment_date', 'status']
        read_only_fields = ['student', 'enrollment_date', 'status']


class CertificateSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Certificate
        fields = ['id', 'student', 'course', 'course_title', 'certificate_number', 'issued_at']


class AnswerOptionSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = AnswerOption
        fields = ['id', 'question', 'text', 'image', 'is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    options = AnswerOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'test', 'text', 'question_type', 'order', 'max_score', 'options']


class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = [
            'id',
            'course',
            'course_item',
            'title',
            'description',
            'passing_score',
            'created_by',
            'questions',
        ]
        read_only_fields = ['created_by']


class QuestionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'test', 'text', 'question_type', 'order', 'max_score']


class AnswerOptionCreateSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = AnswerOption
        fields = ['id', 'question', 'text', 'image', 'is_correct']


class StudentSelectedOptionSerializer(serializers.ModelSerializer):
    option_text = serializers.CharField(source='option.text', read_only=True)
    option_image = serializers.ImageField(source='option.image', read_only=True)

    class Meta:
        model = StudentSelectedOption
        fields = ['id', 'option', 'option_text', 'option_image']


class StudentAnswerSerializer(serializers.ModelSerializer):
    selected_options = StudentSelectedOptionSerializer(many=True, read_only=True)
    question_text = serializers.CharField(source='question.text', read_only=True)
    question_type = serializers.CharField(source='question.question_type', read_only=True)

    class Meta:
        model = StudentAnswer
        fields = [
            'id',
            'attempt',
            'question',
            'question_text',
            'question_type',
            'text_answer',
            'file_answer',
            'selected_options',
            'is_checked',
            'is_correct',
            'awarded_score',
        ]


class TestAttemptSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source='test.title', read_only=True)
    answers = StudentAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = TestAttempt
        fields = [
            'id',
            'student',
            'test',
            'test_title',
            'status',
            'total_score',
            'passed',
            'checked_by',
            'completed_at',
            'answers',
        ]
        read_only_fields = ['student', 'status', 'total_score', 'passed', 'checked_by', 'completed_at']


class StudentAnswerSubmissionSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    selected_option_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=list
    )
    text_answer = serializers.CharField(required=False, allow_blank=True, default='')
    # file_answer краще обробляти окремо через multipart/form-data, якщо дійдемо до цього
    # поки лишимо його поза submit-json сценарієм


class TestSubmissionSerializer(serializers.Serializer):
    test_id = serializers.IntegerField()
    answers = StudentAnswerSubmissionSerializer(many=True)


class StudentAnswerCheckSerializer(serializers.Serializer):
    awarded_score = serializers.FloatField(min_value=0)
    is_correct = serializers.BooleanField()