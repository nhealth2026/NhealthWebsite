# Deploying NHealth to Render with Neon PostgreSQL

Follow these simple steps to deploy your NHealth platform to [Render.com](https://render.com) for free:

---

## 🚀 Quick Deployment Guide

### Option 1: Automatic Blueprint Deploy (Recommended)
1. Go to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** → Select **Blueprint**.
3. Connect your GitHub repository: `https://github.com/nhealth2026/NhealthWebsite.git`.
4. Render will automatically detect `render.yaml`.
5. Under Environment Variables, set:
   - **`DATABASE_URL`**: `postgresql://<your_neon_user>:<your_neon_password>@<your_neon_host>/neondb?sslmode=require`
6. Click **Apply**. Render will install dependencies, create tables on Neon PostgreSQL, and launch your site with Gunicorn!

---

### Option 2: Manual Web Service Deploy
1. In Render Dashboard, click **New +** → **Web Service**.
2. Select your repository: `nhealth2026/NhealthWebsite`.
3. Configure the settings:
   - **Name**: `nhealth-technologies`
   - **Region**: Oregon or Ohio (close to Neon AWS us-east-2)
   - **Branch**: `main`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: `Free`
4. Expand **Advanced** → **Add Environment Variable**:
   - Key: `DATABASE_URL`  
     Value: *(Paste your secret Neon PostgreSQL connection string here)*
   - Key: `FLASK_ENV`  
     Value: `production`
   - Key: `PYTHON_VERSION`  
     Value: `3.11.8`
5. Click **Deploy Web Service**.

---

## ⚡ What Happens on First Deploy
- Gunicorn starts `app:app`.
- The application automatically connects to **Neon PostgreSQL**.
- `db.create_all()` creates all tables:
  - `users`
  - `doctor_profiles`
  - `appointments`
  - `prescriptions`
  - `health_records`
- The seeder runs automatically, creating the demo accounts:
  - **Admin**: `admin@nhealth.tech` / `Admin@123`
  - **Doctor**: `doctor@nhealth.tech` / `Doctor@123`
  - **Patient**: `patient@nhealth.tech` / `Patient@123`
- Your website is immediately accessible globally with free HTTPS SSL on `https://your-service.onrender.com`!
