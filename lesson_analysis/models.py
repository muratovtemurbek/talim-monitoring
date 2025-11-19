from django.db import models
from django.conf import settings


class LessonAnalysis(models.Model):
    """Dars tahlili"""

    STATUS_CHOICES = [
        ('draft', 'Qoralama'),
        ('pending', 'Tasdiq kutilmoqda'),
        ('approved', 'Tasdiqlangan'),
        ('rejected', 'Rad etilgan'),
    ]

    RATING_CHOICES = [
        (5, 'A\'lo (5)'),
        (4, 'Yaxshi (4)'),
        (3, 'Qoniqarli (3)'),
        (2, 'Qoniqarsiz (2)'),
        (1, 'Yomon (1)'),
    ]

    # Asosiy ma'lumotlar
    analyzer = models.ForeignKey(
        'teachers.Teacher',
        on_delete=models.CASCADE,
        related_name='analyses_given',
        verbose_name='Tahlilchi'
    )
    teacher = models.ForeignKey(
        'teachers.Teacher',
        on_delete=models.CASCADE,
        related_name='analyses_received',
        verbose_name='Dars o\'tgan o\'qituvchi'
    )

    # Dars ma'lumotlari
    lesson_date = models.DateTimeField(verbose_name='Dars sanasi')
    subject = models.CharField(max_length=100, verbose_name='Fan')
    grade = models.IntegerField(verbose_name='Sinf')
    topic = models.CharField(max_length=300, verbose_name='Mavzu')
    lesson_type = models.CharField(
        max_length=50,
        choices=[
            ('new', 'Yangi mavzu'),
            ('practice', 'Mashq darsi'),
            ('review', 'Takrorlash'),
            ('exam', 'Nazorat'),
        ],
        default='new',
        verbose_name='Dars turi'
    )

    # Baholash mezonlari
    methodology_rating = models.IntegerField(
        choices=RATING_CHOICES,
        verbose_name='Metodika (5 ball)'
    )
    material_mastery = models.IntegerField(
        choices=RATING_CHOICES,
        verbose_name='Materialni egallash (5 ball)'
    )
    student_engagement = models.IntegerField(
        choices=RATING_CHOICES,
        verbose_name='O\'quvchilar faolligi (5 ball)'
    )
    time_management = models.IntegerField(
        choices=RATING_CHOICES,
        verbose_name='Vaqtni taqsimlash (5 ball)'
    )
    technology_use = models.IntegerField(
        choices=RATING_CHOICES,
        verbose_name='Texnologiya qo\'llash (5 ball)'
    )

    # Tahlil matnlari
    achievements = models.TextField(verbose_name='Yutuqlar va ijobiy tomonlar')
    weaknesses = models.TextField(verbose_name='Kamchiliklar')
    recommendations = models.TextField(verbose_name='Tavsiyalar va takliflar')

    # Umumiy baho
    overall_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Umumiy baho'
    )

    # Holat
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        verbose_name='Holat'
    )

    # Tasdiqlanish
    approved_at = models.DateTimeField(null=True, blank=True, verbose_name='Tasdiqlangan vaqt')
    rejection_reason = models.TextField(blank=True, verbose_name='Rad etish sababi')

    # Qo'shimcha
    notes = models.TextField(blank=True, verbose_name='Qo\'shimcha izohlar')
    attachments = models.FileField(
        upload_to='lesson_analysis/',
        null=True,
        blank=True,
        verbose_name='Biriktirmalar (rasm, video)'
    )

    # Vaqt belgilari
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='O\'zgartirilgan')

    class Meta:
        verbose_name = 'Dars tahlili'
        verbose_name_plural = 'Dars tahliллари'
        ordering = ['-lesson_date']

    def __str__(self):
        return f"{self.teacher.user.get_full_name()} - {self.lesson_date.strftime('%Y-%m-%d')}"

    def calculate_overall_rating(self):
        """Umumiy bahoni hisoblash"""
        total = (
                self.methodology_rating +
                self.material_mastery +
                self.student_engagement +
                self.time_management +
                self.technology_use
        )
        self.overall_rating = total / 5
        return self.overall_rating

    def save(self, *args, **kwargs):
        # Umumiy bahoni avtomatik hisoblash
        if not self.overall_rating:
            self.calculate_overall_rating()
        super().save(*args, **kwargs)


class LessonAnalysisComment(models.Model):
    """Tahlilga izohlar"""

    analysis = models.ForeignKey(
        LessonAnalysis,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='Tahlil'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name='Foydalanuvchi'
    )
    comment = models.TextField(verbose_name='Izoh')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan')

    class Meta:
        verbose_name = 'Izoh'
        verbose_name_plural = 'Izohlar'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.user.username} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"