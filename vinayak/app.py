import pymongo
from faker import Faker
import random
from datetime import datetime, timedelta

# Initialize Faker
fake = Faker('en_IN')

# MongoDB connection
client = pymongo.MongoClient("mongodb+srv://harshitbhanushali22:DmqjI9LFL3VHH5EC@cluster0.ywfh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["TCET2"]

# Collections
users_collection = db["users"]
communications_collection = db["communications"]
agents_collection = db["agents"]
tasks_collection = db["tasks"]
suggestions_collection = db["suggestions"]
languages_collection = db["languages"]
performance_metrics_collection = db["performance_metrics"]
feedback_collection = db["feedback"]
notifications_collection = db["notifications"]
settings_collection = db["settings"]

# Indian names and domains
names = ["Anushka Shendge", "Vinayak Bhatia", "Atharva Patil", "Harshit Bhanushali", "Rohan Sharma", "Sneha Iyer", "Aditya Kulkarni"]
domains = ["spit.ac.in", "tcet.ac.in", "djsce.ac.in", "vesit.ac.in", "kjsieit.ac.in"]
languages = ["Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Punjabi", "Odia"]

# Indian language text samples
indian_text_samples = {
    "Hindi": "नमस्ते, यह एक उदाहरण वाक्य है।",
    "Marathi": "नमस्कार, हे एक उदाहरण वाक्य आहे।",
    "Gujarati": "નમસ્તે, આ એક ઉદાહરણ વાક્ય છે।",
    "Tamil": "வணக்கம், இது ஒரு எடுத்துக்காட்டு வாக்கியம்.",
    "Telugu": "నమస్కారం, ఇది ఒక ఉదాహరణ వాక్యం.",
    "Kannada": "ನಮಸ್ಕಾರ, ಇದು ಒಂದು ಉದಾಹರಣೆ ವಾಕ್ಯ.",
    "Malayalam": "നമസ്കാരം, ഇതൊരു ഉദാഹരണ വാക്യമാണ്.",
    "Bengali": "নমস্কার, এটি একটি উদাহরণ বাক্য।",
    "Punjabi": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਇਹ ਇੱਕ ਉਦਾਹਰਣ ਵਾਕ ਹੈ।",
    "Odia": "ନମସ୍କାର, ଏହା ଏକ ଉଦାହରଣ ବାକ୍ୟ।"
}

# Function to generate random Indian text
def generate_indian_text(language):
    return indian_text_samples.get(language, "Sample text in English")

# Function to generate random user data
def generate_user(index):
    # Use index to ensure unique usernames and emails
    fake_name = fake.name()
    name_parts = fake_name.split()
    first_name = name_parts[0]
    last_name = name_parts[-1] if len(name_parts) > 1 else fake.last_name()
    
    # Create unique email using index
    email = f"{first_name.lower()}.{last_name.lower()}{index}@{random.choice(domains)}"
    username = f"{first_name.lower()}.{last_name.lower()}{index}"
    
    return {
        "username": username,
        "email": email,
        "password_hash": fake.sha256(),
        "first_name": first_name,
        "last_name": last_name,
        "preferred_language": random.choice(languages),
        "subscription_plan": random.choice(["Free", "Premium"]),
        "created_at": fake.date_time_this_year(),
        "last_login": fake.date_time_this_month(),
        "profile_picture_url": fake.image_url(),
        "timezone": "IST",
        "notification_preferences": random.choice(["Email", "SMS", "Push"]),
        "offline_mode_enabled": random.choice([True, False]),
        "sync_frequency": random.choice(["Hourly", "Daily", "Weekly"]),
        "feedback_score": random.uniform(1, 5),
        "total_corrections_made": random.randint(0, 100),
        "total_voice_inputs": random.randint(0, 200),
        "total_translations": random.randint(0, 150),
        "total_suggestions_used": random.randint(0, 50),
        "account_status": random.choice(["Active", "Inactive", "Suspended"]),
        "role": random.choice(["Admin", "User"])
    }

# Function to generate random communication data
def generate_communication(user_id):
    lang = random.choice(languages)
    return {
        "user_id": user_id,
        "type": random.choice(["voice-to-text", "translation"]),
        "original_text": generate_indian_text(lang),
        "refined_text": generate_indian_text(lang),
        "timestamp": fake.date_time_this_month(),
        "language": lang,
        "source_language": lang if random.choice([True, False]) else random.choice(languages),
        "target_language": random.choice(languages),
        "improvements_applied": random.randint(0, 5),
        "ai_confidence_score": random.uniform(80, 100),
        "context_tags": random.sample(["meeting", "work", "personal", "urgent"], k=2),
        "feedback": random.choice(["Good", "Needs improvement", "Excellent"]),
        "corrections_made": random.randint(0, 3),
        "status": random.choice(["completed", "in_progress", "pending"]),
        "device_used": random.choice(["Mobile", "Desktop"]),
        "offline_mode_used": random.choice([True, False]),
        "duration": random.uniform(0.5, 5.0),
        "suggestions_generated": random.randint(0, 5),
        "suggestions_used": random.randint(0, 3)
    }

# Function to generate random agent data
def generate_agent():
    return {
        "agent_name": random.choice(["Google Docs", "Gmail", "Google Calendar", "WhatsApp", "Analytics"]),
        "agent_icon": random.choice(["📄", "📧", "📅", "💬", "📊"]),
        "description": fake.sentence(),
        "status": random.choice(["active", "inactive"]),
        "created_at": fake.date_time_this_year(),
        "last_used": fake.date_time_this_month(),
        "total_tasks_completed": random.randint(0, 100),
        "total_tasks_failed": random.randint(0, 10),
        "average_processing_time": random.uniform(0.5, 5.0),
        "supported_languages": random.sample(languages, k=random.randint(1, 5)),
        "api_endpoint": fake.url(),
        "api_key": fake.sha256(),
        "configuration_settings": fake.json(),
        "error_rate": random.uniform(0, 10),
        "user_rating": random.uniform(1, 5),
        "usage_statistics": fake.json()
    }

# Function to generate random task data
def generate_task(user_id, agent_id):
    return {
        "agent_id": agent_id,
        "user_id": user_id,
        "description": fake.sentence(),
        "status": random.choice(["completed", "in_progress", "awaiting_confirmation", "pending"]),
        "result": fake.sentence() if random.choice([True, False]) else None,
        "recipients": [fake.email() for _ in range(random.randint(1, 5))],
        "subject": fake.sentence(),
        "created_at": fake.date_time_this_month(),
        "started_at": fake.date_time_this_month(),
        "completed_at": fake.date_time_this_month(),
        "error_message": fake.sentence() if random.choice([True, False]) else None,
        "retry_count": random.randint(0, 3),
        "priority": random.choice(["High", "Medium", "Low"]),
        "context_tags": random.sample(["meeting", "work", "personal", "urgent"], k=2),
        "suggestions_generated": random.randint(0, 5),
        "suggestions_used": random.randint(0, 3)
    }

# Function to generate random suggestion data
def generate_suggestion(communication_id, task_id):
    return {
        "communication_id": communication_id,
        "task_id": task_id,
        "suggestion_text": fake.sentence(),
        "context": random.choice(["meeting", "work", "personal", "urgent"]),
        "confidence_score": random.uniform(80, 100),
        "status": random.choice(["applied", "pending", "rejected"]),
        "created_at": fake.date_time_this_month(),
        "applied_at": fake.date_time_this_month() if random.choice([True, False]) else None,
        "user_feedback": random.choice(["Good", "Needs improvement", "Excellent"]),
        "suggestion_type": random.choice(["follow-up", "correction", "enhancement"]),
        "language": random.choice(languages),
        "source_language": random.choice(languages),
        "target_language": random.choice(languages),
        "ai_model_version": fake.sha256()
    }

# Function to generate random language data
def generate_language():
    lang = random.choice(languages)
    return {
        "language_name": lang,
        "language_code": lang[:3].upper(),
        "total_usage_count": random.randint(0, 1000),
        "last_used": fake.date_time_this_month(),
        "supported_by_agents": random.sample(["Google Docs", "Gmail", "Google Calendar", "WhatsApp", "Analytics"], k=random.randint(1, 5)),
        "user_preference_count": random.randint(0, 500),
        "translation_accuracy": random.uniform(80, 100),
        "voice_recognition_accuracy": random.uniform(80, 100),
        "contextual_understanding_score": random.uniform(80, 100),
        "average_processing_time": random.uniform(0.5, 5.0),
        "error_rate": random.uniform(0, 10),
        "user_rating": random.uniform(1, 5)
    }

# Function to generate random performance metrics data
def generate_performance_metrics(user_id):
    return {
        "user_id": user_id,
        "accuracy_rate": random.uniform(80, 100),
        "improvement_rate": random.uniform(0, 10),
        "languages_supported": random.randint(1, 10),
        "user_correction_rate": random.uniform(0, 20),
        "average_refinement_time": random.uniform(0.5, 5.0),
        "offline_sessions_count": random.randint(0, 100),
        "total_voice_inputs_processed": random.randint(0, 200),
        "total_translations_processed": random.randint(0, 150),
        "total_suggestions_generated": random.randint(0, 50),
        "total_suggestions_applied": random.randint(0, 30),
        "total_errors_encountered": random.randint(0, 20),
        "average_ai_confidence_score": random.uniform(80, 100),
        "average_user_feedback_score": random.uniform(1, 5),
        "timestamp": fake.date_time_this_month()
    }

# Function to generate random feedback data
def generate_feedback(user_id, communication_id, task_id):
    return {
        "user_id": user_id,
        "communication_id": communication_id,
        "task_id": task_id,
        "feedback_text": fake.sentence(),
        "rating": random.uniform(1, 5),
        "timestamp": fake.date_time_this_month(),
        "context_tags": random.sample(["meeting", "work", "personal", "urgent"], k=2),
        "suggestions_used": random.randint(0, 3),
        "corrections_made": random.randint(0, 3),
        "language": random.choice(languages),
        "source_language": random.choice(languages),
        "target_language": random.choice(languages),
        "device_used": random.choice(["Mobile", "Desktop"]),
        "offline_mode_used": random.choice([True, False])
    }

# Function to generate random notification data
def generate_notification(user_id, communication_id, task_id, suggestion_id):
    return {
        "user_id": user_id,
        "message": fake.sentence(),
        "type": random.choice(["task_completion", "suggestion", "error"]),
        "status": random.choice(["read", "unread"]),
        "timestamp": fake.date_time_this_month(),
        "related_communication_id": communication_id,
        "related_task_id": task_id,
        "related_suggestion_id": suggestion_id,
        "priority": random.choice(["High", "Medium", "Low"]),
        "action_required": random.choice([True, False]),
        "action_taken": random.choice([True, False]),
        "action_timestamp": fake.date_time_this_month()
    }

# Function to generate random settings data
def generate_settings(user_id):
    return {
        "user_id": user_id,
        "preferred_language": random.choice(languages),
        "notification_preferences": random.choice(["Email", "SMS", "Push"]),
        "offline_mode_enabled": random.choice([True, False]),
        "sync_frequency": random.choice(["Hourly", "Daily", "Weekly"]),
        "voice_input_settings": fake.json(),
        "translation_settings": fake.json(),
        "suggestion_settings": fake.json(),
        "privacy_settings": fake.json(),
        "theme": random.choice(["Light", "Dark"]),
        "auto_correction_enabled": random.choice([True, False]),
        "auto_suggestion_enabled": random.choice([True, False]),
        "auto_translation_enabled": random.choice([True, False]),
        "created_at": fake.date_time_this_year(),
        "last_updated": fake.date_time_this_month()
    }

# Insert data into MongoDB
def insert_data(num_users=5, num_communications_per_user=2, num_agents=3, num_tasks_per_user=2, 
                num_suggestions_per_task=2, num_languages=5, num_feedback_per_user=2, 
                num_notifications_per_user=3):
    
    # Insert users
    users = [generate_user(i) for i in range(num_users)]
    users_collection.insert_many(users)
    user_ids = [user["_id"] for user in users]

    # Insert communications (reduced)
    communications = []
    for user_id in user_ids:
        for _ in range(num_communications_per_user):
            communications.append(generate_communication(user_id))
    communications_collection.insert_many(communications)
    communication_ids = [comm["_id"] for comm in communications]

    # Insert agents (reduced)
    agents = [generate_agent() for _ in range(num_agents)]
    agents_collection.insert_many(agents)
    agent_ids = [agent["_id"] for agent in agents]

    # Insert tasks (reduced and simplified)
    tasks = []
    for user_id in user_ids:
        for _ in range(num_tasks_per_user):
            tasks.append(generate_task(user_id, random.choice(agent_ids)))
    tasks_collection.insert_many(tasks)
    task_ids = [task["_id"] for task in tasks]

    # Insert suggestions (reduced and simplified)
    suggestions = []
    for task_id in task_ids:
        comm_id = random.choice(communication_ids)
        for _ in range(num_suggestions_per_task):
            suggestions.append(generate_suggestion(comm_id, task_id))
    suggestions_collection.insert_many(suggestions)
    suggestion_ids = [suggestion["_id"] for suggestion in suggestions]

    # Insert languages
    languages_data = [generate_language() for _ in range(num_languages)]
    languages_collection.insert_many(languages_data)

    # Insert performance metrics (one per user)
    performance_metrics = [generate_performance_metrics(user_id) for user_id in user_ids]
    performance_metrics_collection.insert_many(performance_metrics)

    # Insert feedback (simplified)
    feedback = []
    for user_id in user_ids:
        for _ in range(num_feedback_per_user):
            feedback.append(generate_feedback(
                user_id,
                random.choice(communication_ids),
                random.choice(task_ids)
            ))
    feedback_collection.insert_many(feedback)

    # Insert notifications (simplified)
    notifications = []
    for user_id in user_ids:
        for _ in range(num_notifications_per_user):
            notifications.append(generate_notification(
                user_id,
                random.choice(communication_ids),
                random.choice(task_ids),
                random.choice(suggestion_ids)
            ))
    notifications_collection.insert_many(notifications)

    # Insert settings (one per user)
    settings = [generate_settings(user_id) for user_id in user_ids]
    settings_collection.insert_many(settings)

    print("Data insertion complete!")

# Run the data insertion with reduced numbers
insert_data()