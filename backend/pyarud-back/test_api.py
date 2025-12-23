"""
API Testing Script
Run this script to test all PyArud API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def print_response(name, response):
    """Pretty print API response"""
    print(f"\n{'='*60}")
    print(f"TEST: {name}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    print(f"Response:")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    print(f"{'='*60}\n")

def test_health():
    """Test health check endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print_response("Health Check", response)
    return response.status_code == 200

def test_api_status():
    """Test API status endpoint"""
    response = requests.get(f"{BASE_URL}/api/status")
    print_response("API Status", response)
    return response.status_code == 200

def test_validate_verse():
    """Test verse validation endpoint"""
    data = {
        "verse": "يا ليلُ الصَّبُّ متى غَدُهُ"
    }
    response = requests.post(
        f"{BASE_URL}/api/validate",
        json=data,
        headers={"Content-Type": "application/json"}
    )
    print_response("Validate Verse", response)
    return response.status_code == 200

def test_analyze_poem():
    """Test poem analysis endpoint"""
    data = {
        "verses": [
            "يا ليلُ الصَّبُّ متى غَدُهُ",
            "أقيامُ الساعةِ مَوْعِدُهُ"
        ]
    }
    response = requests.post(
        f"{BASE_URL}/api/analyze",
        json=data,
        headers={"Content-Type": "application/json"}
    )
    print_response("Analyze Poem", response)
    return response.status_code == 200

def test_get_bahr_info():
    """Test get bahr information endpoint"""
    bahr_name = "المتقارب"
    response = requests.get(f"{BASE_URL}/api/bahr/{bahr_name}")
    print_response(f"Get Bahr Info: {bahr_name}", response)
    return response.status_code == 200

def test_error_cases():
    """Test error handling"""
    print(f"\n{'#'*60}")
    print("TESTING ERROR CASES")
    print(f"{'#'*60}\n")
    
    # Test with empty verses
    print("Test 1: Empty verses array")
    response = requests.post(
        f"{BASE_URL}/api/analyze",
        json={"verses": []},
        headers={"Content-Type": "application/json"}
    )
    print_response("Empty Verses", response)
    
    # Test with invalid verse (no Arabic)
    print("Test 2: Invalid verse (no Arabic characters)")
    response = requests.post(
        f"{BASE_URL}/api/analyze",
        json={"verses": ["This is English text"]},
        headers={"Content-Type": "application/json"}
    )
    print_response("Invalid Verse", response)
    
    # Test with missing data
    print("Test 3: Missing verses field")
    response = requests.post(
        f"{BASE_URL}/api/analyze",
        json={},
        headers={"Content-Type": "application/json"}
    )
    print_response("Missing Field", response)

def main():
    """Run all tests"""
    print(f"\n{'#'*60}")
    print("PyArud API Testing Suite")
    print(f"Server: {BASE_URL}")
    print(f"{'#'*60}\n")
    
    results = []
    
    try:
        # Test basic endpoints
        results.append(("Health Check", test_health()))
        results.append(("API Status", test_api_status()))
        
        # Test validation
        results.append(("Validate Verse", test_validate_verse()))
        
        # Test main analysis
        results.append(("Analyze Poem", test_analyze_poem()))
        
        # Test bahr info
        results.append(("Get Bahr Info", test_get_bahr_info()))
        
        # Test error cases
        test_error_cases()
        
        # Summary
        print(f"\n{'#'*60}")
        print("TEST SUMMARY")
        print(f"{'#'*60}")
        for test_name, passed in results:
            status = "✅ PASSED" if passed else "❌ FAILED"
            print(f"{test_name}: {status}")
        
        total = len(results)
        passed = sum(1 for _, p in results if p)
        print(f"\nTotal: {passed}/{total} tests passed")
        print(f"{'#'*60}\n")
        
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Cannot connect to server!")
        print(f"Make sure the server is running at {BASE_URL}")
        print("Run: python run.py")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    main()
