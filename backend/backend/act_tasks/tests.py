from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from time_tracker.models import Act_type, Act_name


class ActTypeTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client.force_authenticate(user=self.user)  # If using IsAuthenticated

    def test_get_all_act_types(self):
        Act_type.objects.create(type='SampleType1', user=self.user)
        Act_type.objects.create(type='SampleType2', user=self.user)

        response = self.client.get(reverse('act_type_list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
