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
    CourseEnrollmentsView,
    EnrollmentStatusView,
    MarkItemCompleteView,
    CourseProgressView,
    UploadFileAnswerView,
    TeacherCourseAttemptsView,
    CourseItemDeleteView,
    TextLessonDeleteView,
    VideoLessonDeleteView,
    TestDeleteView,
    CourseItemUpdateView,
    TextLessonUpdateView,
    VideoLessonUpdateView,
    TestUpdateView,
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

    path('courses/<int:course_id>/enrollments/', CourseEnrollmentsView.as_view(), name='course_enrollments'),
    path('enrollments/<int:pk>/status/', EnrollmentStatusView.as_view(), name='enrollment_status'),

    path('course-items/<int:item_id>/complete/', MarkItemCompleteView.as_view(), name='mark_item_complete'),
    path('courses/<int:course_id>/progress/', CourseProgressView.as_view(), name='course_progress'),

    path('answers/upload-file/', UploadFileAnswerView.as_view(), name='upload_file_answer'),

    path('courses/<int:course_id>/attempts/', TeacherCourseAttemptsView.as_view(), name='teacher_course_attempts'),
    path('course-items/<int:item_id>/delete/', CourseItemDeleteView.as_view(), name='course-item-delete'),
    path('text-lessons/<int:lesson_id>/delete/', TextLessonDeleteView.as_view(), name='text-lesson-delete'),
    path('video-lessons/<int:lesson_id>/delete/', VideoLessonDeleteView.as_view(), name='video-lesson-delete'),
    path('tests/<int:test_id>/delete/', TestDeleteView.as_view(), name='test-delete'),
    path('course-items/<int:item_id>/update/', CourseItemUpdateView.as_view(), name='course-item-update'),
    path('text-lessons/<int:lesson_id>/update/', TextLessonUpdateView.as_view(), name='text-lesson-update'),
    path('video-lessons/<int:lesson_id>/update/', VideoLessonUpdateView.as_view(), name='video-lesson-update'),
    path('tests/<int:test_id>/update/', TestUpdateView.as_view(), name='test-update'),
]

