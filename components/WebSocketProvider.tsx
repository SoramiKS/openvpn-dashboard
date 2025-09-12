"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Node } from "@prisma/client";

interface NodeStatusUpdateMessage {
  type: "NODE_STATUS_UPDATE";
  payload: Node[];
}

type WSMessage = NodeStatusUpdateMessage;

interface WSContextType {
  nodesData: Node[];
}

const WSContext = createContext<WSContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [nodesData, setNodesData] = useState<Node[]>([]);

  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${wsProtocol}://${window.location.host}/ws?type=frontend`);

    ws.onmessage = (e: MessageEvent) => {
      try {
        const msg: WSMessage = JSON.parse(e.data);
        if (msg.type === "NODE_STATUS_UPDATE") setNodesData(msg.payload);
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error", err);
    return () => ws.close();
  }, []);

  return <WSContext.Provider value={{ nodesData }}>{children}</WSContext.Provider>;
};

export const useWS = (): WSContextType => {
  const context = useContext(WSContext);
  if (!context) throw new Error("useWS must be used within a WebSocketProvider");
  return context;
};
