#!/bin/bash
# shellcheck disable=SC2164,SC2034

# Path ke skrip install OpenVPN (pastikan sesuai)
OPENVPN_INSTALL_SCRIPT="/root/ubuntu-22.04-lts-vpn-server.sh"

create_client() {
    local username=$1
    if [ -z "$username" ]; then
        echo "❌ Bro masukkan username. Usage: $0 create <username>"
        exit 1
    fi

    echo "➕ Creating new client: $username"
    printf "1\n%s\n1\n" "$username" | "$OPENVPN_INSTALL_SCRIPT"
    echo "✅ Client '$username' created successfully."
}

revoke_client() {
    local username="$1"

    if [ -z "$username" ]; then
        echo "❌ Bro masukkan username. Usage: $0 revoke <username>"
        exit 1
    fi

    echo "🔍 Nyari nomor client '$username' dari index.txt..."

    # Ambil nomor client dari index.txt (valid client only, case-insensitive)
    local client_number
    client_number=$(tail -n +2 /etc/openvpn/easy-rsa/pki/index.txt | grep "^V" | cut -d '=' -f2 | nl -w1 -s' ' | \
        awk -v name="$username" 'BEGIN{IGNORECASE=1} $2 == name {print $1; exit}')


    if [ -z "$client_number" ]; then
        echo "❌ Gak nemu client '$username'. Coba cek list pake: ./openvpn-client-manager.sh list"
        exit 1
    fi

    echo "✅ Ketemu! '$username' ada di nomor $client_number"
    echo "⚙️  Kirim input ke script buat revoke..."

    expect <<EOF
        spawn sudo "$OPENVPN_INSTALL_SCRIPT"
        expect "Select an option*" { send "2\r" }
        expect "Select one client*" { send "$client_number\r" }
        expect eof
EOF

    echo "✅ Client '$username' udah direvoke. RIP 🪦"
}

list_clients() {
    echo "📋 Listing active clients dari Easy-RSA index.txt..."
    if [[ -f /etc/openvpn/easy-rsa/pki/index.txt ]]; then
        grep "^V" /etc/openvpn/easy-rsa/pki/index.txt | \
        cut -d '=' -f2 | \
        grep -v '^server_' # Adjust this line if needed
    else
        echo "❌ index.txt gak ketemu di /etc/openvpn/easy-rsa/pki/"
        exit 1
    fi
}

# Main entrypoint
case "$1" in
    create)
        create_client "$2"
        ;;
    revoke)
        revoke_client "$2"
        ;;
    list)
        list_clients
        ;;
    *)
        echo "Usage: $0 {create|revoke|list} <username>"
        exit 1
        ;;
esac
