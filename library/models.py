from django.db import models


class LibraryResource(models.Model):
    """Kutubxona resurslari"""

    RESOURCE_TYPES = [
        ('book', 'Kitob'),
        ('article', 'Maqola'),
        ('guide', 'Qo\'llanma'),
        ('research', 'Tadqiqot'),
        ('other', 'Boshqa'),
    ]

    title = models.CharField(max_length=200, verbose_name='Sarlavha')
    author = models.CharField(max_length=200, verbose_name='Muallif')
    description = models.TextField(verbose_name='Tavsif')
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES, verbose_name='Turi')
    file = models.FileField(upload_to='library/', blank=True, null=True, verbose_name='Fayl')
    url = models.URLField(blank=True, null=True, verbose_name='URL')
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True, verbose_name='Muqova')
    views = models.IntegerField(default=0, verbose_name='Ko\'rishlar')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan')

    class Meta:
        verbose_name = 'Kutubxona resursi'
        verbose_name_plural = 'Kutubxona resurslari'
        ordering = ['-created_at']

    def __str__(self):
        return self.title