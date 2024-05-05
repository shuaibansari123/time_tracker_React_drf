import requests
from requests.exceptions import RequestException
# django
from django.contrib.auth.models import User, update_last_login
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from django.db import DatabaseError
# DRF
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import APIException
# JWT
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError, TokenBackendError
from rest_framework_simplejwt.backends import TokenBackend
# serializers
from .serializers import UserRegistrationSerializer

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()  # Returns built-in User object
                user.is_active = False
                user.save()

                # Generate JWT for the user
                refreshToken = RefreshToken.for_user(user)
                accessToken = str(refreshToken.access_token)

                # Generate Verification URL
                verify_url = f"{request.build_absolute_uri(reverse('verify_email'))}?accessToken={accessToken}"

                # Email contents
                email_data = {
                    'email_subject': 'Verify your email',
                    'html_message': f"""
                        <h2>Please verify your email: </h2>
                        <h3>Hi {user.username},</h3>
                        <p>Click the link below to verify your email :</p>
                        <p><a href='{verify_url}' target='_blank'><strong>Verify Email</strong></a></p>
                        """,
                    'to_email': user.email,
                }

                # Try to send email to the user
                send_mail(
                    subject=email_data['email_subject'],
                    message="",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email_data['to_email']],
                    fail_silently=False,
                    html_message=email_data['html_message']
                )
            except Exception as e:  # It's good practice to log this exception.
                # Consider logging the exception here for debugging purposes
                return Response({'error': 'Failed to complete registration. Please try again later.'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({"Success":"User created"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
class VerifyEmailView(APIView):
    def get(self, request):
        accessToken = request.GET.get('accessToken')  
        if not accessToken:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token_backend = TokenBackend(algorithm=settings.SIMPLE_JWT['ALGORITHM'], 
                                         signing_key = settings.SECRET_KEY,)
            valid_data = token_backend.decode(token=accessToken, verify=True)
            user_id = valid_data.get('user_id')
            user = User.objects.get(id=user_id)
           
            if not user.is_active:
                user.is_active = True
                user.save()
                return Response({'msg': 'Successfully activated'}, status=status.HTTP_200_OK)
            else:
                return Response({'msg': 'User already activated'}, status=status.HTTP_200_OK)
        except (InvalidToken, TokenError, User.DoesNotExist) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except TokenBackendError:
            return Response({'error': "Token is invalid or expired"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  
        
class GoogleOAuth2CallbackView(APIView):
    def post(self, request):
        """Handle the callback from Google OAuth2.0. Exchange code for token and fetch user profile.
            1. Receive the Authorization Code for access token from Google Endpoint.
            2. Exchange the Code for Tokens to Google's Token Endpoint.
            3. Fetch the User's Profile using the access token.
            4. Create or Retrieve the User to the database from the google profile.
            5. Generate JWT Tokens for the user.
            6. Return the Tokens to the Frontend.
        """
        # 1. Receive the Authorization Code for access token.
        # code = request.GET.get('code')
        # if not code:
        #     return Response({'error': 'Code not provided'}, status=status.HTTP_400_BAD_REQUEST)
        # 2. Exchange the Code for Tokens from Google's Token Endpoint.
        try:
            # token_url = 'https://oauth2.googleapis.com/token'
            # data = {
            #     'code': code,
            #     'client_id': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY_CLINT_ID,
            #     'client_secret': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
            #     'redirect_uri': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_REDIRECT_URI,
            #     'grant_type': 'authorization_code',
            #     }
            # rsp = requests.post(token_url, data=data)
            # rsp.raise_for_status()  
            # rsp_data = rsp.json()  
            # access_token = rsp_data.get('access_token')
            access_token = request.data.get('access_token')
            print(access_token)
            
            # if not access_token:
            #     error_details = rsp_data.get('error_description', 'No additional error info from Google.')
            #     return Response({'error': 'Failed to obtain access token', 'details': error_details},
            #                     status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except RequestException as e:
            error_msg = str(e)
            return Response({'error': 'Failed to exchange code for token', 'details': error_msg},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # 3. Fetch the User's Profile
        try:
            profile_url = 'https://www.googleapis.com/oauth2/v1/userinfo'
            headers = {'Authorization': f'Bearer {access_token}'}
            profile_response = requests.get(profile_url, headers=headers)
            profile_response.raise_for_status()
            profile_data = profile_response.json()
        except requests.exceptions.RequestException as e:
            return Response({'error': 'Failed to fetch user profile', 'details': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
        # 4. Create or Retrieve the User to the database
        try:
            user, created = User.objects.get_or_create(
                username=profile_data['email'].split('@')[0],
                defaults={
                    'username': profile_data['email'].split('@')[0],
                    'email': profile_data['email'],
                    'first_name': profile_data['given_name'],
                    'last_name': profile_data['family_name'],
                })
        except Exception as e:
            return Response({'error': 'Failed to create or retrieve user', 'details': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # 5. Generate JWT Tokens
        refresh_token = RefreshToken.for_user(user)
        access_token = str(refresh_token.access_token)
        refresh_token = str(refresh_token)
        # Update the last login time
        update_last_login(None, user)
        
        # 6. Return the Tokens to the Frontend
        if created:
            # If the user is new, set unusable password
            user.set_unusable_password()  
            user.save()
            return Response({'access_token': access_token, 
                             'user_id': user.id,
                             'msg': 'Oauth2, New user created successfully',},
                            status=status.HTTP_200_OK)
        else:
            return Response({'access_token': access_token, 
                            'user_id': user.id,
                            'msg': 'Oauth2, User log in successfully',}, 
                            status=status.HTTP_200_OK)
  
class LoginView(APIView):
    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            user = User.objects.filter(email=email).first()
            
            if user is None or not user.check_password(password):
                return Response(
                    {'msg': 'Invalid email or password'},
                    status=status.HTTP_401_UNAUTHORIZED)
            elif not user.is_active:
                return Response(
                    {'msg': 'User is not active, please check your email'},
                    status=status.HTTP_401_UNAUTHORIZED)
            else:
                refresh_token = RefreshToken.for_user(user)
                access_token = str(refresh_token.access_token)
                refresh_token = str(refresh_token)
                return Response(
                    {'userId': user.id,
                     'accessToken': access_token, 
                     'refreshToken': refresh_token, 
                     'msg': 'User log in successfully'},
                    status=status.HTTP_200_OK)
        except DatabaseError:
            return Response(
                {'msg': 'Database error, please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except APIException as e:
            return Response(
                {'msg': str(e)},
                status=e.status_code)
        except Exception as e:
            return Response(
                {'msg': 'An unexpected error occurred.', 'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    # Check if the user is authenticated (If the header contains valid credentials - token) else return 401
    permission_classes = [IsAuthenticated,...]
    def post(self, request):
        try:
            # Get the refresh token from request data
            refresh_token = request.data.get('refreshToken')
            if refresh_token:
                # Attempt to blacklist the given refresh token
                try:
                    token = RefreshToken(refresh_token)
                    # Blacklist the given token
                    token.blacklist()
                except (TokenError, InvalidToken):
                    return Response({'msg': 'Bad refresh token.'}, status=status.HTTP_400_BAD_REQUEST)

            # The access token is not blacklisted here, as it's stateless. The client should delete it.
            return Response({'msg': 'Logout successful. Please delete your access token client-side.'}, 
                            status=status.HTTP_205_RESET_CONTENT)
        except (TokenError, InvalidToken):
            return Response({'msg': 'Bad token.'}, 
                            status=status.HTTP_400_BAD_REQUEST)


