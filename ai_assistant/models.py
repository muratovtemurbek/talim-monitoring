from django.db import models
from django.conf import settings


class ChatHistory(models.Model):
    """AI yordamchisi suhbat tarixi"""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_history')
    message = models.TextField(verbose_name='Xabar')
    response = models.TextField(verbose_name='Javob')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan')

    class Meta:
        verbose_name = 'Suhbat tarixi'
        verbose_name_plural = 'Suhbat tarixi'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"