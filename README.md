# ⚔️ Life RPG - Gamified Productivity & Daily Quest Tracker

> Turn your daily tasks into an epic RPG adventure! Level up your real-life attributes, earn gold, maintain streaks, and complete daily quests.

---

## 🌟 Overview

**Life RPG** is a full-stack gamified task management application. It transforms daily to-do lists, habits, and personal goals into an interactive Role-Playing Game (RPG). Completing real-life tasks awards **Experience Points (XP)**, levels up your character, earns **Gold** to buy exclusive cosmetics in the Arcane Shop, and boosts character **Attributes** like *Strength*, *Intelligence*, *Discipline*, *Creativity*, and *Vitality*.

---

## 🚀 Features

- 📝 **Interactive Daily To-Do Hub**: Quick-add tasks with categories (`Work`, `Learning`, `Health`, `Creative`, `Wellness`) and difficulty levels (`Easy`, `Medium`, `Hard`).
- ⚡ **Leveling & XP Engine**: Automatic level-ups when XP targets are reached.
- 🪙 **Gold Economy & Arcane Shop**: Earn gold by finishing tasks and spend it on avatars, golden frames, themes, badges, and companions.
- 🔥 **Streak Counter**: Track daily activity streaks to keep your momentum going.
- 📊 **Attribute Stat Progression**: Specific task categories boost distinct stats (*Health* -> *Strength*, *Learning* -> *Intelligence*, *Work* -> *Discipline*).
- 🏆 **Achievements System**: Unlock milestone trophies (e.g. *First Quest*, *7-Day Streak*, *Scholar*).
- 🔒 **Secure JWT Authentication**: User registration and login with encrypted password storage.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Dark Mode & Arcane Aesthetic)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) (with JWT Interceptors)
- **Data Charts**: [Recharts](https://recharts.org/)

### **Backend**
- **Framework**: [Python 3](https://www.python.org/) + [Flask](https://flask.palletsproducts.com/)
- **ORM / Database**: [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsproducts.com/) (SQLite default with MySQL 8+ support)
- **Authentication**: [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/) + [Bcrypt](https://pypi.org/project/bcrypt/)
- **CORS Management**: [Flask-Cors](https://flask-cors.readthedocs.io/)

---

## 🏗️ Project Architecture

```
RPG/
├── backend/
│   ├── app/
│   │   ├── __init__.py        # Flask application factory
│   │   ├── config.py          # Database & environment configuration
│   │   ├── extensions.py      # SQLAlchemy & JWT extensions
│   │   ├── models.py          # Database models (User, Quest, Shop, etc.)
│   │   ├── services.py        # XP, Leveling, and Gold logic
│   │   └── routes/            # Blueprint routes (auth, quests, shop, etc.)
│   ├── run.py                 # Backend entry point (Port 5000)
│   ├── seed.py                # Database seeding script
│   └── requirements.txt       # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── api/               # Axios API service module
    │   ├── components/        # Reusable UI components (QuestCard, Sidebar, etc.)
    │   ├── context/           # AppContext for global authentication state
    │   ├── pages/             # App pages (Dashboard, Quests, Shop, Progress)
    │   └── App.jsx            # Main App routes and layout
    ├── package.json           # Frontend dependencies
    └── vite.config.js         # Vite configuration & backend proxy
```

---

## 💻 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database (Creates tables & demo user: aelindra / password123)
python seed.py

# Start Flask Backend Server (Runs on http://localhost:5000)
python run.py
```

---

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install node packages
npm install

# Start Vite Development Server (Runs on http://localhost:5173)
npm run dev
```

---

## 🎮 Demo User Credentials

You can test the application using the pre-seeded demo user:
- **Username**: `aelindra`
- **Password**: `password123`

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.