from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .models import Time
from .serializers import DateSerializer, TimeSerializer, RecordsSerializer
from django.utils import timezone
from django.db.models import Q

TODAY = timezone.now().date()


class DashboardView(APIView):
    def get(self, request):
        """Get records today to return."""
        try:
            user_id = request.user.id
            records_today = Time.objects.filter(
                Q(date__user=user_id) &
                Q(date__date=TODAY)
            )
            records_serializer = TimeSerializer(records_today, many=True)
            return Response({'records_today': records_serializer.data}, status=status.HTTP_200_OK)
        except Time.DoesNotExist:
            return Response({"error": "No records found for today."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        """Get posted data and save it to the database."""
        try:
            date_data = {'user': request.user.id, 'date': request.data.get('date')}
            date_serializer = DateSerializer(data=date_data)
            if not date_serializer.is_valid():
                return Response(date_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            date = date_serializer.save()
            time_data = {
                'date': date.id,
                'start_time': request.data.get('start_time'),
                'end_time': request.data.get('end_time'),
                'act_type': request.data.get('task_type'),
                'act_name': request.data.get('task_name'),
                'notes': request.data.get('notes')
            }
            time_serializer = TimeSerializer(data=time_data)
            if time_serializer.is_valid():
                time_serializer.save()
                return Response(status=status.HTTP_201_CREATED)
            return Response(time_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RecordView(APIView):
    def get(self, request):
        user_id = request.user.id
        records = Time.objects.filter(date__user=user_id)
        records_serializer = TimeSerializer(records, many=True)
        return Response(records_serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user_id = request.user.id
        start_date = request.data.get('filterStartDate')
        end_date = request.data.get('filterEndDate')
        task_type = request.data.get('filterTaskType')
        task_name = request.data.get('filterTaskName')
        filtered_records = Time.objects.filter(
            Q(date__user=user_id) &
            Q(date__date__range=(start_date, end_date)) &
            (Q(act_type=task_type) if task_type != "all_types" else Q()) &
            (Q(act_name=task_name) if task_name != "all_names" else Q())
        )
        records_serializer = RecordsSerializer(filtered_records, many=True)
        return Response(records_serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        user_id = request.user.id
        record_ids = request.data.get('record_ids', [])
        if not record_ids:
            return Response({'error': 'No records specified'}, status=status.HTTP_400_BAD_REQUEST)
        records_to_delete = Time.objects.filter(
            Q(id__in=record_ids) &
            Q(date__user=user_id)
        )
        records_to_delete.delete()
        return Response({'msg': 'Records deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
