'''
Serializers for the act_tasks API
'''


from rest_framework import serializers
from time_tracker.models import (Act_type, Act_name)

class ActNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Act_name
        fields = ['id', 'act_type', 'name']

class ActGetAllSerializer(serializers.ModelSerializer):
    act_names = ActNameSerializer(many=True, read_only=True, source='act_name_set') # tells DRF to look for the Act_name instances related to Act_type through the reverse relationship (by default, Django sets this to <model_name>_set).

    class Meta:
        model = Act_type
        fields = ['id', 'type', 'user', 'act_names'] # JSON output format &  deserialization input format
class ActTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Act_type
        fields = ['id', 'type', 'user', ] # JSON output format &  deserialization input format
    
    def create(self, validated_data):

        act_type_instance, created = Act_type.objects.update_or_create(
            user=validated_data.pop('user'), 
            type=validated_data.pop('type'), 
        )
        return act_type_instance

'''
1.get task_type + task_name(nested)

2.post task_type indipendently
3.post task_name (should relate to task_type)

4.update task_type indipendently
5.update task_name task_name (should relate to task_type)

6.delete task_type (should delete all related task_name)
7.delete task_name indipendently

'''

