from django.urls import path
from .views import (
    CourseListView,
    CourseCreateView,
    MyTeachingCoursesView,
    EnrollmentCreateView,
    MyEnrollmentsView,
    CourseItemCreateView,
    TextLessonCreateView,
    VideoLessonCreateView,
    PublicCourseItemsView,
    CourseItemsView,
    NextCourseItemView,
    CourseItemReorderView,
    TestCreateView,
    CourseTestDetailView,
    TestQuestionsView,
    QuestionCreateView,
    AnswerOptionCreateView,
    SubmitTestView,
    TestAttemptsByTeacherView,
    MyCertificatesView,
    StudentAnswerCheckView,
)

urlpatterns = [
    path('courses/', CourseListView.as_view(), name='course_list'),
    path('courses/create/', CourseCreateView.as_view(), name='course_create'),
    path('courses/my-teaching/', MyTeachingCoursesView.as_view(), name='my_teaching_courses'),

    path('enrollments/create/', EnrollmentCreateView.as_view(), name='enrollment_create'),
    path('enrollments/my/', MyEnrollmentsView.as_view(), name='my_enrollments'),

    path('course-items/create/', CourseItemCreateView.as_view(), name='course_item_create'),
    path('text-lessons/create/', TextLessonCreateView.as_view(), name='text_lesson_create'),
    path('video-lessons/create/', VideoLessonCreateView.as_view(), name='video_lesson_create'),

    path('courses/<int:course_id>/items/public/', PublicCourseItemsView.as_view(), name='public_course_items'),
    path('courses/<int:course_id>/items/', CourseItemsView.as_view(), name='course_items'),
    path('courses/<int:course_id>/items/next/<int:current_order>/', NextCourseItemView.as_view(), name='next_course_item'),
    path('courses/<int:course_id>/items/reorder/', CourseItemReorderView.as_view(), name='course_items_reorder'),

    path('tests/create/', TestCreateView.as_view(), name='test_create'),
    path('tests/course/<int:course_id>/', CourseTestDetailView.as_view(), name='course_test_detail'),
    path('tests/<int:test_id>/questions/', TestQuestionsView.as_view(), name='test_questions'),
    path('tests/<int:test_id>/attempts/', TestAttemptsByTeacherView.as_view(), name='test_attempts_by_teacher'),
    path('tests/submit/', SubmitTestView.as_view(), name='submit_test'),

    path('questions/create/', QuestionCreateView.as_view(), name='question_create'),
    path('answer-options/create/', AnswerOptionCreateView.as_view(), name='answer_option_create'),

    path('answers/<int:answer_id>/check/', StudentAnswerCheckView.as_view(), name='answer_check'),

    path('certificates/my/', MyCertificatesView.as_view(), name='my_certificates'),
]