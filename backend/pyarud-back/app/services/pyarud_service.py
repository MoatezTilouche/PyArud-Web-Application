from typing import Dict, List, Any
from pyarud.processor import ArudhProcessor


class PyArudService:
    """Service class for PyArud poetry analysis"""

    @staticmethod
    def analyze_poem(verses: List[str]) -> Dict[str, Any]:
        if not verses or not isinstance(verses, list):
            raise ValueError("Verses must be a non-empty list")

        # Filter out empty verses
        verses = [v.strip() for v in verses if v.strip()]
        if not verses:
            raise ValueError("No valid verses provided")

        try:
            processor = ArudhProcessor()
            poem_verses = []

            i = 0
            while i < len(verses):
                verse = verses[i].strip()
                parts = None
                for separator in ['***', '،', '،،', '  ']:
                    if separator in verse:
                        parts = verse.split(separator, 1)
                        if len(parts) == 2:
                            poem_verses.append((parts[0].strip(), parts[1].strip()))
                            break
                if not parts:
                    if i + 1 < len(verses):
                        poem_verses.append((verse, verses[i + 1].strip()))
                        i += 1
                    else:
                        poem_verses.append((verse, verse))
                i += 1

            # Process the poem
            analysis = processor.process_poem(poem_verses)

            # Normalize meter name for robustness
            meter_en = (analysis.get('meter') or 'unknown').lower()
            results = {
                'bahr': meter_en,
                'meter_ar': PyArudService._translate_meter(meter_en),
                'verses_analysis': []
            }

            # Process each verse
            for idx, verse_data in enumerate(analysis.get('verses', []), 1):
                original_verse = f"{poem_verses[idx-1][0]} *** {poem_verses[idx-1][1]}"
                tafila_list = []
                zihaaf_list = []
                is_broken = False

                # Process sadr
                if 'sadr' in verse_data:
                    sadr_feet = verse_data['sadr'].get('feet', [])
                    for foot in sadr_feet:
                        tafila_list.append({
                            'pattern': foot.get('pattern', ''),
                            'status': foot.get('status', 'unknown'),
                            'text': foot.get('text', '')
                        })
                        if foot.get('status') in ['broken', 'missing']:
                            is_broken = True
                        if foot.get('variation'):
                            zihaaf_list.append(foot.get('variation'))

                # Process ajuz
                if 'ajuz' in verse_data:
                    ajuz_feet = verse_data['ajuz'].get('feet', [])
                    for foot in ajuz_feet:
                        tafila_list.append({
                            'pattern': foot.get('pattern', ''),
                            'status': foot.get('status', 'unknown'),
                            'text': foot.get('text', '')
                        })
                        if foot.get('status') in ['broken', 'missing']:
                            is_broken = True
                        if foot.get('variation'):
                            zihaaf_list.append(foot.get('variation'))

                verse_result = {
                    'verse_number': idx,
                    'original_verse': original_verse,
                    'sadr': poem_verses[idx-1][0],
                    'ajuz': poem_verses[idx-1][1],
                    'bahr': results['meter_ar'],
                    'tafila': tafila_list,
                    'zihaaf': zihaaf_list,
                    'is_valid': not is_broken,
                    'status': 'صحيح' if not is_broken else 'مكسور',
                    'details': verse_data
                }

                results['verses_analysis'].append(verse_result)

            return results

        except Exception as e:
            raise Exception(f"PyArud analysis failed: {str(e)}")

    @staticmethod
    def _translate_meter(meter_en: str) -> str:
        """Translate meter name from English to Arabic"""
        meter_map = {
            'taweel': 'الطويل',
            'madeed': 'المديد',
            'baseet': 'البسيط',
            'wafer': 'الوافر',
            'kamel': 'الكامل',
            'kāmil': 'الكامل',  # handle alternate spelling
            'hazaj': 'الهزج',
            'rajaz': 'الرجز',
            'ramal': 'الرمل',
            'sarea': 'السريع',
            'munsareh': 'المنسرح',
            'khafeef': 'الخفيف',
            'mudarae': 'المضارع',
            'muqtadab': 'المقتضب',
            'mujtath': 'المجتث',
            'mutaqareb': 'المتقارب',
            'mutadarek': 'المتدارك'
        }
        return meter_map.get(meter_en, meter_en)

    @staticmethod
    def validate_verse(verse: str) -> bool:
        if not verse or not isinstance(verse, str):
            return False
        verse = verse.strip()
        if len(verse) < 5:
            return False
        return any('\u0600' <= char <= '\u06FF' for char in verse)

    @staticmethod
    def get_bahr_info(bahr_name: str) -> Dict[str, str]:
        bahr_patterns = {
            'المتقارب': 'فعولن فعولن فعولن فعولن',
            'الطويل': 'فعولن مفاعيلن فعولن مفاعيلن',
            'البسيط': 'مستفعلن فاعلن مستفعلن فاعلن',
            'الكامل': 'متفاعلن متفاعلن متفاعلن',
            'الوافر': 'مفاعلتن مفاعلتن فعولن',
            'الرمل': 'فاعلاتن فاعلاتن فاعلاتن',
            'الهزج': 'مفاعيلن مفاعيلن',
            'الرجز': 'مستفعلن مستفعلن مستفعلن',
            'السريع': 'مستفعلن مستفعلن فاعلن',
            'المنسرح': 'مستفعلن مفعولات مفتعلن',
            'الخفيف': 'فاعلاتن مستفعلن فاعلاتن',
            'المضارع': 'مفاعيلن فاعلاتن',
            'المقتضب': 'مفعلات مستفعلن',
            'المجتث': 'مستفعلن فاعلاتن',
            'المتدارك': 'فاعلن فاعلن فاعلن فاعلن'
        }
        return {
            'name': bahr_name,
            'pattern': bahr_patterns.get(bahr_name, 'غير معروف')
        }
