from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid


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


class PasswordResetToken(models.Model):
    """Parol tiklash tokeni"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Parol tiklash tokeni'
        verbose_name_plural = 'Parol tiklash tokenlari'

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(hours=24)
        super().save(*args, **kwargs)

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    def __str__(self):
        return f"{self.user.username} - {self.token}"