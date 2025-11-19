from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom User Model"""

    ROLE_CHOICES = [
        ('superadmin', 'Superadmin'),
        ('admin', 'Admin/Direktor'),
        ('teacher', 'O\'qituvchi'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='teacher', verbose_name='Rol')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Telefon')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name='Avatar')

    class Meta:
        verbose_name = 'Foydalanuvchi'
        verbose_name_plural = 'Foydalanuvchilar'

    def __str__(self):
        return self.get_full_name() or self.username