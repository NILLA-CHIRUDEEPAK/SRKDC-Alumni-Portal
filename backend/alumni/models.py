from django.db import models

class Alumni(models.Model):
    full_name = models.CharField(max_length=100)
    batch = models.CharField(max_length=10)
    company = models.CharField(max_length=100)
    pin = models.CharField(max_length=10, default="0000")
    email = models.EmailField()
    linkedin_url = models.URLField()
    
    # Hiring & Mentorship Features
    is_hiring = models.BooleanField(default=False)
    hiring_role = models.CharField(max_length=100, blank=True, null=True)
    
    # NEW FIELDS
    skills = models.CharField(max_length=200, blank=True, null=True)
    advice = models.TextField(blank=True, null=True)
    can_help_with = models.CharField(max_length=200, default="Career Guidance")

    def __str__(self):
        return self.full_name