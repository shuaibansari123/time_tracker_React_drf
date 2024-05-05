'''
Serializers for the time_tracker API
'''

from rest_framework import serializers
from .models import Date, Time


class DateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Date
        fields = ['user', 'date']

    def create(self, validated_data):
        date, created = Date.objects.update_or_create(
            user=validated_data.pop('user'),
            date=validated_data.pop('date')
        )
        return date


class TimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Time
        fields = ['date', 'start_time', 'end_time', 'act_type', 'act_name', 'notes']

    def create(self, validated_data):
        time, created = Time.objects.update_or_create(
            date=validated_data.pop('date'),
            start_time=validated_data.pop('start_time'),
            end_time=validated_data.pop('end_time'),
            defaults=validated_data
        )
        return time


class RecordsSerializer(serializers.ModelSerializer):
    date_value = serializers.SerializerMethodField()
    start_time = serializers.SerializerMethodField()
    end_time = serializers.SerializerMethodField()

    class Meta:
        model = Time
        fields = ['id', 'date_value', 'start_time', 'end_time', 'act_type', 'act_name', 'notes']

    def get_date_value(self, obj):
        return obj.date.date.strftime("%Y-%m-%d")

    def get_start_time(self, obj):
        return obj.start_time.strftime("%H:%M") if obj.start_time else None

    def get_end_time(self, obj):
        return obj.end_time.strftime("%H:%M") if obj.end_time else None
