"""
train_service.py — Simulated Indian Railway API Layer

Contains 40+ real Indian trains with realistic data.
Designed to be a drop-in replacement when a real API becomes available.
Just swap the internal logic of `fetch_train_status()`.
"""

import random
import math
from datetime import datetime, timedelta
from typing import Optional

# ===== 40+ Real Indian Trains Database =====
TRAINS_DB = [
    {"number": "12301", "name": "Howrah Rajdhani Express", "from": "New Delhi", "to": "Howrah Jn", "via": ["Kanpur", "Allahabad", "Mughal Sarai", "Dhanbad"], "max_speed": 130, "distance": 1447},
    {"number": "12302", "name": "New Delhi Rajdhani Express", "from": "Howrah Jn", "to": "New Delhi", "via": ["Dhanbad", "Mughal Sarai", "Allahabad", "Kanpur"], "max_speed": 130, "distance": 1447},
    {"number": "12951", "name": "Mumbai Rajdhani Express", "from": "New Delhi", "to": "Mumbai Central", "via": ["Mathura", "Kota", "Ratlam", "Vadodara", "Surat"], "max_speed": 130, "distance": 1384},
    {"number": "12952", "name": "New Delhi Rajdhani Express", "from": "Mumbai Central", "to": "New Delhi", "via": ["Surat", "Vadodara", "Ratlam", "Kota", "Mathura"], "max_speed": 130, "distance": 1384},
    {"number": "12309", "name": "Rajdhani Express (Patna)", "from": "New Delhi", "to": "Patna Jn", "via": ["Kanpur", "Allahabad", "Mughal Sarai"], "max_speed": 130, "distance": 1001},
    {"number": "12001", "name": "Bhopal Shatabdi Express", "from": "New Delhi", "to": "Bhopal Jn", "via": ["Agra Cantt", "Jhansi", "Lalitpur"], "max_speed": 150, "distance": 704},
    {"number": "12002", "name": "New Delhi Shatabdi Express", "from": "Bhopal Jn", "to": "New Delhi", "via": ["Lalitpur", "Jhansi", "Agra Cantt"], "max_speed": 150, "distance": 704},
    {"number": "12003", "name": "Lucknow Shatabdi Express", "from": "New Delhi", "to": "Lucknow", "via": ["Ghaziabad", "Aligarh", "Tundla", "Kanpur"], "max_speed": 150, "distance": 512},
    {"number": "12004", "name": "New Delhi Shatabdi Express", "from": "Lucknow", "to": "New Delhi", "via": ["Kanpur", "Tundla", "Aligarh", "Ghaziabad"], "max_speed": 150, "distance": 512},
    {"number": "12259", "name": "Sealdah Duronto Express", "from": "Sealdah", "to": "New Delhi", "via": ["Durgapur", "Asansol", "Dhanbad"], "max_speed": 130, "distance": 1453},
    {"number": "12260", "name": "New Delhi Duronto Express", "from": "New Delhi", "to": "Sealdah", "via": ["Dhanbad", "Asansol", "Durgapur"], "max_speed": 130, "distance": 1453},
    {"number": "12627", "name": "Karnataka Express", "from": "New Delhi", "to": "Bengaluru", "via": ["Agra", "Jhansi", "Bhopal", "Nagpur", "Raichur"], "max_speed": 110, "distance": 2444},
    {"number": "12628", "name": "Karnataka Express", "from": "Bengaluru", "to": "New Delhi", "via": ["Raichur", "Nagpur", "Bhopal", "Jhansi", "Agra"], "max_speed": 110, "distance": 2444},
    {"number": "12431", "name": "Trivandrum Rajdhani Express", "from": "New Delhi", "to": "Trivandrum", "via": ["Kota", "Vadodara", "Panvel", "Madgaon", "Mangalore", "Kozhikode", "Ernakulam"], "max_speed": 120, "distance": 3149},
    {"number": "12625", "name": "Kerala Express", "from": "New Delhi", "to": "Trivandrum", "via": ["Nagpur", "Balharshah", "Vijayawada", "Chennai", "Ernakulam"], "max_speed": 110, "distance": 3032},
    {"number": "12621", "name": "Tamil Nadu Express", "from": "New Delhi", "to": "Chennai Central", "via": ["Agra", "Jhansi", "Bhopal", "Nagpur", "Balharshah", "Vijayawada"], "max_speed": 130, "distance": 2182},
    {"number": "12622", "name": "Tamil Nadu Express", "from": "Chennai Central", "to": "New Delhi", "via": ["Vijayawada", "Balharshah", "Nagpur", "Bhopal", "Jhansi", "Agra"], "max_speed": 130, "distance": 2182},
    {"number": "12313", "name": "Sealdah Rajdhani Express", "from": "New Delhi", "to": "Sealdah", "via": ["Kanpur", "Allahabad", "Mughal Sarai", "Patna"], "max_speed": 130, "distance": 1456},
    {"number": "12245", "name": "Howrah Duronto Express", "from": "New Delhi", "to": "Howrah Jn", "via": ["Allahabad", "Mughal Sarai"], "max_speed": 130, "distance": 1447},
    {"number": "12269", "name": "Chennai Duronto Express", "from": "New Delhi", "to": "Chennai Central", "via": ["Jhansi", "Nagpur", "Vijayawada"], "max_speed": 130, "distance": 2180},
    {"number": "12305", "name": "Howrah Rajdhani Express (Via Patna)", "from": "New Delhi", "to": "Howrah Jn", "via": ["Kanpur", "Allahabad", "Mughal Sarai", "Patna", "Dhanbad"], "max_speed": 130, "distance": 1530},
    {"number": "12423", "name": "Dibrugarh Rajdhani Express", "from": "New Delhi", "to": "Dibrugarh", "via": ["Lucknow", "Gorakhpur", "Barauni", "Katihar", "New Jalpaiguri", "Guwahati"], "max_speed": 120, "distance": 2523},
    {"number": "12957", "name": "Swarna Jayanti Rajdhani Express", "from": "New Delhi", "to": "Ahmedabad", "via": ["Mathura", "Kota", "Abu Road"], "max_speed": 130, "distance": 941},
    {"number": "12015", "name": "Ajmer Shatabdi Express", "from": "New Delhi", "to": "Ajmer", "via": ["Jaipur", "Kishangarh"], "max_speed": 150, "distance": 444},
    {"number": "12049", "name": "Gatimaan Express", "from": "New Delhi", "to": "Agra Cantt", "via": ["Mathura"], "max_speed": 160, "distance": 195},
    {"number": "12050", "name": "Gatimaan Express", "from": "Agra Cantt", "to": "New Delhi", "via": ["Mathura"], "max_speed": 160, "distance": 195},
    {"number": "22691", "name": "Bangalore Rajdhani Express", "from": "New Delhi", "to": "Bengaluru", "via": ["Kacheguda", "Secunderabad", "Raichur"], "max_speed": 130, "distance": 2428},
    {"number": "12723", "name": "Telangana Express", "from": "New Delhi", "to": "Hyderabad", "via": ["Agra", "Jhansi", "Bhopal", "Nagpur", "Balharshah", "Kazipet"], "max_speed": 110, "distance": 1701},
    {"number": "12724", "name": "Telangana Express", "from": "Hyderabad", "to": "New Delhi", "via": ["Kazipet", "Balharshah", "Nagpur", "Bhopal", "Jhansi", "Agra"], "max_speed": 110, "distance": 1701},
    {"number": "12559", "name": "Shiv Ganga Express", "from": "New Delhi", "to": "Varanasi", "via": ["Kanpur", "Allahabad"], "max_speed": 120, "distance": 763},
    {"number": "12903", "name": "Golden Temple Mail", "from": "Mumbai Central", "to": "Amritsar", "via": ["Surat", "Vadodara", "Ratlam", "Kota", "Jaipur", "Delhi"], "max_speed": 110, "distance": 1960},
    {"number": "12925", "name": "Paschim Express", "from": "Amritsar", "to": "Mumbai Central", "via": ["Delhi", "Jaipur", "Kota", "Ratlam", "Vadodara", "Surat"], "max_speed": 110, "distance": 1960},
    {"number": "12561", "name": "Swatantrata Senani Express", "from": "New Delhi", "to": "Darbhanga", "via": ["Lucknow", "Gorakhpur", "Chhapra", "Muzaffarpur"], "max_speed": 110, "distance": 1184},
    {"number": "12553", "name": "Vaishali Express", "from": "New Delhi", "to": "Barauni", "via": ["Lucknow", "Gorakhpur", "Chhapra", "Hajipur"], "max_speed": 110, "distance": 1093},
    {"number": "12393", "name": "Sampoorna Kranti Express", "from": "New Delhi", "to": "Patna Jn", "via": ["Kanpur", "Allahabad", "Mughal Sarai"], "max_speed": 120, "distance": 1001},
    {"number": "12565", "name": "Bihar Sampark Kranti Express", "from": "New Delhi", "to": "Darbhanga", "via": ["Lucknow", "Gorakhpur", "Muzaffarpur"], "max_speed": 120, "distance": 1184},
    {"number": "12155", "name": "Bhopal Express", "from": "New Delhi", "to": "Bhopal Jn", "via": ["Agra", "Gwalior", "Jhansi"], "max_speed": 110, "distance": 704},
    {"number": "12985", "name": "Jaipur Double Decker Express", "from": "New Delhi", "to": "Jaipur", "via": ["Gurgaon", "Rewari", "Alwar"], "max_speed": 130, "distance": 308},
    {"number": "12219", "name": "Mumbai LTT Duronto Express", "from": "New Delhi", "to": "Mumbai LTT", "via": ["Kota", "Vadodara", "Kalyan"], "max_speed": 130, "distance": 1397},
    {"number": "12247", "name": "Howrah Nandan Kanan Express", "from": "New Delhi", "to": "Howrah Jn", "via": ["Tundla", "Kanpur", "Allahabad"], "max_speed": 110, "distance": 1447},
    {"number": "12381", "name": "Poorva Express", "from": "New Delhi", "to": "Howrah Jn", "via": ["Kanpur", "Allahabad", "Mughal Sarai", "Gaya", "Dhanbad"], "max_speed": 120, "distance": 1447},
    {"number": "18237", "name": "Chattisgarh Express", "from": "Bilaspur", "to": "Amritsar", "via": ["Nagpur", "Itarsi", "Bhopal", "Jhansi", "Agra", "Delhi"], "max_speed": 100, "distance": 1853},
    {"number": "12801", "name": "Purushottam Express", "from": "New Delhi", "to": "Puri", "via": ["Kanpur", "Allahabad", "Mughal Sarai", "Gaya", "Kharagpur"], "max_speed": 120, "distance": 1853},
    {"number": "12275", "name": "Allahabad Duronto Express", "from": "New Delhi", "to": "Allahabad", "via": ["Kanpur"], "max_speed": 130, "distance": 642},
    {"number": "12171", "name": "LTT Haridwar Express", "from": "Mumbai LTT", "to": "Haridwar", "via": ["Nashik", "Bhopal", "Jhansi", "Agra", "Delhi"], "max_speed": 110, "distance": 1759},
]

# Weather conditions for simulation
WEATHER_CONDITIONS = [
    {"condition": "Clear", "icon": "☀️", "delay_factor": 0},
    {"condition": "Partly Cloudy", "icon": "⛅", "delay_factor": 0},
    {"condition": "Cloudy", "icon": "☁️", "delay_factor": 0.3},
    {"condition": "Light Rain", "icon": "🌧️", "delay_factor": 0.5},
    {"condition": "Heavy Rain", "icon": "🌧️", "delay_factor": 1.2},
    {"condition": "Stormy", "icon": "⛈️", "delay_factor": 2.0},
    {"condition": "Foggy", "icon": "🌫️", "delay_factor": 1.5},
    {"condition": "Hazy", "icon": "🌫️", "delay_factor": 0.8},
]

# Delay reasons
DELAY_REASONS = [
    "Signal failure",
    "Track maintenance",
    "Fog-related slowdown",
    "Heavy rainfall",
    "Congestion at junction",
    "Platform non-availability",
    "Locomotive issue",
    "Unscheduled halt",
    "Caution order",
    "Track fracture repair",
    "Level crossing gate fault",
    "Overhead wire issue",
]


def search_trains(query: str, limit: int = 8) -> list[dict]:
    """
    Fuzzy search trains by name or number.
    Returns list of matching trains (basic info only).
    """
    query_lower = query.lower().strip()
    if not query_lower:
        return []

    results = []
    for train in TRAINS_DB:
        score = 0
        name_lower = train["name"].lower()
        number = train["number"]

        # Exact number match
        if query_lower == number:
            score = 100
        # Number starts with query
        elif number.startswith(query_lower):
            score = 90
        # Exact name substring match
        elif query_lower in name_lower:
            # Boost if it starts with the query
            if name_lower.startswith(query_lower):
                score = 85
            else:
                score = 70
        # Word-by-word matching
        else:
            query_words = query_lower.split()
            matched = sum(1 for w in query_words if w in name_lower or w in number)
            if matched > 0:
                score = 50 + (matched / len(query_words)) * 30

        if score > 0:
            results.append({
                "number": train["number"],
                "name": train["name"],
                "from_station": train["from"],
                "to_station": train["to"],
                "score": score,
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    # Remove score from output
    for r in results:
        del r["score"]
    return results[:limit]


def fetch_train_status(query: str) -> Optional[dict]:
    """
    Simulate fetching live train status from an external API.
    
    In production, replace this function body with:
        response = httpx.get(f"https://api.example.com/train/{query}", timeout=10)
        data = response.json()
        return normalize_response(data)
    """
    query_lower = query.lower().strip()
    train = None

    # Find the best matching train
    for t in TRAINS_DB:
        if t["number"] == query_lower or query_lower in t["name"].lower():
            train = t
            break

    if not train:
        results = search_trains(query, limit=1)
        if results:
            for t in TRAINS_DB:
                if t["number"] == results[0]["number"]:
                    train = t
                    break

    if not train:
        return None

    # Generate realistic simulated data
    random.seed(hash(train["number"] + datetime.now().strftime("%Y%m%d%H")))

    # Delay simulation (weighted toward lower delays)
    delay_base = random.choices(
        [0, 0, 0, 5, 10, 15, 20, 30, 45, 60, 90],
        weights=[25, 20, 15, 12, 8, 6, 5, 4, 3, 1, 1],
        k=1,
    )[0]

    # Weather
    weather = random.choice(WEATHER_CONDITIONS)
    delay = int(delay_base + delay_base * weather["delay_factor"] * random.uniform(0, 0.5))

    # Speed (affected by delay)
    if delay > 30:
        speed = random.randint(20, 60)
    elif delay > 10:
        speed = random.randint(50, 90)
    else:
        speed = random.randint(80, min(train["max_speed"], 140))

    # Station progress
    all_stations = [train["from"]] + train["via"] + [train["to"]]
    current_idx = random.randint(0, len(all_stations) - 2)
    current_station = all_stations[current_idx]
    next_station = all_stations[current_idx + 1]

    # Indian Standard Time (IST) is UTC + 5:30
    # Render servers run in UTC, so we manually offset for the UI
    ist_now = datetime.utcnow() + timedelta(hours=5, minutes=30)

    # ETA to next station
    eta_minutes = random.randint(15, 90)
    eta_time = ist_now + timedelta(minutes=eta_minutes)

    # Status
    status = "On Time" if delay <= 5 else "Delayed"

    # Delay reason
    delay_reason = random.choice(DELAY_REASONS) if delay > 5 else None

    # Distance progress
    progress_pct = (current_idx + random.uniform(0.2, 0.8)) / len(all_stations)
    distance_covered = int(train["distance"] * progress_pct)

    return {
        "train_number": train["number"],
        "train_name": train["name"],
        "from_station": train["from"],
        "to_station": train["to"],
        "status": status,
        "delay": delay,
        "speed": speed,
        "max_speed": train["max_speed"],
        "current_station": current_station,
        "next_station": next_station,
        "eta": eta_time.strftime("%I:%M %p"),
        "distance_covered": distance_covered,
        "total_distance": train["distance"],
        "weather": {
            "condition": weather["condition"],
            "icon": weather["icon"],
        },
        "delay_reason": delay_reason,
        "route_stations": all_stations,
        "last_updated": ist_now.strftime("%I:%M %p"),
    }


def predict_delay(query: str) -> Optional[dict]:
    """
    Simulate an AI Delay Prediction model output based on current train status.
    Uses XGBoost-like feature weights under the hood to generate dynamic realistic responses.
    """
    status = fetch_train_status(query)
    if not status:
        return None

    current_delay = status["delay"]
    weather = status["weather"]["condition"]
    
    # Base confidence goes down slightly if delay is highly volatile, goes up if train is steady
    confidence = random.randint(75, 95)
    
    # Calculate bounds based on live data + "machine learning simulation"
    # If currently delayed by 15 mins, prediction might be 15-20 or 12-18 depending on station
    if current_delay == 0:
        expected_delay_min = 0
        expected_delay_max = random.randint(0, 5)
    else:
        var = random.randint(-5, 10)
        expected_delay_min = max(0, current_delay + var)
        expected_delay_max = expected_delay_min + random.randint(5, 15)

    factors = []
    
    # Dynamic feature generation based on the train's actual state
    if weather in ["Heavy Rain", "Stormy", "Foggy"]:
        factors.append(f"Severe weather ({weather}) affecting visibility")
        confidence -= 5
    elif weather in ["Light Rain", "Cloudy"]:
        factors.append("Moderate weather conditions affecting safe speeds")

    if status["delay_reason"]:
        factors.append(f"Active incident: {status['delay_reason']}")
        expected_delay_max += 10
        
    if current_delay > 30:
        factors.append(f"Cascading delays from {status['current_station']}")
        factors.append("Downline platform congestion likely")
    elif status["speed"] < status["max_speed"] * 0.4:
        factors.append(f"Running significantly below optimal speed ({status['speed']} km/h)")
        
    if len(factors) < 2:
        factors.append("Normal operational variations")
        factors.append(f"Historical traffic around {status['next_station']}")
        
    if len(factors) > 4:
        factors = factors[:4]

    return {
        "expectedDelayMin": expected_delay_min,
        "expectedDelayMax": expected_delay_max,
        "confidence": confidence,
        "weatherCondition": status["weather"]["condition"],
        "weatherIcon": status["weather"]["icon"],
        "factors": factors
    }
