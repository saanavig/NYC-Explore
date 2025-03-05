from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .supabase_auth import authenticate_google_user

@api_view(['POST'])
def google_login(request):
    id_token = request.data.get('id_token')

    if not id_token:
        return Response({"error": "ID token is required"}, status=400)

    auth_response = authenticate_google_user(id_token)

    if "error" in auth_response:
        return Response(auth_response, status=400)

    return Response(auth_response, status=200)

