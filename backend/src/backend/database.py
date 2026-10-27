import os
from dotenv import load_dotenv
from supabase import create_client, Client

#supaya bisa masukkan env dan kebaca sama sistem
load_dotenv()

url = os.getenv("SUPABASE_URL")

supabase = create_client(url, os.getenv("SUPABASE_SERVICE_KEY"))

def get_auth_client():
    #client baru per request, pakai anon key, khusus login dan verifikasi token
    return create_client(url, os.getenv("SUPABASE_ANON_KEY"))