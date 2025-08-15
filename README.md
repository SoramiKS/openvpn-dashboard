# OpenVPN Management Dashboard

Sebuah dashboard berbasis web yang modern dan intuitif untuk memusatkan serta menyederhanakan proses monitoring dan manajemen beberapa server OpenVPN sekaligus.

![Screenshot Dashboard]
<img width="1858" height="1025" alt="Screenshot 2025-08-13 173417" src="https://github.com/user-attachments/assets/fdfd4382-1b7a-47b5-8125-b49faef84f93" />

---

## ✨ Fitur Utama

### 🔧 Manajemen Node
- Menambah, Mengedit, dan Menghapus node server OpenVPN.
- Informasi mencakup Nama Server, Alamat IP, dan Lokasi.
- Menyalin ID Server unik untuk sinkronisasi dengan agent.

### 👤 Manajemen Profil VPN
- Membuat profil pengguna baru dengan mudah.
- Mengunduh file konfigurasi `.ovpn` siap pakai.
- Menghapus profil untuk mencabut akses pengguna.

### 📜 Log Aktivitas
- Menyediakan jejak audit (audit trail).
- Mencatat semua tindakan penting seperti pembuatan/penghapusan profil, lengkap dengan informasi waktu dan server terkait.

---

## 🚀 Tumpukan Teknologi (Technology Stack)

- **Bahasa Pemrograman:** JavaScript  
- **Framework Aplikasi:** Next.js (React Framework)  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Web Server / Reverse Proxy:** Nginx  
- **Lingkungan Runtime & Tools:** Node.js, npm, PM2  

---

## ⚙️ Panduan Instalasi & Deployment

Panduan ini untuk server berbasis **Debian/Ubuntu**.

### Prasyarat
Pastikan software berikut sudah terinstal:
```bash
git
curl
nodejs (versi LTS)
postgresql & postgresql-contrib
nginx
```

---

### 1️⃣ Kloning Repositori
```bash
cd /var/www
sudo git clone https://github.com/SoramiKS/openvpn-dashboard.git ovpn
cd ovpn
```

---

### 2️⃣ Konfigurasi Database (PostgreSQL)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo -u postgres psql
```
Jalankan perintah SQL:
```sql
CREATE USER ovpn WITH PASSWORD 'YourStrongPassword';
CREATE DATABASE vpndashboard OWNER ovpn;
GRANT ALL PRIVILEGES ON DATABASE vpndashboard TO ovpn;
\q
```

---

### 3️⃣ Konfigurasi Aplikasi
```bash
sudo mv example.env .env
sudo nano .env
```
Isi `.env` seperti:
```env
DATABASE_URL="postgresql://ovpn:YourStrongPassword@localhost:5432/vpndashboard"
AGENT_API_KEY="your-super-secret-agent-api-key"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="https://yourdomain.com/api/auth"
NEXT_PUBLIC_DASHBOARD_URL="https://yourdomain.com"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-admin-password"
```

---

### 4️⃣ Instal Dependensi & Build
```bash
sudo npm install
sudo npx prisma migrate dev
sudo npm run build
```

---

## 🏃 Menjalankan Aplikasi

### Mode Development
```bash
npm run dev
```
Akses di: `http://localhost:3000`

### Mode Production (PM2 + Nginx)

#### a. PM2
```bash
sudo npm install -g pm2
pm2 start npm --name "ovpn-dashboard" -- start
pm2 startup systemd
pm2 save
```

#### b. Nginx Reverse Proxy
Buat file:
```bash
sudo nano /etc/nginx/sites-available/ovpn-dashboard
```
Isi:
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
    }
}
```
Aktifkan:
```bash
sudo ln -s /etc/nginx/sites-available/ovpn-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### c. SSL/TLS (Certbot)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## ✅ Selesai
Dashboard dapat diakses dengan aman di:  
`https://yourdomain.com`

---

## 📜 Lisensi
Proyek ini dilisensikan di bawah **MIT License**.  
Lihat file [LICENSE](LICENSE) untuk detail.

---

## ✍️ Author
**SoramiKS** – Initial work  
