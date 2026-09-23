import os
import json
import time
import shutil
import hashlib
import secrets
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, File, UploadFile, Request, HTTPException, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Bypass PaddleX remote connectivity checks to prevent startup delays
os.environ["PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK"] = "True"
os.environ["FLAGS_enable_pir_api"] = "0"
os.environ["PADDLE_ENABLE_PIR"] = "0"
os.environ["FLAGS_use_mkldnn"] = "0"

from paddle_extractor import extract_land_record, init_mobile_predictors

app = FastAPI(title="BhoomiIntelli Backend & OCR Service", version="2.0.0")

@app.on_event("startup")
async def startup_event():
    print("[STARTUP] Pre-warming PaddleOCR mobile engine in background thread...")
    asyncio.create_task(asyncio.to_thread(init_mobile_predictors))

# ── CORS ────────────────────────────────────────────────────────
_raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:3000,https://*.vercel.app"
)
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Database Path Resolution ──────────────────────────────────
is_vercel = os.getenv("VERCEL") is not None
base_dir = os.path.dirname(os.path.abspath(__file__))
default_db_dir = "/tmp/database" if is_vercel else os.path.abspath(os.path.join(base_dir, "..", "database"))
os.makedirs(default_db_dir, exist_ok=True)

CITIZEN_USERS_FILE = os.path.join(default_db_dir, "citizen_users.json")
ADMIN_USERS_FILE = os.path.join(default_db_dir, "admin_users.json")
RECORDS_FILE = os.path.join(default_db_dir, "records.json")

# ── Helper Functions for JSON Storage & Hashing ──────────────
def read_json_file(path: str) -> List[Dict[str, Any]]:
    if not os.path.exists(path):
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[DB] Error reading {os.path.basename(path)}: {e}")
        return []

def write_json_file(path: str, data: List[Dict[str, Any]]) -> bool:
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"[DB] Error writing {os.path.basename(path)}: {e}")
        return False

def hash_password(password: str, salt: str) -> str:
    """Computes SHA-256 hash of password concatenated with unique salt."""
    return hashlib.sha256((password + salt).encode("utf-8")).hexdigest()

def strip_credentials(user: Dict[str, Any]) -> Dict[str, Any]:
    """Strips secret salt and passwordHash before returning user object to client."""
    safe = dict(user)
    safe.pop("salt", None)
    safe.pop("passwordHash", None)
    return safe

# ── Pydantic Request Models ────────────────────────────────────
class CitizenRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = ""
    district: Optional[str] = "Gurugram"
    state: Optional[str] = "Haryana"
    aadhaarNumber: Optional[str] = None
    aadhaarVerified: Optional[bool] = False

class CitizenLoginRequest(BaseModel):
    email: str
    password: str

class AdminLoginRequest(BaseModel):
    email: str
    password: str

class AdminRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "Revenue Inspector"
    department: Optional[str] = "Land Records Division"
    district: Optional[str] = "Gurugram"
    state: Optional[str] = "Haryana"
    phone: Optional[str] = ""

# ── Citizen Auth Endpoints ─────────────────────────────────────
@app.post("/api/auth/citizen/register")
async def citizen_register(req: CitizenRegisterRequest):
    email = req.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email address.")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    users = read_json_file(CITIZEN_USERS_FILE)
    if any(u.get("email", "").lower() == email for u in users):
        raise HTTPException(status_code=409, detail="An account with this email address already exists.")

    salt = secrets.token_hex(16)
    hashed_pwd = hash_password(req.password, salt)
    user_id = f"USR-{secrets.randbelow(90000) + 10000}"

    new_user = {
        "id": user_id,
        "name": req.name.strip(),
        "email": email,
        "salt": salt,
        "passwordHash": hashed_pwd,
        "phone": req.phone or "",
        "isPhoneVerified": bool(req.phone),
        "district": req.district or "Gurugram",
        "state": req.state or "Haryana",
        "aadhaarVerified": req.aadhaarVerified or False,
        "aadhaarNumber": f"XXXX XXXX {req.aadhaarNumber[-4:]}" if req.aadhaarNumber and len(req.aadhaarNumber) >= 4 else None,
        "status": "Active",
        "role": "Citizen",
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "lastLogin": datetime.utcnow().isoformat() + "Z"
    }

    users.append(new_user)
    write_json_file(CITIZEN_USERS_FILE, users)
    print(f"[AUTH] New citizen registered: {email} (ID: {user_id})")

    return {
        "success": True,
        "message": "Account created successfully.",
        "user": strip_credentials(new_user)
    }

@app.post("/api/auth/citizen/login")
async def citizen_login(req: CitizenLoginRequest):
    email = req.email.strip().lower()
    users = read_json_file(CITIZEN_USERS_FILE)
    user = next((u for u in users if u.get("email", "").lower() == email), None)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    salt = user.get("salt", "")
    expected_hash = user.get("passwordHash", "")
    computed_hash = hash_password(req.password, salt)

    if not secrets.compare_digest(expected_hash, computed_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    user["lastLogin"] = datetime.utcnow().isoformat() + "Z"
    write_json_file(CITIZEN_USERS_FILE, users)
    print(f"[AUTH] Citizen login successful: {email}")

    return {
        "success": True,
        "message": "Login successful.",
        "user": strip_credentials(user)
    }

@app.get("/api/auth/citizen/users")
async def get_citizen_users():
    """Returns list of registered citizens for Admin User Directory (credentials excluded)."""
    users = read_json_file(CITIZEN_USERS_FILE)
    return [strip_credentials(u) for u in users]

@app.put("/api/auth/citizen/profile")
async def update_citizen_profile(request: Request):
    data = await request.json()
    email = data.get("email", "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Missing user email.")

    users = read_json_file(CITIZEN_USERS_FILE)
    user_idx = next((i for i, u in enumerate(users) if u.get("email", "").lower() == email), -1)
    if user_idx < 0:
        raise HTTPException(status_code=404, detail="User not found.")

    target = users[user_idx]
    for key in ["name", "phone", "district", "state", "address", "dob", "gender", "aadhaarVerified", "aadhaarNumber"]:
        if key in data:
            target[key] = data[key]

    write_json_file(CITIZEN_USERS_FILE, users)
    return {"success": True, "user": strip_credentials(target)}

# ── Admin Auth Endpoints ───────────────────────────────────────
@app.post("/api/auth/admin/login")
async def admin_login(req: AdminLoginRequest):
    email = req.email.strip().lower()
    admins = read_json_file(ADMIN_USERS_FILE)
    admin = next((a for a in admins if a.get("email", "").lower() == email), None)

    if not admin:
        raise HTTPException(status_code=401, detail="Invalid administrative credentials.")

    salt = admin.get("salt", "")
    expected_hash = admin.get("passwordHash", "")
    computed_hash = hash_password(req.password, salt)

    if not secrets.compare_digest(expected_hash, computed_hash):
        raise HTTPException(status_code=401, detail="Invalid administrative credentials.")

    admin["lastLogin"] = datetime.utcnow().isoformat() + "Z"
    write_json_file(ADMIN_USERS_FILE, admins)
    print(f"[AUTH] Admin officer login: {email} ({admin.get('role', 'Officer')})")

    return {
        "success": True,
        "message": "Admin authorization granted.",
        "user": strip_credentials(admin)
    }

@app.post("/api/auth/admin/register")
async def admin_register(req: AdminRegisterRequest):
    email = req.email.strip().lower()
    admins = read_json_file(ADMIN_USERS_FILE)
    if any(a.get("email", "").lower() == email for a in admins):
        raise HTTPException(status_code=409, detail="An administrator account with this email already exists.")

    salt = secrets.token_hex(16)
    hashed_pwd = hash_password(req.password, salt)
    admin_id = f"ADM-{secrets.randbelow(900) + 100}"

    new_admin = {
        "id": admin_id,
        "name": req.name.strip(),
        "email": email,
        "salt": salt,
        "passwordHash": hashed_pwd,
        "role": req.role or "Revenue Inspector",
        "department": req.department or "Land Records Division",
        "district": req.district or "Gurugram",
        "state": req.state or "Haryana",
        "phone": req.phone or "",
        "status": "Active",
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "lastLogin": None
    }

    admins.append(new_admin)
    write_json_file(ADMIN_USERS_FILE, admins)
    return {"success": True, "user": strip_credentials(new_admin)}

@app.get("/api/auth/admin/users")
async def get_admin_users():
    admins = read_json_file(ADMIN_USERS_FILE)
    return [strip_credentials(a) for a in admins]

# ── Land Records Database Endpoints ───────────────────────────
@app.get("/api/records")
async def get_records(userEmail: Optional[str] = Query(None)):
    records = read_json_file(RECORDS_FILE)
    if userEmail:
        records = [r for r in records if r.get("userEmail", "").lower() == userEmail.strip().lower()]
    return records

@app.get("/api/records/{record_id}")
async def get_record_by_id(record_id: str):
    records = read_json_file(RECORDS_FILE)
    rec = next((r for r in records if r.get("id") == record_id or r.get("parcelId") == record_id), None)
    if not rec:
        raise HTTPException(status_code=404, detail="Land record not found.")
    return rec

@app.post("/api/records")
async def create_or_update_record(request: Request):
    new_record = await request.json()
    records = read_json_file(RECORDS_FILE)
    
    record_id = new_record.get("id")
    existing_index = next((i for i, r in enumerate(records) if r.get("id") == record_id), -1)
    
    now_iso = datetime.utcnow().isoformat() + "Z"
    if existing_index >= 0:
        new_record["updatedAt"] = now_iso
        records[existing_index].update(new_record)
    else:
        new_record["createdAt"] = new_record.get("createdAt", now_iso)
        new_record["updatedAt"] = now_iso
        records.insert(0, new_record)
        
    write_json_file(RECORDS_FILE, records)
    return {"success": True, "record": new_record}

@app.put("/api/records/{record_id}")
async def update_record_partial(record_id: str, request: Request):
    updates = await request.json()
    records = read_json_file(RECORDS_FILE)
    existing_index = next((i for i, r in enumerate(records) if r.get("id") == record_id), -1)
    if existing_index < 0:
        raise HTTPException(status_code=404, detail="Land record not found.")
    
    updates["updatedAt"] = datetime.utcnow().isoformat() + "Z"
    records[existing_index].update(updates)
    write_json_file(RECORDS_FILE, records)
    return {"success": True, "record": records[existing_index]}

# ── Health Check ───────────────────────────────────────────
@app.get("/api/ocr/health")
async def health_check():
    return {
        "status": "ok",
        "service": "bhoomintelli-ocr-backend",
        "version": "2.0.0",
        "databaseConfigured": True,
        "paddleConfigured": True,
        "engine": "PaddleOCR v3 (Hindi + English)",
        "timestamp": time.time(),
    }

# ── File Upload Config & OCR Extraction ────────────────────
uploads_dir = "/tmp/uploads" if is_vercel else os.path.join(base_dir, "uploads")
os.makedirs(uploads_dir, exist_ok=True)

@app.post("/api/ocr/extract")
async def extract_ocr(
    request: Request,
    document: Optional[UploadFile] = File(None),
    file: Optional[UploadFile] = File(None),
    hint: Optional[str] = Form(None)
):
    start_time = time.time()
    
    upload = document or file
    if not upload:
        form = await request.form()
        upload = form.get("document") or form.get("file")
        
    if not upload or not hasattr(upload, "filename"):
        raise HTTPException(status_code=400, detail="No document file uploaded. Send file under field 'document' or 'file'.")
        
    ext = os.path.splitext(upload.filename)[1].lower() or ".jpg"
    file_path = os.path.join(uploads_dir, f"{int(time.time()*1000)}{ext}")
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload.file, buffer)
            
        print(f"[{'='*60}]")
        print(f"[OCR] Processing extraction request via PaddleOCR")
        print(f"[OCR] File: {upload.filename}")
        print(f"[{'='*60}]")
        
        # Execute OCR non-blocking in threadpool to keep FastAPI event loop responsive
        extracted_data = await asyncio.to_thread(extract_land_record, file_path, upload.filename)
        
        result = {
            "success": True,
            "data": extracted_data,
            "meta": {
                "originalFilename": upload.filename,
                "totalTimeMs": int((time.time() - start_time) * 1000)
            }
        }
        
        print(f"[OCR] [SUCCESS] Extraction complete in {result['meta']['totalTimeMs']}ms")
        print(f"[OCR] Extracted Owner: {extracted_data.get('ownerName', 'N/A')}")
        print(f"[OCR] Extracted Khasra: {extracted_data.get('khasraNo', 'N/A')}\n")
        
        return JSONResponse(content=result)
        
    except Exception as e:
        print(f"[OCR] [FAILED] Extraction failed:", str(e))
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e),
                "hint": "Internal server error during PaddleOCR extraction."
            }
        )
    finally:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3001))
    print(f"\n{'='*60}")
    print(f"  [API] BhoomiIntelli Dual DB Backend + PaddleOCR Service")
    print(f"  [API] Running on http://localhost:{port}")
    print(f"  [DB]  Database path: {default_db_dir}")
    print(f"{'='*60}\n")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
