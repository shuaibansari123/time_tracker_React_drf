from django.urls import path

from .views import (DashboardView,
                    RecordView,
                    )

urlpatterns = [
    path('get/', DashboardView.as_view(), name='dashboard_get'),
    path('post/', DashboardView.as_view(), name='dashboard_post'),
    path('records/post/', RecordView.as_view(), name='records_post'),
    path('records/delete/', RecordView.as_view(), name='records_delete'),

    path('act_name/post/', DashboardView.as_view(), name='act_name_post'),
]
