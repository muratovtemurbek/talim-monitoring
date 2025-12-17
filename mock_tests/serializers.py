from rest_framework import serializers
from .models import MockTest, Question, TestAttempt


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'order']


class QuestionWithAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer',
                  'explanation', 'order']


class MockTestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = MockTest
        fields = ['id', 'title', 'subject', 'difficulty', 'duration', 'passing_score',
                  'questions_count', 'description', 'questions', 'created_at']


class MockTestExportSerializer(serializers.ModelSerializer):
    """Export uchun to'liq ma'lumotlar bilan serializer"""
    questions = QuestionWithAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = MockTest
        fields = ['id', 'title', 'subject', 'difficulty', 'duration', 'passing_score',
                  'questions_count', 'description', 'questions', 'created_at']


class MockTestListSerializer(serializers.ModelSerializer):
    attempts_count = serializers.SerializerMethodField()
    best_score = serializers.SerializerMethodField()

    class Meta:
        model = MockTest
        fields = ['id', 'title', 'subject', 'difficulty', 'duration', 'passing_score',
                  'questions_count', 'description', 'attempts_count', 'best_score']

    def get_attempts_count(self, obj):
        user = self.context['request'].user
        return obj.attempts.filter(teacher=user).count()

    def get_best_score(self, obj):
        user = self.context['request'].user
        attempt = obj.attempts.filter(teacher=user).order_by('-score').first()
        return attempt.score if attempt else None


class TestAttemptSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source='test.title', read_only=True)
    test_subject = serializers.CharField(source='test.get_subject_display', read_only=True)

    class Meta:
        model = TestAttempt
        fields = ['id', 'test', 'test_title', 'test_subject', 'score', 'correct_answers',
                  'wrong_answers', 'total_questions', 'time_spent', 'passed', 'started_at', 'completed_at']