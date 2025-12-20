from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
import traceback
import time

# Gemini API ni sozlash (v1)
client = None
# Modellar ro'yxati - biri ishlamasa keyingisiga o'tadi
GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-exp-1206"]
GEMINI_MODEL_NAME = GEMINI_MODELS[0]
GEMINI_INIT_ERROR = None

try:
    from google import genai
    api_key = getattr(settings, 'GEMINI_API_KEY', None)
    print(f"GEMINI_API_KEY mavjud: {bool(api_key)}")
    if api_key:
        client = genai.Client(api_key=api_key)
        print("Gemini client muvaffaqiyatli yaratildi")
    else:
        GEMINI_INIT_ERROR = "GEMINI_API_KEY sozlanmagan"
        print(GEMINI_INIT_ERROR)
except ImportError as e:
    GEMINI_INIT_ERROR = f"google-genai kutubxonasi topilmadi: {e}"
    print(GEMINI_INIT_ERROR)
except Exception as e:
    GEMINI_INIT_ERROR = f"Gemini init xatolik: {e}"
    print(GEMINI_INIT_ERROR)
    print(traceback.format_exc())


def generate_with_fallback(client, prompt, max_retries=2):
    """Gemini API bilan so'rov yuborish, xatolikda boshqa modelga o'tish"""
    last_error = None

    for model_name in GEMINI_MODELS:
        for attempt in range(max_retries):
            try:
                result = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                )
                return getattr(result, "text", None) or ""
            except Exception as e:
                last_error = e
                error_str = str(e)

                # Quota xatoligi - keyingi modelga o'tish
                if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                    print(f"Model {model_name} kvotasi tugagan, keyingi modelga o'tish...")
                    break  # Keyingi modelga o'tish

                # Boshqa xatolik - retry
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                    continue
                break

    # Barcha modellar ishlamadi
    raise last_error


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
            error_msg = GEMINI_INIT_ERROR or 'AI klient sozlanmagan'
            return Response(
                {'error': error_msg},
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

            # Fallback bilan so'rov yuborish
            answer = generate_with_fallback(client, full_prompt)

            return Response({
                'message': message,
                'response': answer,
                'status': 'success'
            })

        except Exception as e:
            print(f"AI Chat xatolik: {str(e)}")
            print(traceback.format_exc())
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
            error_msg = GEMINI_INIT_ERROR or 'AI klient sozlanmagan'
            return Response(
                {'error': error_msg},
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

            # Fallback bilan so'rov yuborish
            lesson_plan = generate_with_fallback(client, prompt)

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
            error_msg = GEMINI_INIT_ERROR or 'AI klient sozlanmagan'
            return Response(
                {'error': error_msg},
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

            # Fallback bilan so'rov yuborish
            questions_text = generate_with_fallback(client, prompt)

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
