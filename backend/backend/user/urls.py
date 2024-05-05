from django.urls import path
from .views import (UserRegistrationView, 
                    VerifyEmailView, 
                    GoogleOAuth2CallbackView, 
                    LoginView,
                    LogoutView,
                    
                    )

urlpatterns = [
    # path("/", .as_view(), name=""),
    path('signup/post/', UserRegistrationView.as_view(), name='user_signup'),
    path('verify_email/get/', VerifyEmailView.as_view(), name='verify_email'),
    path('callback/', GoogleOAuth2CallbackView.as_view(), name='GoogleOAuth2Callback'),
    path('login/post/', LoginView.as_view(), name="login"),
    path('logout/post/', LogoutView.as_view(), name='logout')
    ]
