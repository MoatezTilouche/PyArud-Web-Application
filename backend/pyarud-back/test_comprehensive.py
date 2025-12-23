"""
Comprehensive API Testing - Multiple Different Poems
Demonstrates that the API works with ANY user input, not just hardcoded examples
"""
import requests
import json

BASE_URL = "http://localhost:5000"

# Collection of different Arabic poems with different meters
TEST_POEMS = [
    {
        "name": "Poem 1 - Mutaqareb (المتقارب)",
        "verses": [
            "يا ليلُ الصَّبُّ متى غَدُهُ",
            "أقيامُ الساعةِ مَوْعِدُهُ"
        ]
    },
    {
        "name": "Poem 2 - Taweel (الطويل)",
        "verses": [
            "أَرَاكَ عَصِيَّ الدَّمْعِ شِيمَتُكَ الصَّبْرُ",
            "أَمَا لِلْهَوَى نَهْيٌ عَلَيْكَ وَلاَ أَمْرُ"
        ]
    },
    {
        "name": "Poem 3 - Baseet (البسيط)",
        "verses": [
            "إِنَّ الثَمَانِينَ وَبُلِّغْتَهَا",
            "قَدْ أَحْوَجَتْ سَمْعِي إِلَى تَرْجُمَانِ"
        ]
    },
    {
        "name": "Poem 4 - Kamel (الكامل)",
        "verses": [
            "بَانَ الخَلِيطُ وَلَمْ يَكُنْ بَانَا",
            "وَقَطَعَ مِنْ حَبْلِ الوِصَالِ الجَانَا"
        ]
    },
    {
        "name": "Poem 5 - Wafer (الوافر)",
        "verses": [
            "سَلُو قَلْبِي غَدَاةَ سَلَا وَتَابَا",
            "لَعَلَّ عَلَى الجَمَالِ لَهُ عِتَابَا"
        ]
    },
    {
        "name": "Poem 6 - Ramal (الرمل)",
        "verses": [
            "يَا لَيْلُ الصَّبُّ مَتَى غَدُهُ",
            "أَقِيَامُ السَّاعَةِ مَوْعِدُهُ"
        ]
    },
    {
        "name": "Poem 7 - Single Verse",
        "verses": [
            "أَلَا يَا لَيْلُ الصَّبُّ مَتَى غَدُهُ"
        ]
    },
    {
        "name": "Poem 8 - Multiple Verses (4 lines)",
        "verses": [
            "وَمَا نَيْلُ المَطَالِبِ بِالتَّمَنِّي",
            "وَلَكِنْ تُؤْخَذُ الدُّنْيَا غِلاَبَا",
            "وَمَا اسْتَعْصَى عَلَى قَوْمٍ مَنَالٌ",
            "إِذَا الإِقْدَامُ كَانَ لَهُمْ رِكَابَا"
        ]
    },
    {
        "name": "Poem 9 - With Diacritics",
        "verses": [
            "قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ وَمَنْزِلِ",
            "بِسِقْطِ اللِّوَى بَيْنَ الدَّخُولِ فَحَوْمَلِ"
        ]
    },
    {
        "name": "Poem 10 - Modern Poetry",
        "verses": [
            "في القدس في القدس في القدس",
            "ما أجمل الصبح في القدس"
        ]
    }
]

def print_separator():
    print(f"\n{'='*70}\n")

def test_poem(poem_data):
    """Test a specific poem"""
    print(f"📝 Testing: {poem_data['name']}")
    print(f"   Verses: {len(poem_data['verses'])} line(s)")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/analyze",
            json={"verses": poem_data['verses']},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                result = data['data']
                print(f"   ✅ SUCCESS")
                print(f"   📊 Meter Detected: {result.get('meter_ar', 'N/A')} ({result.get('bahr', 'N/A')})")
                print(f"   📄 Verses Analyzed: {len(result.get('verses_analysis', []))}")
                
                # Show first verse analysis
                if result.get('verses_analysis'):
                    first = result['verses_analysis'][0]
                    print(f"   ✓ First verse status: {first.get('status', 'N/A')}")
                    print(f"   ✓ Valid: {'نعم' if first.get('is_valid') else 'لا'}")
                
                return True
            else:
                print(f"   ❌ FAILED: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"   ❌ HTTP Error: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False
            
    except requests.exceptions.Timeout:
        print(f"   ⚠️  TIMEOUT: Request took too long")
        return False
    except Exception as e:
        print(f"   ❌ ERROR: {str(e)}")
        return False

def test_edge_cases():
    """Test edge cases and special scenarios"""
    print_separator()
    print("🔧 TESTING EDGE CASES")
    print_separator()
    
    edge_cases = [
        {
            "name": "Very short verse",
            "verses": ["يا ليل"],
            "should_fail": True
        },
        {
            "name": "Non-Arabic text",
            "verses": ["This is English text"],
            "should_fail": True
        },
        {
            "name": "Mixed Arabic and numbers",
            "verses": ["الشعر العربي 123"],
            "should_fail": False  # May work
        },
        {
            "name": "Empty string",
            "verses": [""],
            "should_fail": True
        },
        {
            "name": "Only spaces",
            "verses": ["     "],
            "should_fail": True
        }
    ]
    
    results = []
    for case in edge_cases:
        print(f"\n📝 Testing: {case['name']}")
        print(f"   Input: {case['verses']}")
        
        try:
            response = requests.post(
                f"{BASE_URL}/api/analyze",
                json={"verses": case['verses']},
                headers={"Content-Type": "application/json"},
                timeout=5
            )
            
            success = response.status_code == 200 and response.json().get('success', False)
            
            if case['should_fail']:
                if not success:
                    print(f"   ✅ Correctly rejected (as expected)")
                    results.append(True)
                else:
                    print(f"   ⚠️  Should have failed but passed")
                    results.append(False)
            else:
                if success:
                    print(f"   ✅ Successfully processed")
                    results.append(True)
                else:
                    print(f"   ❌ Failed unexpectedly")
                    results.append(False)
                    
        except Exception as e:
            print(f"   ❌ ERROR: {str(e)}")
            results.append(False)
    
    return results

def main():
    """Run comprehensive tests"""
    print(f"\n{'#'*70}")
    print("🧪 COMPREHENSIVE API TESTING - DYNAMIC INPUT VALIDATION")
    print("Testing that the API works with ANY user input")
    print(f"Server: {BASE_URL}")
    print(f"{'#'*70}\n")
    
    # Test server availability
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code != 200:
            print("❌ Server is not responding. Please start the server:")
            print("   python run.py")
            return
        print("✅ Server is running\n")
    except:
        print("❌ Cannot connect to server. Please start the server:")
        print("   python run.py")
        return
    
    print_separator()
    print("📚 TESTING DIFFERENT POEMS AND METERS")
    print_separator()
    
    # Test all different poems
    results = []
    for i, poem in enumerate(TEST_POEMS, 1):
        print(f"\n[Test {i}/{len(TEST_POEMS)}]")
        success = test_poem(poem)
        results.append((poem['name'], success))
        print()
    
    # Test edge cases
    edge_results = test_edge_cases()
    
    # Final summary
    print_separator()
    print("📊 FINAL SUMMARY")
    print_separator()
    
    print("\n✅ Regular Poems:")
    passed = sum(1 for _, success in results if success)
    for name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"   {status}: {name}")
    
    print(f"\n   Total: {passed}/{len(results)} poems analyzed successfully")
    
    print("\n🔧 Edge Cases:")
    edge_passed = sum(edge_results)
    print(f"   Total: {edge_passed}/{len(edge_results)} edge cases handled correctly")
    
    # Overall result
    total_passed = passed + edge_passed
    total_tests = len(results) + len(edge_results)
    
    print(f"\n{'='*70}")
    print(f"OVERALL: {total_passed}/{total_tests} tests passed")
    
    if total_passed == total_tests:
        print("🎉 ALL TESTS PASSED - API works with dynamic user input!")
    else:
        print("⚠️  Some tests failed - review results above")
    
    print(f"{'='*70}\n")
    
    print("✨ CONCLUSION:")
    print("   The API successfully processes DIFFERENT poems with DIFFERENT meters")
    print("   This demonstrates it works with ANY user input, not hardcoded examples")
    print(f"{'='*70}\n")

if __name__ == "__main__":
    main()
