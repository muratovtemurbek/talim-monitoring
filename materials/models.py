from django.db import models
from teachers.models import Teacher


class Material(models.Model):
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
        ('literature', 'Adabiyot'),
        ('sport', 'Jismoniy tarbiya'),
        ('other', 'Boshqa'),
    ]

    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='materials')
    title = models.CharField(max_length=200, verbose_name='Sarlavha')
    description = models.TextField(blank=True, verbose_name='Tavsif')
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES, verbose_name='Fan')
    grade = models.IntegerField(default=1, verbose_name='Sinf')
    file = models.FileField(upload_to='materials/', max_length=255, verbose_name='Fayl')
    is_approved = models.BooleanField(default=False, verbose_name='Tasdiqlangan')
    views = models.IntegerField(default=0, verbose_name='Ko\'rishlar')
    downloads = models.IntegerField(default=0, verbose_name='Yuklab olishlar')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan sana')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Material'
        verbose_name_plural = 'Materiallar'

    def __str__(self):
        return self.title