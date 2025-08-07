// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "vpn-agent", // Nama aplikasi Anda di PM2
      script: "/usr/bin/python3", // Interpreter Python yang akan menjalankan modul uvicorn
      args: "-m uvicorn main:app --host 0.0.0.0 --port 8080", // Argumen untuk interpreter: menjalankan modul uvicorn
      cwd: "/home/ovpn/agent-baru", // Ganti dengan path absolut ke direktori agen Anda
      exec_mode: "fork", // Mode eksekusi (fork untuk aplikasi tunggal)
      instances: 1, // Jumlah instance (untuk FastAPI, biasanya 1 kecuali Anda punya load balancer di depan)
      autorestart: true, // Otomatis restart jika crash
      watch: false, // Jangan watch di produksi, tapi bisa di true untuk dev
      max_memory_restart: "1G", // Restart jika penggunaan memori melebihi 1GB
      env: {
        NODE_ENV: "production",
        AGENT_API_KEY: "agent-api-key", // Ganti dengan API Key Anda yang sebenarnya
        SERVER_ID: "server-id", // Ganti dengan ID Server Anda yang sebenarnya
        DASHBOARD_API_URL: "dashboard-api-url", // Ganti dengan URL dasbor Anda
        SCRIPT_PATH: "./openvpn-client-manager.sh", // Path ke script bash Anda
        OVPN_DIR: "/home/user", // Direktori OVPN
        EASY_RSA_INDEX_PATH: "/etc/openvpn/easy-rsa/pki/index.txt",
        EASY_RSA_SERVER_NAME_PATH:
          "/etc/openvpn/easy-rsa/SERVER_NAME_GENERATED",
      },
      // Jika Anda ingin log terpisah
      output: "./logs/agent-out.log",
      error: "./logs/agent-err.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
