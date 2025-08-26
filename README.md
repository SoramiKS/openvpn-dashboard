# 🌐 OpenVPN Centralized Dashboard

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?logo=prisma)
![Postgres](https://img.shields.io/badge/PostgreSQL-DB-316192?logo=postgresql)
![Tailwind](https://img.shields.io/badge/TailwindCSS-CSS-38b2ac?logo=tailwindcss)

A modern web-based dashboard to centralize, monitor, and manage multiple OpenVPN servers seamlessly from one control panel.

![Dashboard Screenshot](https://github.com/user-attachments/assets/cc106ff6-872a-4491-b86d-7a75c35cb919)

---

## 🎯 About the Project

Managing multiple OpenVPN servers manually through CLI is time-consuming and often inefficient.  
This project aims to simplify the life of administrators by providing a modern, intuitive, and secure UI.  
From user profiles to server monitoring, everything can now be managed from a single centralized dashboard.

---

## ✨ Key Features

### 🔧 Node (Server) Management
- Full CRUD operations for OpenVPN nodes.
- Real-time monitoring of server status (Online/Offline, CPU, RAM usage).
- Secure synchronization with unique tokens.

### 👤 User Management & RBAC
- Role-based access: Admin vs. User.
- Admins can manage nodes, VPN profiles, and dashboard users.
- Users can only download their assigned VPN profiles.

### 🔑 VPN Profile Management
- Create and assign VPN profiles to specific nodes.
- Download ready-to-use `.ovpn` files.
- Revoke user access instantly.
- Easy-to-use search, filter, and pagination.

### 📜 Monitoring & Logs
- **Action Logs:** Track all admin activities.
- **User Logs:** Connection and disconnection history of VPN users.
- Advanced filters (by node, action type, or date range).

### 🔐 Security
- Automatic initial admin setup on first installation.
- Secure login with bcrypt password hashing.
- Google reCAPTCHA v2 on the login page.
- NextAuth middleware to protect routes and pages.

---

## 🏗️ Architecture

```mermaid
graph TD
    A[Admin/User] -->|Access via Browser| B(Dashboard - Next.js)
    B <--> C[(PostgreSQL Database)]
    B --> D[Action Logs]
    E[Agent - Python on VPN Server] -->|Sync & Reports| B
    E <--> F(OpenVPN Server)
```

- **Dashboard:** Built with Next.js, React, TypeScript, Tailwind, shadcn/ui.  
- **Agent:** Lightweight FastAPI service on each OpenVPN server.  
- **Database:** PostgreSQL managed with Prisma ORM.  

---

## 🚀 Tech Stack

- **Framework:** Next.js (App Router), React  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS, shadcn/ui  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Authentication:** NextAuth.js  
- **Agent:** Python + FastAPI  
- **Deployment:** PM2, Nginx, Certbot  

---

## ⚙️ Installation Guide

### 1. Dashboard Setup (Web Server)

**Requirements:** Debian/Ubuntu server with Node.js v18+, PostgreSQL, Git, Nginx.  

1. Install dependencies  
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt update && sudo apt install -y git curl nodejs postgresql postgresql-contrib nginx
```

2. Clone repository & install dependencies  
```bash
cd /var/www
sudo git clone <REPOSITORY_URL> dashboard
cd dashboard
sudo pnpm install
```

3. Setup PostgreSQL database  
```sql
CREATE DATABASE vpndashboard;
CREATE USER ovpn WITH ENCRYPTED PASSWORD 'StrongPasswordHere';
GRANT ALL PRIVILEGES ON DATABASE vpndashboard TO ovpn;
\q
```

4. Configure `.env`  
```bash
DATABASE_URL="postgresql://ovpn:StrongPasswordHere@localhost:5432/vpndashboard"
AGENT_API_KEY="YourRandomAPIKey"
NEXTAUTH_SECRET="YourRandomSecureSecret"
NEXTAUTH_URL="https://dashboard.yourdomain.com"
NEXT_PUBLIC_DASHBOARD_URL="https://dashboard.yourdomain.com"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="YourRecaptchaSiteKey"
RECAPTCHA_SECRET_KEY="YourRecaptchaSecretKey"
```

5. Run migration & build project  
```bash
sudo pnpm prisma migrate dev
sudo pnpm build
```

6. Run with PM2  
```bash
sudo pnpm install -g pm2
pm2 start pnpm --name "ovpn-dashboard" -- start
pm2 startup
pm2 save
```

7. Configure Nginx reverse proxy  
```nginx
server {
    listen 80;
    server_name dashboard.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable & reload Nginx:  
```bash
sudo ln -s /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. Secure with SSL (optional but recommended)  
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d dashboard.yourdomain.com
```

9. First-time setup: Open the dashboard in your browser and create the first admin account.

---

### 2. Agent Setup (on OpenVPN Server)

1. Copy deployment script to `/root`:  
```bash
chmod +x /root/deploymentovpn-refined.sh
```

2. Run the script and enter API Key + Server ID provided by dashboard.  
```bash
sudo /root/deploymentovpn-refined.sh
```

3. Configure firewall:  
```bash
sudo ufw allow from <DASHBOARD_IP> to any port 8080 proto tcp
sudo ufw allow from <DASHBOARD_IP> to any port 161 proto udp
```

Repeat on each OpenVPN server you want to add.

---

## 🔗 Integration with OpenVPN Agent

The **OpenVPN Dashboard** requires an **OpenVPN Agent** running on each server.  
This agent is responsible for handling communication between the dashboard and the OpenVPN server, including status reporting, command execution, and log collection.  

👉 [OpenVPN Agent Repository](https://github.com/SoramiKS/ovpn-agent-bash)

### How It Works
1. Deploy the agent on every OpenVPN server you want to manage.
2. Connect the agent to the dashboard using the provided `API_KEY` and unique `SERVER_ID`.
3. Once connected, the dashboard will automatically detect the server and display:  
   - Real-time server metrics  
   - VPN profiles assigned to users  
   - Connection logs and activities  

---

## 📜 License

Licensed under MIT License.

---

## ✍️ Author

**SoramiKS**  
