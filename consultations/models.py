from django.db import models
from django.conf import settings


class Consultation(models.Model):
    """Maslahatlar"""

    STATUS_CHOICES = [
        ('pending', 'Kutilmoqda'),
        ('accepted', 'Qabul qilindi'),
        ('rejected', 'Rad etildi'),
        ('completed', 'Yakunlandi'),
    ]

    TYPE_CHOICES = [
        ('online', 'Online'),
        ('offline', 'Offline'),
    ]

    title = models.CharField(max_length=200, verbose_name='Mavzu')
    description = models.TextField(blank=True, verbose_name='Tavsif')
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='consultations_as_mentor')
    student = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='consultations_as_student')
    scheduled_at = models.DateTimeField(verbose_name='Rejalashtirilgan vaqt')
    duration = models.PositiveIntegerField(default=60, verbose_name='Davomiyligi (daqiqa)')
    consultation_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='online', verbose_name='Turi')
    location = models.CharField(max_length=200, blank=True, verbose_name='Manzil')
    meeting_url = models.URLField(blank=True, verbose_name='Uchrashuv havolasi')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Holat')
    notes = models.TextField(blank=True, verbose_name='Eslatmalar')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan')

    class Meta:
        verbose_name = 'Maslahat'
        verbose_name_plural = 'Maslahatlar'
        ordering = ['-scheduled_at']

    def __str__(self):
        return f"{self.title} - {self.teacher.user.get_full_name()}"