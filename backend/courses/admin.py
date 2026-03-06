from django.contrib import admin
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


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'teacher', 'start_date', 'end_date', 'duration_hours')
    search_fields = ('title',)


@admin.register(CourseItem)
class CourseItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'course', 'item_type', 'order')
    list_filter = ('item_type', 'course')
    ordering = ('course', 'order')


@admin.register(TextLesson)
class TextLessonAdmin(admin.ModelAdmin):
    list_display = ('id', 'course_item')


@admin.register(VideoLesson)
class VideoLessonAdmin(admin.ModelAdmin):
    list_display = ('id', 'course_item', 'video_url')


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'course', 'status', 'enrollment_date')
    list_filter = ('status',)


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'course', 'course_item', 'passing_score', 'created_by')


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'test', 'question_type', 'order', 'max_score')
    list_filter = ('question_type',)


@admin.register(AnswerOption)
class AnswerOptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'text', 'is_correct')


@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'test', 'total_score', 'passed', 'status', 'checked_by', 'completed_at')
    list_filter = ('passed', 'status')


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'course', 'certificate_number', 'issued_at')


@admin.register(StudentAnswer)
class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'attempt', 'question', 'text_answer', 'file_answer', 'is_checked', 'is_correct', 'awarded_score')


@admin.register(StudentSelectedOption)
class StudentSelectedOptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'student_answer', 'option')