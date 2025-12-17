from django.contrib import admin
from .models import MockTest, Question, TestAttempt

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    fields = ['order', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer']

@admin.register(MockTest)
class MockTestAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'difficulty', 'duration', 'questions_count', 'created_at']
    list_filter = ['subject', 'difficulty']
    search_fields = ['title', 'description']
    inlines = [QuestionInline]

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['test', 'order', 'question_text', 'correct_answer']
    list_filter = ['test']
    search_fields = ['question_text']

@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'test', 'score', 'correct_answers', 'passed', 'started_at']
    list_filter = ['passed', 'test__subject']
    search_fields = ['teacher__username', 'test__title']