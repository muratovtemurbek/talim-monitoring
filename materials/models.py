from django.db import models


class Material(models.Model):
    """Dars materiallari"""

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

    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='materials')
    title = models.CharField(max_length=200, verbose_name='Sarlavha')
    description = models.TextField(verbose_name='Tavsif')
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES, verbose_name='Fan')
    grade = models.IntegerField(verbose_name='Sinf', null=True, blank=True)
    file = models.FileField(upload_to='materials/', verbose_name='Fayl')
    is_approved = models.BooleanField(default=False, verbose_name='Tasdiqlangan')
    views = models.IntegerField(default=0, verbose_name='Ko\'rishlar')
    downloads = models.IntegerField(default=0, verbose_name='Yuklab olishlar')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan')

    class Meta:
        verbose_name = 'Material'
        verbose_name_plural = 'Materiallar'
        ordering = ['-created_at']

    def __str__(self):
        return self.title