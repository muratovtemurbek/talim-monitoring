import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

TEST_DATA = {
    'username': 'teacher1',
    'password': 'teacher123'
}

ACCESS_TOKEN = None
HEADERS = {}

GREEN = '\033[92m'
RED = '\033[91m'
BLUE = '\033[94m'
YELLOW = '\033[93m'
RESET = '\033[0m'


def print_test(name, status, message=""):
    icon = f"{GREEN}✅{RESET}" if status else f"{RED}❌{RESET}"
    print(f"{icon} {name:<40} {message}")


def print_section(title):
    print(f"\n{BLUE}{'=' * 60}{RESET}")
    print(f"{BLUE}{title:^60}{RESET}")
    print(f"{BLUE}{'=' * 60}{RESET}\n")


def test_login():
    global ACCESS_TOKEN, HEADERS
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=TEST_DATA)
        if response.status_code == 200:
            data = response.json()
            ACCESS_TOKEN = data['access']
            HEADERS = {'Authorization': f'Bearer {ACCESS_TOKEN}'}
            print_test("Login", True, f"Token: {ACCESS_TOKEN[:20]}...")
            return True
        else:
            print_test("Login", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("Login", False, str(e))
        return False


def test_profile():
    try:
        response = requests.get(f"{BASE_URL}/auth/profile/", headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            print_test("Profile", True, f"User: {data.get('username')}")
            return True
        else:
            print_test("Profile", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("Profile", False, str(e))
        return False


def test_dashboard():
    try:
        response = requests.get(f"{BASE_URL}/auth/dashboard/", headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            print_test("Dashboard", True, f"Materials: {data.get('total_materials', 0)}")
            return True
        else:
            print_test("Dashboard", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("Dashboard", False, str(e))
        return False


def test_materials_list():
    try:
        response = requests.get(f"{BASE_URL}/materials/", headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            count = data.get('count', len(data) if isinstance(data, list) else 0)
            print_test("Materials List", True, f"Count: {count}")
            return True
        else:
            print_test("Materials List", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("Materials List", False, str(e))
        return False


def test_my_materials():
    try:
        response = requests.get(f"{BASE_URL}/materials/my_materials/", headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                count = len(data)
            elif isinstance(data, dict):
                count = data.get('count', len(data.get('results', [])))
            else:
                count = 0
            print_test("My Materials", True, f"Count: {count}")
            return True
        else:
            print_test("My Materials", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("My Materials", False, str(e))
        return False


def test_videos_list():
    try:
        response = requests.get(f"{BASE_URL}/videos/", headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            count = data.get('count', len(data) if isinstance(data, list) else 0)
            print_test("Videos List", True, f"Count: {count}")
            return True
        else:
            print_test("Videos List", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("Videos List", False, str(e))
        return False


def test_my_videos():
    try:
        response = requests.get(f"{BASE_URL}/videos/my_videos/", headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                count = len(data)
            elif isinstance(data, dict):
                count = data.get('count', len(data.get('results', [])))
            else:
                count = 0
            print_test("My Videos", True, f"Count: {count}")
            return True
        else:
            print_test("My Videos", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("My Videos", False, str(e))
        return False


def test_teacher_profile():
    """Teacher profile test"""
    try:
        response = requests.get(
            f"{BASE_URL}/teachers/my_profile/",  # ✅ FAQAT BITTA "teachers"
            headers=HEADERS
        )

        if response.status_code == 200:
            data = response.json()
            print_test("Teacher Profile", True, f"Points: {data.get('total_points', 0)}")
            return True
        else:
            print_test("Teacher Profile", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("Teacher Profile", False, str(e))
        return False


def test_teacher_activities():
    try:
        response = requests.get(f"{BASE_URL}/teachers/activities/my_activities/", headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            count = len(data) if isinstance(data, list) else 0
            print_test("Teacher Activities", True, f"Count: {count}")
            return True
        else:
            print_test("Teacher Activities", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("Teacher Activities", False, str(e))
        return False


def test_ratings():
    try:
        response = requests.get(f"{BASE_URL}/ratings/", headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            count = data.get('count', len(data) if isinstance(data, list) else 0)
            print_test("Ratings", True, f"Count: {count}")
            return True
        else:
            print_test("Ratings", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("Ratings", False, str(e))
        return False


def test_schools():
    try:
        response = requests.get(f"{BASE_URL}/schools/", headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            count = data.get('count', len(data) if isinstance(data, list) else 0)
            print_test("Schools", True, f"Count: {count}")
            return True
        else:
            print_test("Schools", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("Schools", False, str(e))
        return False


def test_ai_chat():
    try:
        response = requests.post(f"{BASE_URL}/ai/chat/", headers=HEADERS, json={'message': 'Salom!'})
        if response.status_code == 200:
            data = response.json()
            print_test("AI Chat", True, f"Response length: {len(data.get('response', ''))}")
            return True
        else:
            print_test("AI Chat", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("AI Chat", False, str(e))
        return False


def test_ai_lesson_plan():
    try:
        response = requests.post(
            f"{BASE_URL}/ai/lesson-plan/",
            headers=HEADERS,
            json={'subject': 'Matematika', 'topic': 'Kvadrat tenglamalar', 'grade': '9', 'duration': '45'}
        )
        if response.status_code == 200:
            data = response.json()
            print_test("AI Lesson Plan", True, f"Plan length: {len(data.get('lesson_plan', ''))}")
            return True
        else:
            print_test("AI Lesson Plan", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("AI Lesson Plan", False, str(e))
        return False


def test_ai_test_generator():
    try:
        response = requests.post(
            f"{BASE_URL}/ai/generate-test/",
            headers=HEADERS,
            json={'subject': 'Matematika', 'topic': 'Kvadrat tenglamalar', 'grade': '9', 'count': 5,
                  'difficulty': 'medium'}
        )
        if response.status_code == 200:
            data = response.json()
            print_test("AI Test Generator", True, f"Questions length: {len(data.get('questions', ''))}")
            return True
        else:
            print_test("AI Test Generator", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("AI Test Generator", False, str(e))
        return False


def test_library():
    try:
        response = requests.get(f"{BASE_URL}/library/", headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            count = data.get('count', len(data) if isinstance(data, list) else 0)
            print_test("Library", True, f"Count: {count}")
            return True
        else:
            print_test("Library", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("Library", False, str(e))
        return False


def test_consultations():
    try:
        response = requests.get(f"{BASE_URL}/consultations/", headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            count = data.get('count', len(data) if isinstance(data, list) else 0)
            print_test("ConsultationCard.jsx", True, f"Count: {count}")
            return True
        else:
            print_test("ConsultationCard.jsx", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("ConsultationCard.jsx", False, str(e))
        return False


def test_lesson_analysis():
    try:
        response = requests.get(f"{BASE_URL}/lesson-analysis/", headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            count = data.get('count', len(data) if isinstance(data, list) else 0)
            print_test("Lesson Analysis", True, f"Count: {count}")
            return True
        else:
            print_test("Lesson Analysis", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("Lesson Analysis", False, str(e))
        return False


def run_all_tests():
    print(f"\n{YELLOW}{'=' * 60}{RESET}")
    print(f"{YELLOW}{'API TEST BOSHLANDI':^60}{RESET}")
    print(f"{YELLOW}{'=' * 60}{RESET}")
    print(f"{YELLOW}Vaqt: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{RESET}")
    print(f"{YELLOW}Base URL: {BASE_URL}{RESET}")
    print(f"{YELLOW}{'=' * 60}{RESET}\n")

    results = {'total': 0, 'passed': 0, 'failed': 0}

    print_section("AUTHENTICATION")
    results['total'] += 1
    if test_login():
        results['passed'] += 1
    else:
        results['failed'] += 1
    results['total'] += 1
    if test_profile():
        results['passed'] += 1
    else:
        results['failed'] += 1
    results['total'] += 1
    if test_dashboard():
        results['passed'] += 1
    else:
        results['failed'] += 1

    print_section("MATERIALS")
    results['total'] += 1
    if test_materials_list():
        results['passed'] += 1
    else:
        results['failed'] += 1
    results['total'] += 1
    if test_my_materials():
        results['passed'] += 1
    else:
        results['failed'] += 1

    print_section("VIDEOS")
    results['total'] += 1
    if test_videos_list():
        results['passed'] += 1
    else:
        results['failed'] += 1
    results['total'] += 1
    if test_my_videos():
        results['passed'] += 1
    else:
        results['failed'] += 1

    print_section("TEACHERS")
    results['total'] += 1
    if test_teacher_profile():
        results['passed'] += 1
    else:
        results['failed'] += 1
    results['total'] += 1
    if test_teacher_activities():
        results['passed'] += 1
    else:
        results['failed'] += 1

    print_section("RATINGS")
    results['total'] += 1
    if test_ratings():
        results['passed'] += 1
    else:
        results['failed'] += 1

    print_section("SCHOOLS")
    results['total'] += 1
    if test_schools():
        results['passed'] += 1
    else:
        results['failed'] += 1

    print_section("AI ASSISTANT")
    results['total'] += 1
    if test_ai_chat():
        results['passed'] += 1
    else:
        results['failed'] += 1
    results['total'] += 1
    if test_ai_lesson_plan():
        results['passed'] += 1
    else:
        results['failed'] += 1
    results['total'] += 1
    if test_ai_test_generator():
        results['passed'] += 1
    else:
        results['failed'] += 1

    print_section("LIBRARY")
    results['total'] += 1
    if test_library():
        results['passed'] += 1
    else:
        results['failed'] += 1

    print_section("CONSULTATIONS")
    results['total'] += 1
    if test_consultations():
        results['passed'] += 1
    else:
        results['failed'] += 1

    print_section("LESSON ANALYSIS")
    results['total'] += 1
    if test_lesson_analysis():
        results['passed'] += 1
    else:
        results['failed'] += 1

    print(f"\n{YELLOW}{'=' * 60}{RESET}")
    print(f"{YELLOW}{'TEST YAKUNLANDI':^60}{RESET}")
    print(f"{YELLOW}{'=' * 60}{RESET}\n")

    print(f"{BLUE}Jami testlar:{RESET} {results['total']}")
    print(f"{GREEN}Muvaffaqiyatli:{RESET} {results['passed']}")
    print(f"{RED}Xato:{RESET} {results['failed']}")

    success_rate = (results['passed'] / results['total']) * 100
    print(f"\n{BLUE}Muvaffaqiyat darajasi:{RESET} {success_rate:.1f}%\n")

    if results['failed'] == 0:
        print(f"{GREEN}🎉 BARCHA TESTLAR MUVAFFAQIYATLI O'TDI! 🎉{RESET}\n")
    else:
        print(f"{RED}⚠️  {results['failed']} ta test xato bilan tugadi{RESET}\n")


if __name__ == "__main__":
    try:
        run_all_tests()
    except KeyboardInterrupt:
        print(f"\n\n{YELLOW}Test to'xtatildi{RESET}\n")
    except Exception as e:
        print(f"\n\n{RED}Umumiy xatolik: {e}{RESET}\n")