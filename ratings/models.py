from django.db import models


class TeacherRating(models.Model):
    """O'qituvchilar reytingi"""

    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='ratings')
    month = models.DateField(verbose_name='Oy')
    total_points = models.IntegerField(default=0, verbose_name='Jami ball')
    rank = models.IntegerField(default=0, verbose_name='O\'rin')

    class Meta:
        verbose_name = 'O\'qituvchi reytingi'
        verbose_name_plural = 'O\'qituvchilar reytingi'
        unique_together = ['teacher', 'month']
        ordering = ['-month', 'rank']

    def __str__(self):
        return f"{self.teacher.user.get_full_name()} - {self.month.strftime('%Y-%m')}"


class SchoolRating(models.Model):
    """Maktablar reytingi"""

    school = models.ForeignKey('schools.School', on_delete=models.CASCADE, related_name='ratings')
    month = models.DateField(verbose_name='Oy')
    total_points = models.IntegerField(default=0, verbose_name='Jami ball')
    rank = models.IntegerField(default=0, verbose_name='O\'rin')
    teachers_count = models.IntegerField(default=0, verbose_name='O\'qituvchilar soni')

    class Meta:
        verbose_name = 'Maktab reytingi'
        verbose_name_plural = 'Maktablar reytingi'
        unique_together = ['school', 'month']
        ordering = ['-month', 'rank']

    def __str__(self):
        return f"{self.school.name} - {self.month.strftime('%Y-%m')}"