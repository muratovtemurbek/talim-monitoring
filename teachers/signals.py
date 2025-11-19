from django.db.models.signals import post_save
from django.dispatch import receiver
from materials.models import Material
from videos.models import Video
from .models import TeacherActivity


@receiver(post_save, sender=Material)
def create_material_activity(sender, instance, created, **kwargs):
    """Material yaratilganda faoliyat yaratish"""
    if created:
        TeacherActivity.objects.create(
            teacher=instance.teacher,
            activity_type='material',
            title=instance.title,
            description=f"Material yuklandi: {instance.title}",
            points=0  # Tasdiqlangandan keyin ball qo'shiladi
        )


@receiver(post_save, sender=Video)
def create_video_activity(sender, instance, created, **kwargs):
    """Video yaratilganda faoliyat yaratish"""
    if created:
        TeacherActivity.objects.create(
            teacher=instance.teacher,
            activity_type='video',
            title=instance.title,
            description=f"Video yuklandi: {instance.title}",
            points=0  # Tasdiqlangandan keyin ball qo'shiladi
        )