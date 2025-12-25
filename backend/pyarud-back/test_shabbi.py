import requests

poem = {
    "verses": [
        "إذا الشعب يوما أراد الحياة",
        "فلا بد القدر أن يستجيب"
    ]
}

response = requests.post(
    "http://localhost:5000/api/analyze",
    json=poem
)

data = response.json()['data']
verse = data['verses_analysis'][0]

print("\n" + "="*60)
print("POÈME: ABU AL-QASIM AL-SHABBI")
print("="*60)
print(f"Vers 1: {poem['verses'][0]}")
print(f"Vers 2: {poem['verses'][1]}")

print("\n" + "-"*60)
print("RÉSULTATS:")
print("-"*60)
print(f"Mètre: {data['meter_ar']} ({data['bahr']})")
print(f"Score: {verse['details']['score']}")
print(f"Status: {verse['status']}")
print(f"Is Valid: {verse['is_valid']}")

sadr = verse['details']['sadr_analysis']
ajuz = verse['details']['ajuz_analysis']
ok_count = sum(1 for f in sadr + ajuz if f['status'] == 'ok')
total = len(sadr) + len(ajuz)

print(f"Pieds OK: {ok_count}/{total}")
print("="*60)

if verse['details']['score'] >= 0.5 and data['bahr'] != 'mutadarak':
    print(f"   - Bahr non-mutadarak: {data['bahr']}")
    print(f"   - Score acceptable: {verse['details']['score']}")
    print(f"   - Status: {verse['status']}")
else:
    print(f"\n⚠️ Score: {verse['details']['score']}")
