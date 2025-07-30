import os
import uuid
import datetime
from dotenv import load_dotenv
from pymongo import MongoClient
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .utils import is_within_radius
import traceback

load_dotenv()

# MongoDB connection
try:
    client = MongoClient(os.getenv("MONGODB_URI"))
    db = client[os.getenv("DATABASE_NAME")]
except Exception as e:
    print("MongoDB connection error:", e)

# 1. Generate Link (Admin only)
@csrf_exempt
@require_http_methods(["POST"])
def generate_link(request):
    data = json.loads(request.body)

    admin_id = data.get("adminId")
    subject = data.get("subject")
    section = data.get("section")
    radius = float(data.get("radius", 0))
    duration = int(data.get("expiry", 2))  # renamed expiry
    lat = float(data.get("lat"))
    lon = float(data.get("lon"))

    if not db.admins.find_one({"adminId": admin_id}):
        return JsonResponse({"error": "Unauthorized admin ID"}, status=401)

    session_id = str(uuid.uuid4())
    expiration = datetime.datetime.utcnow() + datetime.timedelta(minutes=duration)

    db.sessions.insert_one({
        "session_id": session_id,
        "subject": subject,
        "section": section,
        "adminId": admin_id,
        "lat": lat,
        "lon": lon,
        "radius": radius,
        "expires_at": expiration,
        "attendees": []
    })

    return JsonResponse({
        "sessionId": session_id
    })


# 2. Class Form
@csrf_exempt
@require_http_methods(["GET"])
def class_form(request, session_id):
    try:
        session = db.sessions.find_one({"session_id": session_id})
        if not session:
            return JsonResponse({"error": "Invalid session"}, status=404)

        if datetime.datetime.utcnow() > session["expires_at"]:
            return JsonResponse({"error": "Session expired"}, status=410)

        return JsonResponse({
            "subject": session["subject"],
            
            "expires_at": session["expires_at"].isoformat()
        })

    except Exception as e:
        print("Error in class_form:", traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)

# 3. Submit Attendance
@csrf_exempt
@require_http_methods(["POST"])
def submit_attendance(request):
    try:
        data = json.loads(request.body)
        session_id = data.get("session_id")
        name = data.get("name")
        roll = data.get("roll")
        university = data.get("university")
        lat = float(data.get("lat"))
        lon = float(data.get("lon"))

        session = db.sessions.find_one({"session_id": session_id})
        if not session:
            return JsonResponse({"error": "Invalid session"}, status=404)

        if datetime.datetime.utcnow() > session["expires_at"]:
            return JsonResponse({"error": "Session expired"}, status=410)

        # Check radius
        within = is_within_radius(session["lat"], session["lon"], lat, lon, session["radius"])

        db.sessions.update_one(
            {"session_id": session_id},
            {"$push": {"attendees": {
                "name": name,
                "roll": roll,
                "university": university,
                "within_radius": within
            }}}
        )

        return JsonResponse({"status": "success", "within_radius": within})

    except Exception as e:
        print("Error in submit_attendance:", traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)

# 4. Attendance List
@csrf_exempt
@require_http_methods(["GET"])
def attendance_list(request, session_id):
    session = db.sessions.find_one({"session_id": session_id})
    if not session:
        return JsonResponse({"error": "Invalid session"}, status=404)

    return JsonResponse({
        "subject": session["subject"],
        "section": session.get("section", ""),
        "attendees": session["attendees"]
    })
