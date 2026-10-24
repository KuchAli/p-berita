import os
from dotenv import load_dotenv
from supabase import create_client, Client

#supaya bisa masukkan env dan kebaca sama sistem
load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url,key)