import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class NumberValidator:
    def __init__(self):
        pass

    def validate(self, password, user=None):
        if not any(c.isdigit() for c in password):
            raise ValidationError(_('The password must contain at least one number.'), code='password_no_number')
        
    def get_help_text(self):
        return _(
            'Your password must contain at least one number.'
        )
    
class SpecialSymbolValidator:
    def __init__(self):
        pass

    def validate(self, password, user=None):
        if not re.findall('[ -\/:-@[-`{-~]', password):
            raise ValidationError(_('The password must contain at least one special symbol.'), code='password_no_special')
        
    def get_help_text(self):
        return _(
            'Your password must contain at least one special symbol.'
        )

class UppercaseValidator:
    def __init__(self):
        pass

    def validate(self, password, user=None):
        if not any(c.isupper() for c in password):
            raise ValidationError(_('The password must contain at least one uppercase letter.'), code='password_no_uppercase')
        
    def get_help_text(self):
        return _(
            'Your password must contain at least one uppercase letter.'
        )
    
class LowercaseValidator:
    def __init__(self):
        pass

    def validate(self, password, user=None):
        if not any(c.islower() for c in password):
            raise ValidationError(_('The password must contain at least one lowercase letter.'), code='password_no_lowercase')
        
    def get_help_text(self):
        return _(
            'Your password must contain at least one lowercase letter.'
        )
