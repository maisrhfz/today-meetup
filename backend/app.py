import os
import uuid
from datetime import datetime, timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

# In production, set ALLOWED_ORIGIN to your deployed frontend URL (see .env.example)
allowed_origin = os.environ.get("ALLOWED_ORIGIN", "*")
CORS(app, resources={r"/api/*": {"origins": allowed_origin}})


def now_iso(offset_minutes=0):
    return (datetime.utcnow() + timedelta(minutes=offset_minutes)).isoformat() + "Z"


def seed_events():
    """Demo data so the board isn't empty on a fresh deploy."""
    return [
        {
            "id": "seed1",
            "title": "즉흥 잔디밭 프리스비",
            "location": "학생회관 앞 잔디밭",
            "start": now_iso(25),
            "capacity": 12,
            "course": "",
            "organizer": "박서준",
            "joinedNames": ["지민", "하준", "서연", "유진", "민재", "예린", "도윤", "태양", "채원"],
        },
        {
            "id": "seed2",
            "title": "남은 케이터링 나눔",
            "location": "공학관 3층 세미나실",
            "start": now_iso(70),
            "capacity": 20,
            "course": "",
            "organizer": "이수아",
            "joinedNames": [f"참가자{i + 1}" for i in range(20)],
        },
        {
            "id": "seed3",
            "title": "알고리즘 스터디 번개",
            "location": "중앙도서관 스터디홀",
            "start": now_iso(180),
            "capacity": 15,
            "course": "컴퓨터공학과",
            "organizer": "김하늘",
            "joinedNames": ["현우", "소율", "재윤"],
        },
        {
            "id": "seed4",
            "title": "경영학과 조별과제 급구",
            "location": "경영관 402호",
            "start": now_iso(60 * 26),
            "capacity": 6,
            "course": "경영학과",
            "organizer": "정다은",
            "joinedNames": ["우진", "하린"],
        },
    ]


# NOTE: in-memory only — resets whenever the serverless function cold-starts.
# Swap this for Vercel KV/Postgres before the real demo if events need to persist.
EVENTS = seed_events()


def find_event(event_id):
    return next((e for e in EVENTS if e["id"] == event_id), None)


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/api/events")
def list_events():
    return jsonify(EVENTS)


@app.post("/api/events")
def create_event():
    data = request.get_json(force=True) or {}
    required = ["title", "location", "start", "capacity"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        capacity = int(data["capacity"])
    except (TypeError, ValueError):
        return jsonify({"error": "capacity must be a number"}), 400

    event = {
        "id": str(uuid.uuid4()),
        "title": data["title"],
        "location": data["location"],
        "start": data["start"],
        "capacity": capacity,
        "course": data.get("course", ""),
        "organizer": data.get("organizer", "익명"),
        "joinedNames": [],
    }
    EVENTS.append(event)
    return jsonify(event), 201


@app.patch("/api/events/<event_id>")
def update_event(event_id):
    """Partial update — only send the fields you want to change."""
    event = find_event(event_id)
    if not event:
        return jsonify({"error": "event not found"}), 404

    data = request.get_json(force=True) or {}
    editable_text_fields = ["title", "location", "start", "course", "organizer"]

    if "capacity" in data:
        try:
            new_capacity = int(data["capacity"])
        except (TypeError, ValueError):
            return jsonify({"error": "capacity must be a number"}), 400
        if new_capacity < len(event["joinedNames"]):
            return (
                jsonify(
                    {
                        "error": (
                            f"capacity can't be less than the "
                            f"{len(event['joinedNames'])} people already joined"
                        )
                    }
                ),
                400,
            )
        event["capacity"] = new_capacity

    for field in editable_text_fields:
        if field in data:
            value = data[field]
            if field in ("title", "location", "start") and not value:
                return jsonify({"error": f"{field} cannot be empty"}), 400
            event[field] = value

    return jsonify(event)


@app.delete("/api/events/<event_id>")
def delete_event(event_id):
    event = find_event(event_id)
    if not event:
        return jsonify({"error": "event not found"}), 404

    EVENTS.remove(event)
    return jsonify({"deleted": event_id}), 200


@app.post("/api/events/<event_id>/join")
def join_event(event_id):
    data = request.get_json(force=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "name is required"}), 400

    event = find_event(event_id)
    if not event:
        return jsonify({"error": "event not found"}), 404

    # toggle: leave if already joined, otherwise try to join
    if name in event["joinedNames"]:
        event["joinedNames"].remove(name)
    else:
        if len(event["joinedNames"]) >= event["capacity"]:
            return jsonify({"error": "event is full"}), 409
        event["joinedNames"].append(name)

    return jsonify(event)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)