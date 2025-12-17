from django.db import models
from users.models import User


class MockTest(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Oson'),
        ('medium', "O'rtacha"),
        ('hard', 'Qiyin'),
    ]

    SUBJECT_CHOICES = [
        ('math', 'Matematika'),
        ('physics', 'Fizika'),
        ('chemistry', 'Kimyo'),
        ('biology', 'Biologiya'),
        ('informatics', 'Informatika'),
        ('english', 'Ingliz tili'),
        ('uzbek', "O'zbek tili"),
        ('russian', 'Rus tili'),
        ('history', 'Tarix'),
        ('geography', 'Geografiya'),
        ('pedagogy', 'Pedagogika'),
        ('psychology', 'Psixologiya'),
    ]

    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    duration = models.IntegerField(default=30, help_text="Daqiqalarda")
    passing_score = models.IntegerField(default=60, help_text="O'tish bali (foizda)")
    questions_count = models.IntegerField(default=20)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Question(models.Model):
    test = models.ForeignKey(MockTest, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)
    correct_answer = models.CharField(max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')])
    explanation = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.test.title} - Q{self.order}"


class TestAttempt(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='test_attempts')
    test = models.ForeignKey(MockTest, on_delete=models.CASCADE, related_name='attempts')
    score = models.IntegerField()
    correct_answers = models.IntegerField()
    wrong_answers = models.IntegerField()
    total_questions = models.IntegerField()
    time_spent = models.IntegerField(help_text="Soniyalarda")
    passed = models.BooleanField(default=False)
    answers = models.JSONField(default=dict)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.teacher.username} - {self.test.title} - {self.score}%"