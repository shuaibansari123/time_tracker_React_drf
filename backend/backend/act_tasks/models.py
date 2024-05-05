from django.db import models
from django.contrib.auth.models import User

class ActivityType(models.Model):
    """
    Represents the type of an activity associated with a User.
    """
    type_name = models.CharField(max_length=100)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='activity_types'
    )
    def __str__(self):
        return f'User: {self.user.username} Type: {self.type_name}'

class Activity(models.Model):
    """
    Represents an individual activity with a reference to its type.
    """
    name = models.CharField(max_length=100)
    activity_type = models.ForeignKey(
        ActivityType,
        on_delete=models.CASCADE,
        related_name='activities'
    )

    def __str__(self):
        return f'{self.activity_type.type_name} - {self.name}'
