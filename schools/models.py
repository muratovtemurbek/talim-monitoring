from django.db import models
from django.conf import settings


class School(models.Model):
    """Maktab"""
    name = models.CharField(max_length=200, verbose_name='Maktab nomi')
    address = models.CharField(max_length=300, verbose_name='Manzil')
    region = models.CharField(max_length=100, blank=True, verbose_name='Viloyat')
    district = models.CharField(max_length=100, blank=True, verbose_name='Tuman')
    director = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_schools',
        verbose_name='Direktor'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan')

    class Meta:
        verbose_name = 'Maktab'
        verbose_name_plural = 'Maktablar'
        ordering = ['name']

    def __str__(self):
        return self.name