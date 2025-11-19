from django.db import models
from django.conf import settings


class Teacher(models.Model):
    """O'qituvchi profili"""

    LEVEL_CHOICES = [
        ('teacher', 'O\'qituvchi'),
        ('assistant', 'Assistant'),
        ('expert', 'Expert'),
    ]

    SUBJECT_CHOICES = [
        ('math', 'Matematika'),
        ('physics', 'Fizika'),
        ('chemistry', 'Kimyo'),
        ('biology', 'Biologiya'),
        ('history', 'Tarix'),
        ('literature', 'Adabiyot'),
        ('english', 'Ingliz tili'),
        ('russian', 'Rus tili'),
        ('it', 'Informatika'),
        ('other', 'Boshqa'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='teacher_profile',
        verbose_name='Foydalanuvchi'
    )
    school = models.ForeignKey(
        'schools.School',
        on_delete=models.CASCADE,
        related_name='teachers',
        verbose_name='Maktab'
    )
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES, verbose_name='Fan')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='teacher', verbose_name='Daraja')
    total_points = models.IntegerField(default=0, verbose_name='Jami ball')
    monthly_points = models.IntegerField(default=0, verbose_name='Oylik ball')
    bio = models.TextField(blank=True, verbose_name='Bio')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Yangilangan')

    class Meta:
        verbose_name = 'O\'qituvchi'
        verbose_name_plural = 'O\'qituvchilar'
        ordering = ['-total_points']

    def __str__(self):
        return self.user.get_full_name()

    def update_level(self):
        """Darajani avtomatik yangilash"""
        if self.total_points >= 1000:
            self.level = 'expert'
        elif self.total_points >= 500:
            self.level = 'assistant'
        else:
            self.level = 'teacher'
        self.save()


class TeacherActivity(models.Model):
    """O'qituvchi faoliyati"""

    ACTIVITY_TYPES = [
        ('material', 'Material'),
        ('video', 'Video dars'),
        ('consultation', 'Maslahat'),
        ('training', 'Trening'),
        ('other', 'Boshqa'),
    ]

    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    title = models.CharField(max_length=200, verbose_name='Sarlavha')
    description = models.TextField(blank=True, verbose_name='Tavsif')
    points = models.IntegerField(default=0, verbose_name='Ball')
    date = models.DateTimeField(auto_now_add=True, verbose_name='Sana')

    class Meta:
        verbose_name = 'Faoliyat'
        verbose_name_plural = 'Faoliyatlar'
        ordering = ['-date']

    def __str__(self):
        return f"{self.teacher.user.get_full_name()} - {self.title}"