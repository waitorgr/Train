from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    duration_hours = models.PositiveIntegerField()
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='teaching_courses',
        limit_choices_to={'role': 'teacher'}
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_courses'
    )

    def __str__(self):
        return self.title


class CourseItem(models.Model):
    ITEM_TYPE_CHOICES = [
        ('video', 'Video'),
        ('text', 'Text'),
        ('test', 'Test'),
    ]

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='items'
    )
    title = models.CharField(max_length=255)
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['order']
        unique_together = ('course', 'order')

    def __str__(self):
        return f"{self.course.title} - {self.title} ({self.item_type})"


class TextLesson(models.Model):
    course_item = models.OneToOneField(
        CourseItem,
        on_delete=models.CASCADE,
        related_name='text_lesson'
    )
    content = models.TextField()

    def __str__(self):
        return self.course_item.title


class VideoLesson(models.Model):
    course_item = models.OneToOneField(
        CourseItem,
        on_delete=models.CASCADE,
        related_name='video_lesson'
    )
    video_url = models.URLField()
    description = models.TextField(blank=True)

    def __str__(self):
        return self.course_item.title


class Test(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='tests'
    )
    course_item = models.OneToOneField(
        CourseItem,
        on_delete=models.CASCADE,
        related_name='test_block'
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    passing_score = models.PositiveIntegerField(default=60)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_tests',
        limit_choices_to={'role': 'teacher'}
    )

    def clean(self):
        if self.course_item.item_type != 'test':
            raise ValidationError("course_item для тесту повинен мати тип 'test'.")
        if self.course_item.course_id != self.course_id:
            raise ValidationError("course_item повинен належати тому самому курсу, що і тест.")

    def __str__(self):
        return f"{self.title} ({self.course.title})"


class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments',
        limit_choices_to={'role': 'student'}
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    enrollment_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.username} - {self.course.title}"


class Question(models.Model):
    QUESTION_TYPE_CHOICES = [
        ('single_choice', 'Single choice'),
        ('multiple_choice', 'Multiple choice'),
        ('text', 'Text answer'),
        ('file', 'File answer'),
    ]

    test = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    text = models.CharField(max_length=500)
    question_type = models.CharField(max_length=30, choices=QUESTION_TYPE_CHOICES)
    order = models.PositiveIntegerField(default=1)
    max_score = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['order']
        unique_together = ('test', 'order')

    def __str__(self):
        return self.text


class AnswerOption(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='options'
    )
    text = models.CharField(max_length=300, blank=True)
    image = models.ImageField(upload_to='answer_options/', blank=True, null=True)
    is_correct = models.BooleanField(default=False)

    def clean(self):
        if not self.text and not self.image:
            raise ValidationError("Варіант відповіді повинен містити текст або зображення.")

    def __str__(self):
        return self.text or f"Image option #{self.id}"


class TestAttempt(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('checking', 'Checking'),
        ('checked', 'Checked'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='test_attempts',
        limit_choices_to={'role': 'student'}
    )
    test = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name='attempts'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    total_score = models.FloatField(default=0)
    passed = models.BooleanField(default=False)
    checked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='checked_attempts',
        limit_choices_to={'role': 'teacher'}
    )
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} - {self.test.title}"


class Certificate(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='certificates',
        limit_choices_to={'role': 'student'}
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='certificates'
    )
    certificate_number = models.CharField(max_length=100, unique=True)
    issued_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.certificate_number} - {self.student.username}"


class StudentAnswer(models.Model):
    attempt = models.ForeignKey(
        TestAttempt,
        on_delete=models.CASCADE,
        related_name='answers'
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='student_answers'
    )
    text_answer = models.TextField(blank=True)
    file_answer = models.FileField(upload_to='student_answers/', blank=True, null=True)
    is_checked = models.BooleanField(default=False)
    is_correct = models.BooleanField(default=False)
    awarded_score = models.FloatField(default=0)

    def __str__(self):
        return f"{self.attempt.student.username} - {self.question.text}"


class StudentSelectedOption(models.Model):
    student_answer = models.ForeignKey(
        StudentAnswer,
        on_delete=models.CASCADE,
        related_name='selected_options'
    )
    option = models.ForeignKey(
        AnswerOption,
        on_delete=models.CASCADE,
        related_name='selected_in_answers'
    )

    class Meta:
        unique_together = ('student_answer', 'option')

    def __str__(self):
        return f"{self.student_answer.id} -> {self.option.id}"