from app.database.connection import get_supabase
from app.utils.security import hash_password, verify_password, create_token


def authenticate_user(email: str, password: str):
    supabase = get_supabase()
    response = supabase.table("users").select("*").eq("email", email).single().execute()
    user = response.data

    if not user or not verify_password(password, user["password_hash"]):
        return None

    token = create_token({"sub": str(user["id"]), "email": user["email"], "role": user["role"]})
    return {"token": token, "user": {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]}}


def create_user(name: str, email: str, password: str, role: str = "editor"):
    supabase = get_supabase()
    user_data = {
        "name": name,
        "email": email,
        "password_hash": hash_password(password),
        "role": role,
        "status": "active",
    }
    response = supabase.table("users").insert(user_data).execute()
    if not response.data:
        raise RuntimeError("Insert échoué — vérifiez RLS ou SUPABASE_KEY (service_role requis)")
    return response.data[0]
