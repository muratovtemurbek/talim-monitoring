from google import genai  # YANGI kutubxona

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings

# Gemini API ni sozlash (v1, gemini-2.0-flash)
try:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    GEMINI_MODEL_NAME = "gemini-2.0-flash"  # 2.0 modelidan foydalanamiz
except Exception as e:
    client = None
    GEMINI_MODEL_NAME = "gemini-2.0-flash"


class AIAssistantView(APIView):
    """AI Yordamchi - Google Gemini (2.0-flash)"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Savolga javob berish"""
        message = request.data.get('message', '')

        if not message:
            return Response(
                {'error': 'Xabar kiritilmagan'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if client is None:
            return Response(
                {'error': 'AI klient sozlanmagan'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            # System prompt - O'qituvchilar uchun yordamchi
            system_prompt = """Sen ta'lim sohasida tajribali AI yordamchisan. 
            Sening vazifang:
            - O'qituvchilarga dars rejalarini tuzishda yordam berish
            - Pedagogik maslahatlar berish
            - Ta'lim metodikalari haqida ma'lumot berish
            - O'quv materiallarini tayyorlashda yordam berish
            - Talabalar bilan ishlash bo'yicha tavsiyalar berish

            Javoblaringni qisqa, aniq va foydali qilib ber.
            O'zbek tilida javob ber (agar savol o'zbek tilida bo'lsa).
            """

            full_prompt = f"{system_prompt}\n\nFoydalanuvchi savoli: {message}"

            # Yangi v1 uslubi: client.models.generate_content(...)
            result = client.models.generate_content(
                model=GEMINI_MODEL_NAME,
                contents=full_prompt,
            )

            answer = getattr(result, "text", None) or ""

            return Response({
                'message': message,
                'response': answer,
                'status': 'success'
            })

        except Exception as e:
            return Response(
                {'error': f'AI xatolik: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AIChatHistoryView(APIView):
    """Chat tarixini saqlash va olish"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Chat tarixini olish (hozircha bo'sh)"""
        return Response({
            'history': [],
            'message': 'Chat tarixi'
        })


class AILessonPlanView(APIView):
    """Dars rejasi yaratish"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Dars rejasi generatsiya qilish"""
        subject = request.data.get('subject', '')
        topic = request.data.get('topic', '')
        grade = request.data.get('grade', '')
        duration = request.data.get('duration', '45')

        if not subject or not topic or not grade:
            return Response(
                {'error': 'Fan, mavzu va sinf kiritilishi shart'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if client is None:
            return Response(
                {'error': 'AI klient sozlanmagan'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            prompt = f"""
            Quyidagi ma'lumotlar asosida to'liq dars rejasini tuzib ber:

            Fan: {subject}
            Mavzu: {topic}
            Sinf: {grade}-sinf
            Dars davomiyligi: {duration} daqiqa

            Dars rejasiga quyidagilar kirsin:
            1. Darsning maqsadi (ta'limiy, tarbiyaviy, rivojlantiruvchi)
            2. Dars uchun kerakli jihozlar
            3. Darsning borishi (bosqichlar bilan):
               - Tashkiliy qism (2-3 daqiqa)
               - O'tgan mavzuni so'rash (5-7 daqiqa)
               - Yangi mavzu bayoni (15-20 daqiqa)
               - Mustahkamlash (10-15 daqiqa)
               - Baholash va uyga vazifa (3-5 daqiqa)
            4. Qo'shimcha materiallar va manbalar

            Javobni strukturalangan, sarlavhalar bilan, o'qishga qulay formatda ber.
            """

            result = client.models.generate_content(
                model=GEMINI_MODEL_NAME,
                contents=prompt,
            )
            lesson_plan = getattr(result, "text", None) or ""

            return Response({
                'subject': subject,
                'topic': topic,
                'grade': grade,
                'duration': duration,
                'lesson_plan': lesson_plan,
                'status': 'success'
            })

        except Exception as e:
            return Response(
                {'error': f'AI xatolik: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AITestGeneratorView(APIView):
    """Test savollari yaratish"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Test savollarini generatsiya qilish"""
        subject = request.data.get('subject', '')
        topic = request.data.get('topic', '')
        grade = request.data.get('grade', '')
        count = request.data.get('count', 10)
        difficulty = request.data.get('difficulty', 'medium')

        if not subject or not topic:
            return Response(
                {'error': 'Fan va mavzu kiritilishi shart'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if client is None:
            return Response(
                {'error': 'AI klient sozlanmagan'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            difficulty_text = {
                'easy': 'oson',
                'medium': "o'rtacha",
                'hard': 'qiyin'
            }.get(difficulty, "o'rtacha")

            prompt = f"""
            Quyidagi ma'lumotlar asosida test savollarini yaratib ber:

            Fan: {subject}
            Mavzu: {topic}
            Sinf: {grade}-sinf
            Savollar soni: {count} ta
            Qiyinlik darajasi: {difficulty_text}

            Har bir savol uchun:
            - Savol matni
            - 4 ta javob varianti (A, B, C, D)
            - To'g'ri javob

            Format:
            1. Savol matni?
            A) variant1
            B) variant2
            C) variant3
            D) variant4
            To'g'ri javob: X

            Savollarni {difficulty_text} darajada yaratib ber.
            """

            result = client.models.generate_content(
                model=GEMINI_MODEL_NAME,
                contents=prompt,
            )
            questions_text = getattr(result, "text", None) or ""

            return Response({
                'subject': subject,
                'topic': topic,
                'grade': grade,
                'count': count,
                'difficulty': difficulty,
                'questions': questions_text,
                'status': 'success'
            })

        except Exception as e:
            return Response(
                {'error': f'AI xatolik: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
