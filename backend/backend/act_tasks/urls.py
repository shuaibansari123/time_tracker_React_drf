from django.urls import path
from .views import (Act_get_all_view,
                    Act_type_view,
                    Act_name_view,
                    )

urlpatterns = [
    path('', Act_get_all_view.as_view(), name='act_get_all'),
    path('act_types/post', Act_type_view.as_view(), name='act_type_post'),
    path('act_names/post', Act_name_view.as_view(), name='act_name_post'),
    path('act_types/<int:pk>/', Act_type_view.as_view(), name='act_type_delete'),
    path('act_names/<int:pk>/', Act_name_view.as_view(), name='act_name_delete'),
]