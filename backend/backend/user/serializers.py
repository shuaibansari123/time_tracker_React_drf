'''
Serializers for the user API
'''

from django.contrib.auth.models import User
from rest_framework import serializers

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = User
        fields = [
            'username', 
            'first_name',
            'last_name',
            'email', 
            'password', 
            'password2',
            ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, *args, **kwargs):
            user = User(
                email=self.validated_data['email'],
                username=self.validated_data['email'].split('@')[0],
                first_name=self.validated_data['first_name'],
                last_name=self.validated_data['last_name'],
                )
            password = self.validated_data['password']
            password2 = self.validated_data['password2']

            if password != password2:
                raise serializers.ValidationError({'password': 'Passwords must match.'})
            user.set_password(password)
            user.save()
            return user
