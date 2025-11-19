from django.db import models


class Video(models.Model):
    """Video darslar"""

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

    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=200, verbose_name='Sarlavha')
    description = models.TextField(verbose_name='Tavsif')
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES, verbose_name='Fan')
    grade = models.IntegerField(verbose_name='Sinf', null=True, blank=True)
    video_url = models.URLField(blank=True, null=True, verbose_name='Video URL')
    video_file = models.FileField(upload_to='videos/', blank=True, null=True, verbose_name='Video fayl')
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True, verbose_name='Thumbnail')
    duration = models.IntegerField(default=0, verbose_name='Davomiyligi (sekund)')
    is_approved = models.BooleanField(default=False, verbose_name='Tasdiqlangan')
    views = models.IntegerField(default=0, verbose_name='Ko\'rishlar')
    likes = models.IntegerField(default=0, verbose_name='Likelar')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan')

    class Meta:
        verbose_name = 'Video dars'
        verbose_name_plural = 'Video darslar'
        ordering = ['-created_at']

    def __str__(self):
        return self.title