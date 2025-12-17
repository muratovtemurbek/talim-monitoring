from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import MockTest, Question, TestAttempt
from .serializers import (
    MockTestSerializer,
    MockTestListSerializer,
    MockTestExportSerializer,
    TestAttemptSerializer,
    QuestionWithAnswerSerializer
)


class MockTestViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = MockTest.objects.all()
        subject = self.request.query_params.get('subject', None)
        difficulty = self.request.query_params.get('difficulty', None)

        if subject:
            queryset = queryset.filter(subject=subject)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)

        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return MockTestListSerializer
        return MockTestSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Test natijasini yuborish"""
        test = self.get_object()
        answers = request.data.get('answers', {})
        time_spent = request.data.get('time_spent', 0)

        correct_answers = 0
        total_questions = test.questions.count()

        for question in test.questions.all():
            user_answer = answers.get(str(question.id))
            if user_answer == question.correct_answer:
                correct_answers += 1

        wrong_answers = total_questions - correct_answers
        score = int((correct_answers / total_questions) * 100) if total_questions > 0 else 0
        passed = score >= test.passing_score

        attempt = TestAttempt.objects.create(
            teacher=request.user,
            test=test,
            score=score,
            correct_answers=correct_answers,
            wrong_answers=wrong_answers,
            total_questions=total_questions,
            time_spent=time_spent,
            passed=passed,
            answers=answers
        )

        # Return questions with answers for review
        questions = test.questions.all()
        questions_data = QuestionWithAnswerSerializer(questions, many=True).data

        return Response({
            'attempt': TestAttemptSerializer(attempt).data,
            'questions': questions_data
        })

    @action(detail=False, methods=['get'])
    def my_attempts(self, request):
        """Foydalanuvchining barcha urinishlari"""
        attempts = TestAttempt.objects.filter(teacher=request.user).order_by('-completed_at')
        serializer = TestAttemptSerializer(attempts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='attempt/(?P<attempt_id>[^/.]+)')
    def attempt_detail(self, request, attempt_id=None):
        """Bitta urinish detallari"""
        try:
            attempt = TestAttempt.objects.get(id=attempt_id, teacher=request.user)
            questions = attempt.test.questions.all()
            questions_data = QuestionWithAnswerSerializer(questions, many=True).data

            return Response({
                'attempt': TestAttemptSerializer(attempt).data,
                'questions': questions_data
            })
        except TestAttempt.DoesNotExist:
            return Response({'error': 'Topilmadi'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='import')
    def import_test(self, request):
        """Excel dan testlarni import qilish (Admin only)"""
        if not request.user.is_staff and request.user.role not in ['admin', 'superadmin']:
            return Response({'error': 'Ruxsat yo\'q'}, status=status.HTTP_403_FORBIDDEN)

        try:
            with transaction.atomic():
                # Test yaratish
                test = MockTest.objects.create(
                    title=request.data.get('title'),
                    subject=request.data.get('subject'),
                    difficulty=request.data.get('difficulty'),
                    duration=request.data.get('duration'),
                    passing_score=request.data.get('passing_score'),
                    description=request.data.get('description', ''),
                    questions_count=len(request.data.get('questions', []))
                )

                # Savollarni yaratish
                for idx, q_data in enumerate(request.data.get('questions', []), 1):
                    Question.objects.create(
                        test=test,
                        question_text=q_data.get('question_text'),
                        option_a=q_data.get('option_a'),
                        option_b=q_data.get('option_b'),
                        option_c=q_data.get('option_c'),
                        option_d=q_data.get('option_d'),
                        correct_answer=q_data.get('correct_answer'),
                        explanation=q_data.get('explanation', ''),
                        order=idx
                    )

                return Response({
                    'message': 'Test muvaffaqiyatli yaratildi',
                    'test_id': test.id
                }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='export')
    def export_tests(self, request):
        """Barcha testlarni export qilish (Admin only)"""
        if not request.user.is_staff and request.user.role not in ['admin', 'superadmin']:
            return Response({'error': 'Ruxsat yo\'q'}, status=status.HTTP_403_FORBIDDEN)

        tests = MockTest.objects.all().prefetch_related('questions')
        serializer = MockTestExportSerializer(tests, many=True)
        return Response(serializer.data)