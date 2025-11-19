import django_filters
from .models import Material


class MaterialFilter(django_filters.FilterSet):
    subject = django_filters.ChoiceFilter(choices=Material.SUBJECT_CHOICES)
    grade = django_filters.NumberFilter()
    grade_min = django_filters.NumberFilter(field_name='grade', lookup_expr='gte')
    grade_max = django_filters.NumberFilter(field_name='grade', lookup_expr='lte')
    is_approved = django_filters.BooleanFilter()
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    search = django_filters.CharFilter(field_name='title', lookup_expr='icontains')

    class Meta:
        model = Material
        fields = ['subject', 'grade', 'is_approved']