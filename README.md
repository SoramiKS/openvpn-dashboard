# 🌐 OpenVPN Centralized Dashboard

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?logo=prisma)
![Postgres](https://img.shields.io/badge/PostgreSQL-DB-316192?logo=postgresql)
![Tailwind](https://img.shields.io/badge/TailwindCSS-CSS-38b2ac?logo=tailwindcss)

Dashboard web modern untuk memusatkan, memonitor, dan mengelola beberapa server OpenVPN dengan mudah dari satu titik kontrol.

---

## 🎯 Tentang Proyek

Mengelola banyak server OpenVPN secara manual lewat CLI itu ribet + makan waktu.  
Proyek ini hadir buat nyelametin waktu admin dengan **UI modern, intuitif, dan aman**, biar semua server, user VPN, sampai log koneksi bisa diatur dari satu dashboard.

---

## ✨ Fitur Utama

### 🔧 Manajemen Node
- CRUD node server OpenVPN.
- Monitoring real-time (status, CPU, RAM).
- ID unik untuk sinkronisasi agen.

### 👤 Manajemen Pengguna & RBAC
- Role **Admin** & **User**.
- Admin bisa kelola semua: node, profil VPN, user dashboard.
- User cuma bisa unduh profil VPN yang ditugasin.

### 🔑 Manajemen Profil VPN
- Buat profil VPN & assign ke node.
- Download `.ovpn` ready-to-use.
- Revoke user kapan aja.
- Search, filter, pagination.

### 📜 Monitoring & Log
- **Action logs** → semua aktivitas admin ke-track.
- **User activity logs** → histori koneksi/diskoneksi.
- Filter canggih (by node, action, tanggal).

### 🔐 Keamanan
- Setup admin pertama otomatis.
- Login aman dengan bcrypt.
- Google reCAPTCHA v2.
- Middleware NextAuth buat proteksi route.

---

## 🏗️ Arsitektur

Aplikasi punya dua komponen:

1. **Dashboard (Next.js, proyek ini)** → UI buat admin/user.
2. **Agent (Python, di tiap server)** → komunikasi ke dashboard, eksekusi perintah, laporin status.

```mermaid
graph TD
    A[Admin/User] -->|Akses Web| B(Dashboard - Next.js)
    B <--> C{Database - PostgreSQL}
    B --> D[Action Log]
    E[Agent - Python di Server VPN] -->|Sync & Report| B
    E <--> F(Server OpenVPN)
```

---

## 🚀 Tech Stack

| Kategori        | Teknologi |
|-----------------|-----------|
| Framework       | Next.js (App Router), React |
| Bahasa          | TypeScript |
| Styling         | Tailwind CSS, shadcn/ui |
| Database        | PostgreSQL |
| ORM             | Prisma |
| Otentikasi      | NextAuth.js |
| Deployment      | PM2, Nginx, Certbot |

---

## ⚙️ Instalasi & Deployment

> Panduan ini untuk server **Debian/Ubuntu**.

### Prasyarat
- `git`, `curl`
- Node.js >= 18
- PostgreSQL
- Nginx

# 🚀 Setup

Install semua dependency sekali jalan:

```bash
# Tambah Node.js 18 repo
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install semua dependency
sudo apt update && sudo apt install -y git curl nodejs postgresql postgresql-contrib nginx
```

### 1️⃣ Clone Repo & Install
```bash
cd /var/www
sudo git clone https://github.com/SoramiKS/openvpn-dashboard.git ovpn
cd ovpn
sudo npm install
```

### 2️⃣ Setup Database
```bash
sudo -u postgres psql
```
```sql
CREATE DATABASE vpndashboard;
CREATE USER ovpn WITH ENCRYPTED PASSWORD 'YourStrongPassword';
GRANT ALL PRIVILEGES ON DATABASE vpndashboard TO ovpn;
\q
```

### 3️⃣ Konfigurasi `.env`
```bash
sudo cp .env.example .env
sudo nano .env
```

Isi sesuai:
```env
DATABASE_URL="postgresql://ovpn:YourStrongPassword@localhost:5432/vpndashboard"
AGENT_API_KEY="ganti-dengan-kunci-rahasia-yang-kuat"
NEXTAUTH_SECRET="your-super-strong-random-nextauth-secret"
NEXTAUTH_URL="https://yourdomain.com"

NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"
```

### 4️⃣ Migrasi & Build
```bash
sudo npx prisma migrate dev
sudo npm run build
```

---

## 🏃 Jalankan Aplikasi

### Development
```bash
npm run dev
```
→ Akses di `http://localhost:3000`

### Production (Recommended)

**a. PM2**
```bash
sudo npm install -g pm2
pm2 start npm --name "ovpn-dashboard" -- start
pm2 startup
pm2 save
```

**b. Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

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

Aktifkan config:
```bash
sudo ln -s /etc/nginx/sites-available/ovpn-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**c. SSL dengan Certbot**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## 🚀 Setup Awal

Akses `https://yourdomain.com` → bakal muncul **Setup Admin Pertama**.  
Setelah bikin akun admin, sistem siap dipakai.

---

## 🔗 Agent

Dashboard butuh **OpenVPN Agent** di tiap server.  
👉 [Repo Agent OpenVPN](https://github.com/SoramiKS/ovpn-agent-bash)

---

## 📜 Lisensi
MIT License.

---

## ✍️ Author
**SoramiKS**
