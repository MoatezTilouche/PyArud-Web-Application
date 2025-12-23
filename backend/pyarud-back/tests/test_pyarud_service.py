"""
Unit tests for PyArud Service
"""
import pytest
from app.services import PyArudService


class TestPyArudService:
    """Test cases for PyArudService"""
    
    def setup_method(self):
        """Setup test fixtures"""
        self.service = PyArudService()
    
    def test_validate_verse_valid_arabic(self):
        """Test validation with valid Arabic verse"""
        verse = "يا ليلُ الصَّبُّ متى غَدُهُ"
        assert self.service.validate_verse(verse) is True
    
    def test_validate_verse_empty(self):
        """Test validation with empty verse"""
        assert self.service.validate_verse("") is False
    
    def test_validate_verse_too_short(self):
        """Test validation with too short verse"""
        assert self.service.validate_verse("abc") is False
    
    def test_validate_verse_no_arabic(self):
        """Test validation with non-Arabic text"""
        assert self.service.validate_verse("This is English text") is False
    
    def test_get_bahr_info_valid(self):
        """Test getting bahr information"""
        info = self.service.get_bahr_info('المتقارب')
        assert info['name'] == 'المتقارب'
        assert 'pattern' in info
    
    def test_get_bahr_info_unknown(self):
        """Test getting unknown bahr information"""
        info = self.service.get_bahr_info('unknown')
        assert info['name'] == 'unknown'
        assert info['pattern'] == 'غير معروف'
