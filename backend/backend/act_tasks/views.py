
from .serializers import (ActTypeSerializer, 
                          ActNameSerializer, 
                          ActGetAllSerializer
                          ) 
from time_tracker.models import Act_type, Act_name

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated


class Act_get_all_view(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id or 1        
        act_types= Act_type.objects.filter(user=user_id)
        serializer = ActGetAllSerializer(act_types, many=True)
        # print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

class Act_type_view(APIView):
    # permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user_id = request.user.id
        serializer = ActTypeSerializer(data={**request.data, 
                                             "user": user_id
                                             })
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_object(self, pk):
        return Act_type.objects.get(pk=pk)
    
    def delete(self, request, pk):

        act_type = self.get_object(pk)
        act_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    # def put(self, request, pk):
    #     act_type = self.get_object(pk)
    #     serializer = ActTypeSerializer(act_type, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    
    
class Act_name_view(APIView):
    # permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = ActNameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_object(self, pk):
        return Act_name.objects.get(pk=pk)

    # def put(self, request, pk):
    #     act_name = self.get_object(pk)
    #     serializer = ActNameSerializer(act_name, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        act_name = self.get_object(pk)
        act_name.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
