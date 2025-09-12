// app/dashboard/wstest/page.tsx
"use client";
import { useEffect, useState } from 'react';

export default function WsTestPage() {
    const [status, setStatus] = useState('Menghubungkan...');
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        console.log('Mencoba menghubungkan WebSocket...');
        const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsUrl = `${wsProtocol}://${window.location.host}/api/wss`;
        const ws = new WebSocket(wsUrl);


        ws.onopen = () => {
            console.log('WSTEST: Koneksi TERBUKA');
            setStatus('Terhubung ✅');
        };

        ws.onmessage = (event) => {
            console.log('WSTEST: Pesan diterima', event.data);
            setMessages(prev => [...prev, event.data]);
        };

        ws.onerror = (event) => {
            console.error('WSTEST: WebSocket Error', event);
            setStatus('Error ❌');
        };

        ws.onclose = (event) => {
            console.log('WSTEST: Koneksi TERTUTUP', event);
            setStatus(`Terputus 🔌 (Kode: ${event.code}, Alasan: ${event.reason})`);
        };

        // Cleanup function
        return () => {
            console.log('WSTEST: Menutup koneksi di cleanup...');
            ws.close();
        };
    }, []); // Dependency array kosong, HANYA berjalan sekali

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Tes Koneksi WebSocket</h1>
            <h2 style={{ fontSize: '2rem' }}>Status: <span style={{ fontWeight: 'bold' }}>{status}</span></h2>
            <h3>Pesan yang Diterima:</h3>
            <pre style={{ background: '#f0f0f0', padding: '1rem', border: '1px solid #ccc', minHeight: '100px' }}>
                {messages.join('\n')}
            </pre>
        </div>
    );
}