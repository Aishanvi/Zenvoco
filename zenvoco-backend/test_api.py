import requests
import json
import io
import os

BASE_URL = "http://localhost:8000"

# Must match LIVE_SERVER_API_KEY in .env (or empty string if not set)
LIVE_SERVER_KEY = os.getenv("LIVE_SERVER_API_KEY", "zenvoco-secure-key-24211a05le")

COMMON_HEADERS = {
    "X-Live-Server-Key": LIVE_SERVER_KEY
}

def run_tests():
    print("Starting Backend API Tests...")
    
    # 1. Health Check
    print("\n[1] Testing Health Index (GET /)")
    res = requests.get(f"{BASE_URL}/", headers=COMMON_HEADERS)
    print(f"Status: {res.status_code}")
    print(f"Response: {res.json()}")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    
    # 2. Register
    print("\n[2] Testing Registration (POST /auth/register)")
    # FIX: Field is 'name', not 'full_name'. Schema = UserRegisterRequest(name, email, password)
    test_user = {"email": "backend_test@example.com", "password": "securepassword", "name": "Test User"}
    res = requests.post(f"{BASE_URL}/auth/register", json=test_user, headers=COMMON_HEADERS)
    print(f"Status: {res.status_code}")
    
    if res.status_code in (200, 201):
        data = res.json()
        print(f"Response: {data}")
        # FIX: /auth/register returns UserResponse model (id, name, email, created_at), not a message string
        assert "id" in data, f"Expected 'id' in register response, got: {data}"
        assert data["email"] == test_user["email"]
        print("Registration successful.")
    elif res.status_code == 400:
        print(f"User already exists (expected on re-runs): {res.text}")
    else:
        print(f"Unexpected registration response: {res.status_code} — {res.text}")

    # 3. Login
    print("\n[3] Testing Login (POST /auth/login)")
    # FIX: /auth/login accepts JSON body with 'email' field, NOT OAuth2 form-data with 'username'
    login_data = {"email": "backend_test@example.com", "password": "securepassword"}
    res = requests.post(f"{BASE_URL}/auth/login", json=login_data, headers=COMMON_HEADERS)
    print(f"Status: {res.status_code}")
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json().get("access_token")
    assert token, "No access_token in login response"
    print(f"Token acquired: {token[:25]}...")
    
    auth_headers = {**COMMON_HEADERS, "Authorization": f"Bearer {token}"}
    
    # 4. Start Practice Session
    print("\n[4] Testing Practice Start (POST /practice/start)")
    session_payload = {"topic": "Backend API Testing Session"}
    res = requests.post(f"{BASE_URL}/practice/start", json=session_payload, headers=auth_headers)
    print(f"Status: {res.status_code}")
    print(f"Response: {res.json()}")
    assert res.status_code == 200, f"Practice start failed: {res.text}"
    session_id = res.json().get("session_id")
    assert session_id, "No session_id in practice start response"
    
    # 5. Submit Practice Audio (Mocking a simple WebM Byte Stream)
    print("\n[5] Testing Practice Audio Submission (POST /practice/submit)")
    dummy_audio = io.BytesIO(b"MOCK_AUDIO_DATA")
    dummy_audio.name = "test_audio.webm"
    files = {"audio": ("test_audio.webm", dummy_audio, "audio/webm")}
    data = {"session_id": session_id, "duration": 42}
    res = requests.post(f"{BASE_URL}/practice/submit", files=files, data=data, headers=auth_headers)
    print(f"Status: {res.status_code}")
    # Will return mocked inference data when no real OpenAI key is set / audio is invalid
    print(f"Response: {json.dumps(res.json(), indent=2)}")
    assert res.status_code == 200, f"Practice submit failed: {res.text}"
    
    # 6. Fetch Progress
    print("\n[6] Testing Progress Retrieval (GET /progress/)")
    res = requests.get(f"{BASE_URL}/progress/", headers=auth_headers)
    print(f"Status: {res.status_code}")
    data = res.json()
    print(f"Total Sessions: {data.get('total_sessions')}")
    print(f"Latest Confidence Score: {data.get('latest_confidence_score')}")
    print(f"Avg Duration returned: {data.get('avg_duration')} seconds")
    assert res.status_code == 200, f"Progress fetch failed: {res.text}"
    
    # 7. Fetch Dashboard
    print("\n[7] Testing Dashboard (GET /dashboard/user)")
    res = requests.get(f"{BASE_URL}/dashboard/user", headers=auth_headers)
    print(f"Status: {res.status_code}")
    print(f"User profile: {res.json().get('user_profile')}")
    assert res.status_code == 200, f"Dashboard fetch failed: {res.text}"

    # 8. Fetch User Profile
    print("\n[8] Testing User Profile (GET /user/profile)")
    res = requests.get(f"{BASE_URL}/user/profile", headers=auth_headers)
    print(f"Status: {res.status_code}")
    print(f"Response: {res.json()}")
    assert res.status_code == 200, f"Profile fetch failed: {res.text}"

    print("\n[OK] All Backend Endpoints Responded Successfully!")

if __name__ == "__main__":
    try:
        run_tests()
    except AssertionError as e:
        print(f"\n❌ A test failed! {e}")
    except Exception as e:
        print(f"\n[ERROR] Execution Error: {e}")
