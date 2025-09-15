// components/WebSocketProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Node, NodeStatus } from "@prisma/client";

// Tipe data payload dari backend
interface AgentStatusChangePayload {
  serverId: string;
  status: NodeStatus;
}
type NodeMetricsUpdatePayload = Partial<Node> & { id: string };

// Tipe data untuk pesan yang berbeda
type AgentStatusChangeMessage = {
  event: "agent-status-change";
  payload: AgentStatusChangePayload;
};
type NodeMetricsUpdateMessage = {
  type: "NODE_STATUS_UPDATE";
  payload: NodeMetricsUpdatePayload;
};
type WSMessage = AgentStatusChangeMessage | NodeMetricsUpdateMessage;

interface WSContextType {
  nodesData: Node[];
  isConnected: boolean;
  lastMessage: MessageEvent | null;
}

const WSContext = createContext<WSContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [nodesData, setNodesData] = useState<Node[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

  const fetchInitialNodes = useCallback(async () => {
    try {
      const response = await fetch("/api/nodes");
      if (response.ok) {
        const data = await response.json();
        // PERBAIKAN: Tambahkan tipe 'Node' pada parameter 'node'
        const typedData: Node[] = data.map((node: Node) => ({
          ...node,
          createdAt: new Date(node.createdAt),
          updatedAt: new Date(node.updatedAt),
          lastSeen: node.lastSeen ? new Date(node.lastSeen) : null,
          deletionStartedAt: node.deletionStartedAt ? new Date(node.deletionStartedAt) : null,
        }));
        setNodesData(typedData);
      } else {
        console.error("Failed to fetch initial node data.");
      }
    } catch (error) {
      console.error("Error fetching initial nodes:", error);
    }
  }, []);

  useEffect(() => {
    fetchInitialNodes();

    const wsPort = process.env.NODE_ENV === 'development' ? '3001' : window.location.port;
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${wsProtocol}://${window.location.hostname}:${wsPort}/ws?type=frontend`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onerror = (err) => console.error("WebSocket error:", err);

    ws.onmessage = (event: MessageEvent) => {
      setLastMessage(event);
      try {
        const msg: WSMessage = JSON.parse(event.data);

        setNodesData(prevNodes => {
          if ('event' in msg && msg.event === "agent-status-change") {
            return prevNodes.map(node =>
              node.id === msg.payload.serverId
                ? { ...node, status: msg.payload.status, lastSeen: new Date() }
                : node
            );
          }
          if ('type' in msg && msg.type === "NODE_STATUS_UPDATE") {
            const { payload } = msg;
            const updatedPayload = {
              ...payload,
              lastSeen: payload.lastSeen ? new Date(payload.lastSeen) : new Date(),
            };
            return prevNodes.map(node =>
              node.id === updatedPayload.id
                ? { ...node, ...updatedPayload }
                : node
            );
          }
          return prevNodes;
        });

      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    return () => ws.close();
  }, [fetchInitialNodes]);

  return (
    <WSContext.Provider value={{ nodesData, isConnected, lastMessage }}>
      {children}
    </WSContext.Provider>
  );
};

export const useWS = (): WSContextType => {
  const context = useContext(WSContext);
  if (!context) {
    throw new Error("useWS must be used within a WebSocketProvider");
  }
  return context;
};