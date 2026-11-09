#!/usr/bin/env python3
"""
Local Development Server for Publimarca Studio (Port 3000).
Serves:
  - /en and /es (localized website routes)
  - /admin (Panel de Control & Supabase CMS dashboard)
  - GET /api/cms (loads all dynamic sections from Supabase when connected, with local fallback)
  - POST /api/cms (saves all dynamic sections & deletions to Supabase + local store)
  - POST /api/supabase/seed (pushes all default site data into Supabase tables)
  - POST /api/upload (saves uploaded videos, logos, and images into /uploads/ and /public/uploads/)
  - POST /api/commission (stores commission briefs into Supabase & local store)
  - /sitemap.xml, /robots.txt, and static assets (with HTTP 206 Range video streaming)
"""

import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import shutil
import smtplib
import ssl
import subprocess
import tempfile
import urllib.parse
import urllib.request
import uuid
from datetime import datetime, timezone
from email.message import EmailMessage
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import unquote, urlparse

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
CMS_STORE_PATH = os.path.join(ROOT_DIR, "data", "cms_store.json")
TMP_CMS_STORE_PATH = "/tmp/publimarca_cms_store.json"
ENV_LOCAL_PATH = os.path.join(ROOT_DIR, ".env.local")
if os.path.isfile(ENV_LOCAL_PATH):
    try:
        with open(ENV_LOCAL_PATH, "r", encoding="utf-8") as _ef:
            for _line in _ef:
                _line = _line.strip()
                if _line and not _line.startswith("#") and "=" in _line:
                    _k, _v = _line.split("=", 1)
                    os.environ.setdefault(_k.strip(), _v.strip())
    except Exception:
        pass
UPLOADS_DIR = os.path.join(ROOT_DIR, "uploads")
PUBLIC_UPLOADS_DIR = os.path.join(ROOT_DIR, "public", "uploads")

# Active admin session tokens & stateless HMAC secret for Vercel serverless compatibility
ACTIVE_ADMIN_SESSIONS = {}
REVOKED_TOKENS = set()
DEFAULT_ADMIN_EMAIL = "admin@publimarca.do"
DEFAULT_ADMIN_PASSWORD = "Publimarca2025!"
TOKEN_SIGNING_SECRET = os.environ.get("ADMIN_TOKEN_SECRET", "publimarca_studio_hmac_secret_2025")


def _hash_password(password: str) -> str:
    return hashlib.sha256(("publimarca_salt::" + password).encode("utf-8")).hexdigest()


def _create_session_token(user_info: dict) -> str:
    raw_json = json.dumps(user_info, separators=(",", ":")).encode("utf-8")
    b64 = base64.urlsafe_b64encode(raw_json).decode("ascii").rstrip("=")
    sig = hmac.new(TOKEN_SIGNING_SECRET.encode("utf-8"), b64.encode("ascii"), hashlib.sha256).hexdigest()
    token = f"{b64}.{sig}"
    ACTIVE_ADMIN_SESSIONS[token] = user_info
    return token


def _verify_session_token(token: str):
    if not token or token in REVOKED_TOKENS:
        return None
    if token in ACTIVE_ADMIN_SESSIONS:
        return ACTIVE_ADMIN_SESSIONS[token]
    if "." in token:
        try:
            b64, sig = token.split(".", 1)
            expected_sig = hmac.new(
                TOKEN_SIGNING_SECRET.encode("utf-8"), b64.encode("ascii"), hashlib.sha256
            ).hexdigest()
            if hmac.compare_digest(sig, expected_sig):
                padding = "=" * (-len(b64) % 4)
                user_info = json.loads(base64.urlsafe_b64decode(b64 + padding).decode("utf-8"))
                return user_info
        except Exception:
            return None
    return None


def get_admin_credentials(store: dict) -> dict:
    auth_cfg = store.get("admin_auth") or {}
    email = (auth_cfg.get("email") or DEFAULT_ADMIN_EMAIL).strip()
    pwd_hash = auth_cfg.get("password_hash") or _hash_password(DEFAULT_ADMIN_PASSWORD)
    return {"email": email, "password_hash": pwd_hash}


def verify_supabase_auth_login(sb_cfg: dict, email: str, password: str) -> bool:
    """Optionally authenticate against Supabase Auth if user exists in Supabase Auth."""
    url = (sb_cfg.get("url") or "").strip().rstrip("/")
    key = (sb_cfg.get("publishableKey") or sb_cfg.get("anonKey") or "").strip()
    if not url or not key or not url.startswith("http"):
        return False
    try:
        endpoint = f"{url}/auth/v1/token?grant_type=password"
        payload = json.dumps({"email": email, "password": password}).encode("utf-8")
        req = urllib.request.Request(
            endpoint,
            data=payload,
            headers={
                "apikey": key,
                "Content-Type": "application/json",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            if 200 <= resp.status < 300:
                data = json.loads(resp.read().decode("utf-8"))
                return bool(data.get("access_token"))
    except Exception:
        return False
    return False


def read_local_cms_store() -> dict:
    for candidate in (TMP_CMS_STORE_PATH, CMS_STORE_PATH):
        if os.path.isfile(candidate):
            try:
                with open(candidate, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
    return {
        "supabase": {"url": "", "publishableKey": "", "anonKey": ""},
        "section_visibility": {
            "hero_video": True,
            "client_logos": True,
            "manifesto": True,
            "services": True,
            "industries": True,
            "projects": True,
            "process": True,
            "testimonials": True,
        },
        "site_settings": {},
        "hero_videos": [],
        "client_brands": [],
        "services": [],
        "industries": [],
        "project_tags": [],
        "projects": [],
        "process_steps": [],
        "testimonials": [],
        "commissions": [],
    }


def write_local_cms_store(data: dict):
    try:
        os.makedirs(os.path.dirname(CMS_STORE_PATH), exist_ok=True)
        with open(CMS_STORE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception:
        pass
    try:
        with open(TMP_CMS_STORE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception:
        pass


def _ensure_uuid(val: str) -> str:
    raw = str(val or "").strip()
    if not raw:
        return str(uuid.uuid4())
    try:
        return str(uuid.UUID(raw))
    except Exception:
        return str(uuid.uuid5(uuid.NAMESPACE_DNS, "publimarca.lead." + raw))


def _get_supabase_creds(sb_cfg: dict):
    raw_url = (sb_cfg.get("url") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or "").strip().rstrip("/")
    # Strip accidental suffixes like /rest/v1 or /auth/v1 if user pasted full endpoint URL
    for suffix in ("/rest/v1", "/auth/v1", "/storage/v1"):
        if raw_url.endswith(suffix):
            raw_url = raw_url[: -len(suffix)].rstrip("/")
    key = (
        sb_cfg.get("anonKey")
        or os.environ.get("SUPABASE_SECRET_KEY")
        or sb_cfg.get("publishableKey")
        or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
        or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
        or ""
    ).strip()
    if not raw_url.startswith("http"):
        return "", ""
    return raw_url, key


def _supabase_select(url: str, key: str, table: str, query: str = "select=*"):
    try:
        endpoint = f"{url}/rest/v1/{table}?{query}"
        req = urllib.request.Request(
            endpoint,
            method="GET",
            headers={
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Accept": "application/json",
            },
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception:
        return None


def _ensure_supabase_storage_bucket(url: str, key: str, bucket: str = "publimarca-media") -> bool:
    if not url or not key:
        return False
    try:
        endpoint = f"{url}/storage/v1/bucket"
        payload = json.dumps({"id": bucket, "name": bucket, "public": True}).encode("utf-8")
        req = urllib.request.Request(
            endpoint,
            data=payload,
            method="POST",
            headers={
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            },
        )
        urllib.request.urlopen(req, timeout=5)
        return True
    except Exception:
        # Bucket may already exist
        return True


def _upload_bytes_to_supabase_storage(
    url: str,
    key: str,
    object_path: str,
    content_type: str,
    data_bytes: bytes,
    bucket: str = "publimarca-media",
):
    if not url or not key:
        return None
    _ensure_supabase_storage_bucket(url, key, bucket)
    try:
        encoded_path = "/".join(urllib.parse.quote(part) for part in object_path.split("/"))
        endpoint = f"{url}/storage/v1/object/{bucket}/{encoded_path}"
        req = urllib.request.Request(
            endpoint,
            data=data_bytes,
            method="POST",
            headers={
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Content-Type": content_type,
                "x-upsert": "true",
            },
        )
        with urllib.request.urlopen(req, timeout=25) as resp:
            if 200 <= resp.status < 300:
                return f"{url}/storage/v1/object/public/{bucket}/{encoded_path}"
    except Exception:
        pass
    return None


def _compress_video_server_side(binary_data: bytes, ext: str) -> tuple:
    """
    If running on macOS with /usr/bin/avconvert available, compresses the video
    using hardware H.264 high-quality 1080p/720p fast-start preset when it reduces weight.
    """
    avconvert_bin = "/usr/bin/avconvert"
    if not os.path.isfile(avconvert_bin) or len(binary_data) < 1_500_000:
        return binary_data, ext

    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            in_path = os.path.join(tmpdir, f"input{ext or '.mp4'}")
            out_path = os.path.join(tmpdir, "output.mp4")
            with open(in_path, "wb") as f:
                f.write(binary_data)

            preset = "Preset1920x1080" if len(binary_data) < 45_000_000 else "Preset1280x720"
            subprocess.run(
                [avconvert_bin, "--source", in_path, "--preset", preset, "--output", out_path, "--replace"],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=45,
            )
            if os.path.isfile(out_path):
                with open(out_path, "rb") as f:
                    compressed = f.read()
                if 0 < len(compressed) < len(binary_data):
                    return compressed, ".mp4"
    except Exception:
        pass
    return binary_data, ext


def _supabase_upsert_and_prune(
    url: str, key: str, table: str, rows: list, on_conflict: str = "id"
) -> bool:
    try:
        # 1. Fetch existing IDs in Supabase to delete any rows removed in the admin panel
        existing = _supabase_select(url, key, table, f"select={on_conflict}")
        if isinstance(existing, list):
            keep_ids = {str(r.get(on_conflict)) for r in rows if r.get(on_conflict) is not None}
            for ex in existing:
                ex_id = str(ex.get(on_conflict, ""))
                if ex_id and ex_id not in keep_ids:
                    del_url = f"{url}/rest/v1/{table}?{on_conflict}=eq.{urllib.parse.quote(ex_id)}"
                    del_req = urllib.request.Request(
                        del_url,
                        method="DELETE",
                        headers={
                            "apikey": key,
                            "Authorization": f"Bearer {key}",
                        },
                    )
                    try:
                        urllib.request.urlopen(del_req, timeout=4)
                    except Exception:
                        pass

        if not rows:
            return True

        # 2. Upsert current rows
        endpoint = f"{url}/rest/v1/{table}?on_conflict={on_conflict}"
        payload = json.dumps(rows, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(
            endpoint,
            data=payload,
            method="POST",
            headers={
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates,return=minimal",
            },
        )
        urllib.request.urlopen(req, timeout=6)
        return True
    except Exception:
        return False


def sync_cms_to_supabase(cms: dict) -> dict:
    sb_cfg = cms.get("supabase") or {}
    url, key = _get_supabase_creds(sb_cfg)
    if not url or not key:
        return {"synced": False, "reason": "missing_url_or_key"}

    now_iso = datetime.now(timezone.utc).isoformat()
    synced_tables = []

    # 1. Global CMS Snapshot (cms_state)
    safe_payload = {k: v for k, v in cms.items() if k != "supabase"}
    if _supabase_upsert_and_prune(
        url,
        key,
        "cms_state",
        [
            {
                "id": "default",
                "section_visibility": cms.get("section_visibility", {}),
                "payload": safe_payload,
                "updated_at": now_iso,
            }
        ],
    ):
        synced_tables.append("cms_state")

    # 2. Site Settings
    s = cms.get("site_settings") or {}
    if _supabase_upsert_and_prune(
        url,
        key,
        "site_settings",
        [
            {
                "id": "default",
                "section_visibility": cms.get("section_visibility", {}),
                "hero_video_url": s.get("hero_video_url", "/video_hero_publimarca.mp4"),
                "hero_live_badge_es": s.get("hero_live_badge_es", "Set en Vivo • Cámara A"),
                "hero_live_badge_en": s.get("hero_live_badge_en", "Live Stage • A-Cam Roll"),
                "hero_subheadline_es": s.get("hero_subheadline_es", ""),
                "hero_subheadline_en": s.get("hero_subheadline_en", ""),
                "manifesto_quote_es": s.get("manifesto_quote_es", ""),
                "manifesto_quote_en": s.get("manifesto_quote_en", ""),
                "contact_address_es": s.get("contact_address_es", ""),
                "contact_address_en": s.get("contact_address_en", ""),
                "contact_email": s.get("contact_email", ""),
                "contact_phone": s.get("contact_phone", ""),
                "updated_at": now_iso,
            }
        ],
    ):
        synced_tables.append("site_settings")

    # 3. Hero Videos
    hv_rows = [
        {
            "id": hv.get("id") or f"hv-{i+1}",
            "sort_order": i + 1,
            "url": hv.get("url", ""),
            "title_es": hv.get("title_es", ""),
            "title_en": hv.get("title_en", ""),
            "badge_es": hv.get("badge_es", ""),
            "badge_en": hv.get("badge_en", ""),
            "active": True,
            "updated_at": now_iso,
        }
        for i, hv in enumerate(cms.get("hero_videos") or [])
    ]
    if _supabase_upsert_and_prune(url, key, "hero_videos", hv_rows):
        synced_tables.append("hero_videos")

    # 4. Client Brands / Logos
    cb_rows = [
        {
            "id": b.get("id") or b.get("slug") or f"cb-{i+1}",
            "sort_order": i + 1,
            "slug": b.get("slug") or f"brand-{i+1}",
            "name": b.get("name", ""),
            "logo_url": b.get("logo_url", ""),
            "instagram_url": b.get("instagram_url", "#"),
            "size": b.get("size", "standard"),
            "active": True,
            "updated_at": now_iso,
        }
        for i, b in enumerate(cms.get("client_brands") or [])
    ]
    if _supabase_upsert_and_prune(url, key, "client_brands", cb_rows):
        synced_tables.append("client_brands")

    # 5. Services
    srv_rows = [
        {
            "id": srv.get("id") or f"s{i+1}",
            "sort_order": i + 1,
            "number_label": srv.get("number") or f"{i+1:02d}/",
            "title_es": srv.get("title_es", ""),
            "title_en": srv.get("title_en", ""),
            "tags_es": srv.get("tags_es", ""),
            "tags_en": srv.get("tags_en", ""),
            "description_es": srv.get("desc_es", ""),
            "description_en": srv.get("desc_en", ""),
            "active": True,
            "updated_at": now_iso,
        }
        for i, srv in enumerate(cms.get("services") or [])
    ]
    if _supabase_upsert_and_prune(url, key, "services", srv_rows):
        synced_tables.append("services")

    # 6. Industries
    ind_rows = [
        {
            "id": ind.get("id") or f"ind-{i+1}",
            "sort_order": i + 1,
            "number_label": ind.get("number") or f"{i+1:02d} —",
            "title_es": ind.get("title_es", ""),
            "title_en": ind.get("title_en", ""),
            "desc_es": ind.get("desc_es", ""),
            "desc_en": ind.get("desc_en", ""),
            "tag_es": ind.get("tag_es", ""),
            "tag_en": ind.get("tag_en", ""),
            "sub_es": ind.get("sub_es", ""),
            "sub_en": ind.get("sub_en", ""),
            "image_url": ind.get("image_url", ""),
            "layout": ind.get("layout", "vertical-light"),
            "active": True,
            "updated_at": now_iso,
        }
        for i, ind in enumerate(cms.get("industries") or [])
    ]
    if _supabase_upsert_and_prune(url, key, "industries", ind_rows):
        synced_tables.append("industries")

    # 7. Editable Project Tags
    tag_rows = [
        {
            "id": t.get("id") or f"tag-{i+1}",
            "sort_order": i + 1,
            "slug": t.get("slug") or f"tag-{i+1}",
            "label_es": t.get("label_es", ""),
            "label_en": t.get("label_en", ""),
            "updated_at": now_iso,
        }
        for i, t in enumerate(cms.get("project_tags") or [])
    ]
    if _supabase_upsert_and_prune(url, key, "project_tags", tag_rows):
        synced_tables.append("project_tags")

    # 8. Projects
    proj_rows = [
        {
            "id": p.get("id") or f"p{i+1}",
            "sort_order": i + 1,
            "featured": bool(p.get("featured", i == 0)),
            "categories": p.get("categories") or ["identity"],
            "image_url": p.get("image_url", ""),
            "badge_es": p.get("badge_es", ""),
            "badge_en": p.get("badge_en", ""),
            "client_es": p.get("client_es", ""),
            "client_en": p.get("client_en", ""),
            "meta_es": p.get("meta_es", ""),
            "meta_en": p.get("meta_en", ""),
            "title_es": p.get("title_es", ""),
            "title_en": p.get("title_en", ""),
            "summary_es": p.get("desc_es", ""),
            "summary_en": p.get("desc_en", ""),
            "specs_es": p.get("specs_es", ""),
            "specs_en": p.get("specs_en", ""),
            "location": p.get("location", "Higüey • RD"),
            "active": True,
            "updated_at": now_iso,
        }
        for i, p in enumerate(cms.get("projects") or [])
    ]
    if _supabase_upsert_and_prune(url, key, "projects", proj_rows):
        synced_tables.append("projects")

    # 9. Process Steps
    proc_rows = [
        {
            "id": pr.get("id") or f"proc-{i+1}",
            "sort_order": i + 1,
            "number_label": pr.get("number") or f"{i+1:02d}/",
            "icon": pr.get("icon", "psychology"),
            "title_es": pr.get("title_es", ""),
            "title_en": pr.get("title_en", ""),
            "desc_es": pr.get("desc_es", ""),
            "desc_en": pr.get("desc_en", ""),
            "deliverable_es": pr.get("deliverable_es", ""),
            "deliverable_en": pr.get("deliverable_en", ""),
            "active": True,
            "updated_at": now_iso,
        }
        for i, pr in enumerate(cms.get("process_steps") or [])
    ]
    if _supabase_upsert_and_prune(url, key, "process_steps", proc_rows):
        synced_tables.append("process_steps")

    # 10. Testimonials
    test_rows = [
        {
            "id": t.get("id") or f"test-{i+1}",
            "sort_order": i + 1,
            "kicker_es": t.get("kicker_es", ""),
            "kicker_en": t.get("kicker_en", ""),
            "badge_es": t.get("badge_es", ""),
            "badge_en": t.get("badge_en", ""),
            "quote_es": t.get("quote_es", ""),
            "quote_en": t.get("quote_en", ""),
            "author_es": t.get("author_es", ""),
            "author_en": t.get("author_en", ""),
            "role_es": t.get("role_es", ""),
            "role_en": t.get("role_en", ""),
            "location": t.get("location", "Higüey • RD"),
            "active": True,
            "updated_at": now_iso,
        }
        for i, t in enumerate(cms.get("testimonials") or [])
    ]
    if _supabase_upsert_and_prune(url, key, "testimonials", test_rows):
        synced_tables.append("testimonials")

    # 11. Commissions / Leads (Buzón de Recepción)
    comm_rows = [
        {
            "id": _ensure_uuid(c.get("id") or f"lead-{i+1}"),
            "name": c.get("name", ""),
            "company": c.get("company", ""),
            "email": c.get("email", ""),
            "phone": c.get("phone", ""),
            "capabilities": c.get("capabilities") if isinstance(c.get("capabilities"), list) else [],
            "scope": c.get("scope", ""),
            "locale": c.get("locale", "es"),
            "status": c.get("status") if c.get("status") in ("nuevo", "en_revision", "contactado", "archivado") else "nuevo",
            "created_at": c.get("created_at") or now_iso,
        }
        for i, c in enumerate(cms.get("commissions") or [])
    ]
    if _supabase_upsert_and_prune(url, key, "commissions", comm_rows):
        synced_tables.append("commissions")

    return {"synced": len(synced_tables) > 0, "tables": synced_tables}


def fetch_cms_from_supabase_or_local() -> dict:
    local_store = read_local_cms_store()
    sb_cfg = local_store.get("supabase") or {}
    url, key = _get_supabase_creds(sb_cfg)
    if not url or not key:
        local_store["_source"] = "local"
        return local_store

    # Query relational tables from Supabase
    sb_settings = _supabase_select(url, key, "site_settings", "select=*&id=eq.default")
    if sb_settings is None:
        # Table not created yet or unreachable
        local_store["_source"] = "local"
        return local_store

    # If site_settings is empty in Supabase, auto-seed Supabase with default local store!
    if len(sb_settings) == 0:
        sync_cms_to_supabase(local_store)
        sb_settings = _supabase_select(url, key, "site_settings", "select=*&id=eq.default") or []

    s_row = sb_settings[0] if sb_settings else {}
    hv_rows = _supabase_select(url, key, "hero_videos", "select=*&order=sort_order.asc") or []
    cb_rows = _supabase_select(url, key, "client_brands", "select=*&order=sort_order.asc") or []
    srv_rows = _supabase_select(url, key, "services", "select=*&order=sort_order.asc") or []
    ind_rows = _supabase_select(url, key, "industries", "select=*&order=sort_order.asc") or []
    tag_rows = _supabase_select(url, key, "project_tags", "select=*&order=sort_order.asc") or []
    proj_rows = _supabase_select(url, key, "projects", "select=*&order=sort_order.asc") or []
    proc_rows = _supabase_select(url, key, "process_steps", "select=*&order=sort_order.asc") or []
    test_rows = _supabase_select(url, key, "testimonials", "select=*&order=sort_order.asc") or []
    comm_rows = _supabase_select(url, key, "commissions", "select=*&order=created_at.desc") or []

    assembled = {
        "_source": "supabase",
        "supabase": sb_cfg,
        "section_visibility": s_row.get("section_visibility") or local_store.get("section_visibility", {}),
        "site_settings": {
            "hero_video_url": s_row.get("hero_video_url", "/video_hero_publimarca.mp4"),
            "hero_live_badge_es": s_row.get("hero_live_badge_es", "Set en Vivo • Cámara A"),
            "hero_live_badge_en": s_row.get("hero_live_badge_en", "Live Stage • A-Cam Roll"),
            "hero_subheadline_es": s_row.get("hero_subheadline_es", ""),
            "hero_subheadline_en": s_row.get("hero_subheadline_en", ""),
            "manifesto_quote_es": s_row.get("manifesto_quote_es", ""),
            "manifesto_quote_en": s_row.get("manifesto_quote_en", ""),
            "contact_address_es": s_row.get("contact_address_es", ""),
            "contact_address_en": s_row.get("contact_address_en", ""),
            "contact_email": s_row.get("contact_email", ""),
            "contact_phone": s_row.get("contact_phone", ""),
            "smtp_host": (local_store.get("site_settings") or {}).get("smtp_host", "smtp.gmail.com"),
            "smtp_port": (local_store.get("site_settings") or {}).get("smtp_port", "465"),
            "smtp_user": (local_store.get("site_settings") or {}).get("smtp_user", ""),
            "smtp_pass": (local_store.get("site_settings") or {}).get("smtp_pass", ""),
        },
        "hero_videos": [
            {
                "id": r.get("id"),
                "url": r.get("url"),
                "title_es": r.get("title_es"),
                "title_en": r.get("title_en"),
                "badge_es": r.get("badge_es"),
                "badge_en": r.get("badge_en"),
            }
            for r in hv_rows
        ],
        "client_brands": [
            {
                "id": r.get("id"),
                "slug": r.get("slug"),
                "name": r.get("name"),
                "logo_url": r.get("logo_url"),
                "instagram_url": r.get("instagram_url", "#"),
                "size": r.get("size", "standard"),
            }
            for r in cb_rows
        ],
        "services": [
            {
                "id": r.get("id"),
                "number": r.get("number_label"),
                "title_es": r.get("title_es"),
                "title_en": r.get("title_en"),
                "tags_es": r.get("tags_es"),
                "tags_en": r.get("tags_en"),
                "desc_es": r.get("description_es"),
                "desc_en": r.get("description_en"),
            }
            for r in srv_rows
        ],
        "industries": [
            {
                "id": r.get("id"),
                "number": r.get("number_label"),
                "title_es": r.get("title_es"),
                "title_en": r.get("title_en"),
                "desc_es": r.get("desc_es"),
                "desc_en": r.get("desc_en"),
                "tag_es": r.get("tag_es"),
                "tag_en": r.get("tag_en"),
                "sub_es": r.get("sub_es"),
                "sub_en": r.get("sub_en"),
                "image_url": r.get("image_url"),
                "layout": r.get("layout", "vertical-light"),
            }
            for r in ind_rows
        ],
        "project_tags": [
            {
                "id": r.get("id"),
                "slug": r.get("slug"),
                "label_es": r.get("label_es"),
                "label_en": r.get("label_en"),
            }
            for r in tag_rows
        ]
        or local_store.get("project_tags", []),
        "projects": [
            {
                "id": r.get("id"),
                "featured": r.get("featured", False),
                "categories": r.get("categories") or ["identity"],
                "image_url": r.get("image_url"),
                "badge_es": r.get("badge_es"),
                "badge_en": r.get("badge_en"),
                "client_es": r.get("client_es"),
                "client_en": r.get("client_en"),
                "meta_es": r.get("meta_es"),
                "meta_en": r.get("meta_en"),
                "title_es": r.get("title_es"),
                "title_en": r.get("title_en"),
                "desc_es": r.get("summary_es"),
                "desc_en": r.get("summary_en"),
                "specs_es": r.get("specs_es"),
                "specs_en": r.get("specs_en"),
                "location": r.get("location", "Higüey • RD"),
            }
            for r in proj_rows
        ],
        "process_steps": [
            {
                "id": r.get("id"),
                "number": r.get("number_label"),
                "icon": r.get("icon", "psychology"),
                "title_es": r.get("title_es"),
                "title_en": r.get("title_en"),
                "desc_es": r.get("desc_es"),
                "desc_en": r.get("desc_en"),
                "deliverable_es": r.get("deliverable_es"),
                "deliverable_en": r.get("deliverable_en"),
            }
            for r in proc_rows
        ],
        "testimonials": [
            {
                "id": r.get("id"),
                "kicker_es": r.get("kicker_es"),
                "kicker_en": r.get("kicker_en"),
                "badge_es": r.get("badge_es"),
                "badge_en": r.get("badge_en"),
                "quote_es": r.get("quote_es"),
                "quote_en": r.get("quote_en"),
                "author_es": r.get("author_es"),
                "author_en": r.get("author_en"),
                "role_es": r.get("role_es"),
                "role_en": r.get("role_en"),
                "location": r.get("location", "Higüey • RD"),
            }
            for r in test_rows
        ],
        "commissions": comm_rows if comm_rows else local_store.get("commissions", []),
    }

    # Cache latest Supabase state locally
    write_local_cms_store(assembled)
    return assembled


def sync_lead_to_supabase(sb_cfg: dict, lead: dict) -> bool:
    url, key = _get_supabase_creds(sb_cfg)
    if not url or not key:
        return False
    try:
        lead_uuid = _ensure_uuid(lead.get("id"))
        lead["id"] = lead_uuid
        endpoint = f"{url}/rest/v1/commissions?on_conflict=id"
        payload = json.dumps(
            {
                "id": lead_uuid,
                "name": lead["name"],
                "company": lead["company"],
                "email": lead["email"],
                "phone": lead.get("phone", ""),
                "capabilities": lead.get("capabilities", []),
                "scope": lead["scope"],
                "locale": lead.get("locale", "es"),
                "status": lead.get("status", "nuevo"),
                "created_at": lead.get("created_at") or datetime.now(timezone.utc).isoformat(),
            },
            ensure_ascii=False,
        ).encode("utf-8")
        req = urllib.request.Request(
            endpoint,
            data=payload,
            method="POST",
            headers={
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates,return=minimal",
            },
        )
        urllib.request.urlopen(req, timeout=5)
        return True
    except Exception:
        return False


def send_commission_email_notification(store: dict, lead: dict) -> dict:
    """
    Sends an email notification to the address configured in site_settings.contact_email.
    1. Uses SMTP (Gmail / Corporate SMTP) if smtp_user and smtp_pass are configured in site_settings.
    2. Otherwise dispatches automatically via FormSubmit AJAX to site_settings.contact_email.
    """
    settings = store.get("site_settings") or {}
    recipient = (settings.get("contact_email") or "dispatch@publimarca.do").strip()
    if not recipient or "@" not in recipient:
        return {"sent": False, "reason": "no_recipient_email"}

    caps_str = ", ".join(lead.get("capabilities") or []) or "Consulta General"
    subject = f"Nueva Solicitud de Proyecto — {lead.get('company', 'Cliente')} ({lead.get('name', '')})"
    plain_body = (
        "PUBLIMARCA STUDIO — NUEVA SOLICITUD EN EL BUZÓN DE RECEPCIÓN\n"
        "=============================================================\n\n"
        f"Nombre / Cargo: {lead.get('name', '')}\n"
        f"Empresa / Entidad: {lead.get('company', '')}\n"
        f"Correo del Cliente: {lead.get('email', '')}\n"
        f"Teléfono: {lead.get('phone', 'No especificado')}\n"
        f"Capacidades Requeridas: {caps_str}\n"
        f"Fecha (UTC): {lead.get('created_at', '')}\n\n"
        f"Contexto y Alcance del Proyecto:\n{lead.get('scope', '')}\n"
    )

    smtp_host = (settings.get("smtp_host") or os.environ.get("SMTP_HOST") or "smtp.gmail.com").strip()
    smtp_port_raw = str(settings.get("smtp_port") or os.environ.get("SMTP_PORT") or "465").strip()
    smtp_user = (settings.get("smtp_user") or os.environ.get("SMTP_USER") or "").strip()
    smtp_pass = (settings.get("smtp_pass") or os.environ.get("SMTP_PASS") or "").strip()

    # 1. Direct SMTP Delivery if credentials are provided
    if smtp_host and smtp_user and smtp_pass:
        try:
            port = int(smtp_port_raw) if smtp_port_raw.isdigit() else 465
            msg = EmailMessage()
            msg["Subject"] = subject
            msg["From"] = f"Publimarca Studio <{smtp_user}>"
            msg["To"] = recipient
            if lead.get("email") and "@" in lead.get("email", ""):
                msg["Reply-To"] = lead["email"]
            msg.set_content(plain_body)

            context = ssl.create_default_context()
            if port == 465:
                with smtplib.SMTP_SSL(smtp_host, port, context=context, timeout=8) as server:
                    server.login(smtp_user, smtp_pass)
                    server.send_message(msg)
            else:
                with smtplib.SMTP(smtp_host, port, timeout=8) as server:
                    server.starttls(context=context)
                    server.login(smtp_user, smtp_pass)
                    server.send_message(msg)
            return {"sent": True, "provider": "smtp", "recipient": recipient}
        except Exception as e:
            return {"sent": False, "provider": "smtp", "error": str(e), "recipient": recipient}

    # 2. Automatic Zero-Config Delivery via FormSubmit AJAX to recipient email
    try:
        fs_url = f"https://formsubmit.co/ajax/{urllib.parse.quote(recipient)}"
        fs_payload = json.dumps(
            {
                "_subject": subject,
                "_template": "table",
                "_captcha": "false",
                "Nombre_y_Cargo": lead.get("name", ""),
                "Empresa": lead.get("company", ""),
                "Email_Cliente": lead.get("email", ""),
                "Telefono": lead.get("phone", ""),
                "Capacidades": caps_str,
                "Alcance_del_Proyecto": lead.get("scope", ""),
            },
            ensure_ascii=False,
        ).encode("utf-8")
        req = urllib.request.Request(
            fs_url,
            data=fs_payload,
            method="POST",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                "Origin": "http://localhost:3000",
                "Referer": "http://localhost:3000/es",
            },
        )
        with urllib.request.urlopen(req, timeout=6) as resp:
            resp_data = json.loads(resp.read().decode("utf-8"))
            if str(resp_data.get("success")).lower() == "true":
                return {"sent": True, "provider": "formsubmit", "recipient": recipient, "message": resp_data.get("message", "")}
            return {"sent": False, "provider": "formsubmit", "recipient": recipient, "message": resp_data.get("message", "")}
    except Exception as e:
        return {"sent": False, "provider": "formsubmit", "error": str(e), "recipient": recipient}


def load_html_for_locale(locale: str) -> bytes:
    with open(os.path.join(ROOT_DIR, "code.html"), "r", encoding="utf-8") as f:
        html = f.read()

    route_script = f"""
      // Synchronize language switcher with /en and /es URL routes
      (function() {{
        const forcedLocale = "{locale}";
        try {{
          localStorage.setItem("publimarca_lang", forcedLocale);
        }} catch (_) {{}}
        document.querySelectorAll("[data-lang-switch]").forEach((btn) => {{
          btn.addEventListener("click", (e) => {{
            const target = btn.getAttribute("data-lang-switch");
            if (target === "en" || target === "es") {{
              const hash = window.location.hash || "";
              window.history.pushState({{}}, "", "/" + target + hash);
            }}
          }});
        }});
      }})();
    </script>
</body>"""
    html = html.replace("</script>\n</body>", route_script)
    if locale == "es":
        html = html.replace('<html class="light scroll-smooth" lang="en">', '<html class="light scroll-smooth" lang="es">')
    return html.encode("utf-8")


class PublimarcaHandler(SimpleHTTPRequestHandler):
    def _get_authenticated_user(self):
        auth_header = self.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
            return _verify_session_token(token)
        return None

    def do_GET(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path.rstrip("/")) or "/"

        if path == "/":
            self.send_response(307)
            self.send_header("Location", "/es")
            self.end_headers()
            return

        if path in ("/en", "/es"):
            locale = "es" if path == "/es" else "en"
            payload = load_html_for_locale(locale)
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        if path in ("/admin", "/es/admin", "/en/admin"):
            with open(os.path.join(ROOT_DIR, "admin.html"), "rb") as f:
                payload = f.read()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        if path == "/api/auth/session":
            user = self._get_authenticated_user()
            if user:
                self._send_json(200, {"authenticated": True, "user": user})
            else:
                self._send_json(200, {"authenticated": False})
            return

        if path == "/api/storage/config":
            user = self._get_authenticated_user()
            if not user:
                self._send_json(401, {"ok": False, "error": "No autorizado"})
                return
            store = read_local_cms_store()
            url, key = _get_supabase_creds(store.get("supabase") or {})
            if url and key:
                _ensure_supabase_storage_bucket(url, key, "publimarca-media")
                self._send_json(200, {"ok": True, "url": url, "key": key, "bucket": "publimarca-media"})
            else:
                self._send_json(200, {"ok": False})
            return

        if path == "/api/cms":
            store = fetch_cms_from_supabase_or_local()
            # Never expose admin password hash in /api/cms response
            store_copy = dict(store)
            store_copy.pop("admin_auth", None)
            self._send_json(200, store_copy)
            return

        if path.lower().endswith((".mp4", ".webm", ".mov")):
            file_path = os.path.join(ROOT_DIR, path.lstrip("/"))
            if os.path.isfile(file_path):
                self._serve_video_with_range(file_path)
                return

        if path == "/robots.txt":
            body = b"User-agent: *\nAllow: /\nSitemap: http://localhost:3000/sitemap.xml\n"
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if path == "/sitemap.xml":
            body = (
                '<?xml version="1.0" encoding="UTF-8"?>\n'
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                "  <url><loc>http://localhost:3000/en</loc></url>\n"
                "  <url><loc>http://localhost:3000/es</loc></url>\n"
                "</urlset>\n"
            ).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/xml; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        return super().do_GET()

    def _serve_video_with_range(self, file_path: str):
        file_size = os.path.getsize(file_path)
        range_header = self.headers.get("Range")
        ext = os.path.splitext(file_path)[1].lower()
        mime = "video/webm" if ext == ".webm" else "video/mp4"

        if range_header:
            match = re.match(r"bytes=(\d+)-(\d*)", range_header)
            if match:
                start = int(match.group(1))
                end = int(match.group(2)) if match.group(2) else file_size - 1
                end = min(end, file_size - 1)
                length = end - start + 1

                self.send_response(206)
                self.send_header("Content-Type", mime)
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
                self.send_header("Content-Length", str(length))
                self.end_headers()

                with open(file_path, "rb") as f:
                    f.seek(start)
                    self.wfile.write(f.read(length))
                return

        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(file_size))
        self.end_headers()
        with open(file_path, "rb") as f:
            self.wfile.write(f.read())

    def do_POST(self):
        parsed = urlparse(self.path)
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"

        if parsed.path == "/api/auth/login":
            try:
                body = json.loads(raw) if raw else {}
                email = str(body.get("email", "")).strip()
                password = str(body.get("password", ""))
                store = read_local_cms_store()
                creds = get_admin_credentials(store)

                expected_email = creds["email"].lower()
                input_email = email.lower()
                email_matches = input_email == expected_email or (
                    input_email == "admin" and expected_email == DEFAULT_ADMIN_EMAIL
                )
                pwd_matches = hmac.compare_digest(_hash_password(password), creds["password_hash"])

                sb_authenticated = False
                if not (email_matches and pwd_matches):
                    sb_authenticated = verify_supabase_auth_login(store.get("supabase", {}), email, password)

                if (email_matches and pwd_matches) or sb_authenticated:
                    user_info = {
                        "email": email if sb_authenticated else creds["email"],
                        "role": "Director de Estudio",
                        "created_at": datetime.now(timezone.utc).isoformat(),
                    }
                    token = _create_session_token(user_info)
                    self._send_json(200, {"ok": True, "token": token, "user": user_info})
                else:
                    self._send_json(
                        401,
                        {
                            "ok": False,
                            "error": "Credenciales inválidas. Verifica tu correo/usuario y contraseña.",
                        },
                    )
            except Exception as e:
                self._send_json(400, {"ok": False, "error": str(e)})
            return

        if parsed.path == "/api/auth/logout":
            auth_header = self.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                token = auth_header[7:].strip()
                ACTIVE_ADMIN_SESSIONS.pop(token, None)
                REVOKED_TOKENS.add(token)
            self._send_json(200, {"ok": True})
            return

        if parsed.path == "/api/auth/change-password":
            user = self._get_authenticated_user()
            if not user:
                self._send_json(401, {"ok": False, "error": "Sesión no autorizada."})
                return
            try:
                body = json.loads(raw) if raw else {}
                current_pwd = str(body.get("currentPassword", ""))
                new_email = str(body.get("newEmail", "")).strip()
                new_pwd = str(body.get("newPassword", ""))

                store = read_local_cms_store()
                creds = get_admin_credentials(store)
                if not hmac.compare_digest(_hash_password(current_pwd), creds["password_hash"]):
                    self._send_json(403, {"ok": False, "error": "La contraseña actual no es correcta."})
                    return
                if len(new_pwd) < 6:
                    self._send_json(422, {"ok": False, "error": "La nueva contraseña debe tener al menos 6 caracteres."})
                    return

                updated_email = new_email if len(new_email) >= 3 else creds["email"]
                store["admin_auth"] = {
                    "email": updated_email,
                    "password_hash": _hash_password(new_pwd),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }
                write_local_cms_store(store)
                user["email"] = updated_email
                self._send_json(200, {"ok": True, "user": user})
            except Exception as e:
                self._send_json(400, {"ok": False, "error": str(e)})
            return

        if parsed.path == "/api/cms":
            if not self._get_authenticated_user():
                self._send_json(401, {"ok": False, "error": "Sesión expirada o no autenticada."})
                return
            try:
                existing = read_local_cms_store()
                updated = json.loads(raw)
                # Preserve admin_auth credentials across CMS saves
                if "admin_auth" in existing:
                    updated["admin_auth"] = existing["admin_auth"]
                write_local_cms_store(updated)
                sb_status = sync_cms_to_supabase(updated)
                self._send_json(200, {"ok": True, "supabase": sb_status})
            except Exception as e:
                self._send_json(400, {"ok": False, "error": str(e)})
            return

        if parsed.path == "/api/supabase/seed":
            if not self._get_authenticated_user():
                self._send_json(401, {"ok": False, "error": "Sesión expirada o no autenticada."})
                return
            try:
                body = json.loads(raw) if raw else {}
                store = read_local_cms_store()
                if body.get("supabase"):
                    store["supabase"] = body["supabase"]
                    write_local_cms_store(store)
                sb_status = sync_cms_to_supabase(store)
                self._send_json(200, {"ok": True, "supabase": sb_status})
            except Exception as e:
                self._send_json(400, {"ok": False, "error": str(e)})
            return

        if parsed.path == "/api/upload":
            if not self._get_authenticated_user():
                self._send_json(401, {"ok": False, "error": "Sesión expirada o no autenticada."})
                return
            try:
                body = json.loads(raw)
                filename = os.path.basename(body.get("filename", "asset.bin"))
                safe_name = re.sub(r"[^a-zA-Z0-9._-]", "_", filename)
                ext = os.path.splitext(safe_name)[1].lower()
                ts = int(datetime.now(timezone.utc).timestamp())

                data_url = body.get("dataUrl", "")
                mime_type = body.get("mimeType") or "application/octet-stream"
                if "," in data_url:
                    header_part, b64_part = data_url.split(",", 1)
                    if "data:" in header_part and ";base64" in header_part:
                        mime_type = header_part.split("data:", 1)[1].split(";base64", 1)[0]
                else:
                    b64_part = data_url
                binary_data = base64.b64decode(b64_part)
                original_bytes = body.get("originalBytes") or len(binary_data)

                # Server-side HD compression for videos when avconvert is available
                if mime_type.startswith("video/") or ext in (".mp4", ".mov", ".m4v"):
                    binary_data, new_ext = _compress_video_server_side(binary_data, ext)
                    if new_ext != ext:
                        safe_name = os.path.splitext(safe_name)[0] + new_ext
                        mime_type = "video/mp4"

                final_name = f"{ts}_{safe_name}"
                folder = "videos" if mime_type.startswith("video/") else "images"

                # 1. Upload optimized binary directly to Supabase Storage (publimarca-media bucket)
                store = read_local_cms_store()
                sb_url, sb_key = _get_supabase_creds(store.get("supabase") or {})
                supabase_public_url = _upload_bytes_to_supabase_storage(
                    sb_url,
                    sb_key,
                    f"{folder}/{final_name}",
                    mime_type,
                    binary_data,
                    "publimarca-media",
                )

                # 2. Also save local copy when filesystem is writable
                local_public_url = None
                try:
                    os.makedirs(UPLOADS_DIR, exist_ok=True)
                    os.makedirs(PUBLIC_UPLOADS_DIR, exist_ok=True)
                    dest_path = os.path.join(UPLOADS_DIR, final_name)
                    pub_path = os.path.join(PUBLIC_UPLOADS_DIR, final_name)
                    with open(dest_path, "wb") as f:
                        f.write(binary_data)
                    shutil.copy2(dest_path, pub_path)
                    local_public_url = f"/uploads/{final_name}"
                except OSError:
                    pass

                final_url = supabase_public_url or local_public_url or data_url
                self._send_json(
                    200,
                    {
                        "ok": True,
                        "url": final_url,
                        "storedIn": "supabase_storage" if supabase_public_url else "local",
                        "originalBytes": original_bytes,
                        "compressedBytes": len(binary_data),
                    },
                )
            except Exception as e:
                self._send_json(400, {"ok": False, "error": str(e)})
            return

        if parsed.path == "/api/email/test":
            if not self._get_authenticated_user():
                self._send_json(401, {"ok": False, "error": "Sesión expirada o no autenticada."})
                return
            try:
                body = json.loads(raw) if raw else {}
                store = read_local_cms_store()
                if body.get("site_settings"):
                    store.setdefault("site_settings", {}).update(body["site_settings"])
                    write_local_cms_store(store)
                test_lead = {
                    "id": str(uuid.uuid4()),
                    "name": "Prueba desde Panel de Control",
                    "company": "Publimarca Studio",
                    "email": (store.get("site_settings") or {}).get("contact_email", "dispatch@publimarca.do"),
                    "phone": (store.get("site_settings") or {}).get("contact_phone", "+1 (809) 554-2040"),
                    "capabilities": ["Publicidad y Consultoría", "Producción Audiovisual"],
                    "scope": "Este es un correo de prueba enviado desde el Panel de Control de Publimarca Studio para verificar la recepción de notificaciones del formulario.",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                }
                email_status = send_commission_email_notification(store, test_lead)
                self._send_json(200, {"ok": True, "email": email_status})
            except Exception as e:
                self._send_json(400, {"ok": False, "error": str(e)})
            return

        if parsed.path == "/api/commission":
            try:
                data = json.loads(raw)
            except Exception:
                self._send_json(400, {"accepted": False, "error": "Malformed JSON"})
                return

            if data.get("honeypot") or (isinstance(data.get("elapsedMs"), (int, float)) and data["elapsedMs"] < 1200):
                self._send_json(400, {"accepted": False, "error": "Spam check rejected request."})
                return

            email_re = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
            name = str(data.get("name", "")).strip()
            company = str(data.get("company", "")).strip()
            email = str(data.get("email", "")).strip()
            phone = str(data.get("phone", "")).strip()
            scope = str(data.get("scope", "")).strip()
            capabilities = data.get("capabilities", [])

            if len(name) < 2 or len(company) < 2 or not email_re.match(email) or len(scope) < 20:
                self._send_json(422, {"accepted": False, "error": "Invalid commission brief fields."})
                return

            store = read_local_cms_store()
            lead_entry = {
                "id": str(uuid.uuid4()),
                "name": name,
                "company": company,
                "email": email,
                "phone": phone,
                "capabilities": capabilities if isinstance(capabilities, list) else [],
                "scope": scope,
                "locale": data.get("locale", "es"),
                "status": "nuevo",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
            store.setdefault("commissions", []).insert(0, lead_entry)
            write_local_cms_store(store)
            sb_ok = sync_lead_to_supabase(store.get("supabase", {}), lead_entry)
            email_status = send_commission_email_notification(store, lead_entry)

            self._send_json(
                200,
                {
                    "accepted": True,
                    "id": lead_entry["id"],
                    "supabase_synced": sb_ok,
                    "email_notification": email_status,
                },
            )
            return

        self._send_json(404, {"error": "Not found"})

    def _send_json(self, status: int, obj: dict):
        raw = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)


if __name__ == "__main__":
    os.chdir(ROOT_DIR)
    port = int(os.environ.get("PORT", "3000"))
    server = HTTPServer(("127.0.0.1", port), PublimarcaHandler)
    print(f"Publimarca Studio server listening on http://localhost:{port} (/es, /en, and /admin)")
    server.serve_forever()
