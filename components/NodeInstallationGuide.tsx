// components/NodeInstallationGuide.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import DialogFooter

// Helper component for the copy button
const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const { toast } = useToast();
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied!",
      description: "Text has been copied to clipboard.",
    });
  };
  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} className="shrink-0">
      <Copy className="h-4 w-4" />
    </Button>
  );
};

// Props required by the guide component
interface NodeInstallationGuideProps {
  nodeName: string;
  serverId: string;
  apiKey: string;
  dashboardUrl: string;
  onFinish: () => void; // New prop to handle dialog closing
}

export function NodeInstallationGuide({ nodeName, serverId, apiKey, dashboardUrl, onFinish }: NodeInstallationGuideProps) {
  const [step, setStep] = useState(1);

  const scriptUrl = "https://raw.githubusercontent.com/co2ngadimin/ovpn-agent-bash/refs/heads/main/deploymentovpn.sh";
  const wgetCommand = `wget ${scriptUrl} -O install.sh`;
  const chmodCommand = "chmod +x install.sh";
  const runCommand = "sudo ./install.sh";

  // Extract information from dashboardUrl for the guide
  let hostname = "localhost";
  let port = "3000";
  let isIpAddress = false;
  try {
    const url = new URL(dashboardUrl);
    hostname = url.hostname;
    port = url.port || (url.protocol === "https:" ? "443" : "80");
    isIpAddress = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
  } catch (e) {
    // FIX: Using variable 'e' to remove unused-vars warning
    console.error("Invalid dashboardUrl provided:", dashboardUrl, e);
  }

  return (
    // Using DialogHeader and DialogFooter for consistency
    <>
      <DialogHeader>
        {/* FIX: Replace " with &quot; to remove no-unescaped-entities error */}
        <DialogTitle className="text-2xl">Installation Guide for Node &quot;{nodeName}&quot;</DialogTitle>
        <DialogDescription>Step {step} of 2: {step === 1 ? "Preparing Script on Server" : "Filling Configuration"}</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {step === 1 && (
          <div className="space-y-4">
            <p>Run the following commands in order on your new server terminal.</p>
            <div>
              <h4 className="font-semibold text-sm mb-1">1. Download Installation Script</h4>
              <div className="flex items-center gap-2 p-2 bg-slate-800 text-white rounded-md font-mono text-sm">
                <span className="flex-grow overflow-x-auto">{wgetCommand}</span>
                <CopyButton textToCopy={wgetCommand} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">2. Give Execution Permission</h4>
              <div className="flex items-center gap-2 p-2 bg-slate-800 text-white rounded-md font-mono text-sm">
                <span className="flex-grow">{chmodCommand}</span>
                <CopyButton textToCopy={chmodCommand} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">3. Run the Script</h4>
              <div className="flex items-center gap-2 p-2 bg-slate-800 text-white rounded-md font-mono text-sm">
                <span className="flex-grow">{runCommand}</span>
                <CopyButton textToCopy={runCommand} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground pt-2">After running the last command, the terminal will ask for input. Continue to the next step to see the data you need to provide.</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <p>Use the information below to answer the questions that appear in your terminal.</p>
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Application Name for PM2:</p>
                  <code className="text-sm text-blue-600">{nodeName}</code>
                </div>
                <CopyButton textToCopy={nodeName} />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">AGENT_API_KEY:</p>
                  <code className="text-sm text-blue-600 font-mono">{apiKey}</code>
                </div>
                <CopyButton textToCopy={apiKey} />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Dashboard API Address:</p>
                <div className="pl-4 border-l-2">
                  <p className="text-xs text-muted-foreground mb-1">The script will ask for the type of address. {isIpAddress ? "Choose option '1' (IP Address)." : "Choose option '2' (Domain Name)."} </p>
                  <div className="flex justify-between items-center">
                    <code className="text-sm text-blue-600 font-mono">{hostname}</code>
                    <CopyButton textToCopy={hostname} />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Custom Port:</p>
                <div className="pl-4 border-l-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    {port === "443" || port === "80" ? "Choose 'N' (No), since you are using a standard port." : `Choose 'Y' (Yes), then enter the following port:`}
                  </p>
                  {(port !== "443" && port !== "80") && (
                    <div className="flex justify-between items-center">
                      <code className="text-sm text-blue-600 font-mono">{port}</code>
                      <CopyButton textToCopy={port} />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Server ID:</p>
                  <code className="text-sm text-blue-600 font-mono">{serverId}</code>
                </div>
                <CopyButton textToCopy={serverId} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground pt-2">Once all inputs are filled in, the script will complete the installation. Your node will soon connect to the dashboard.</p>
          </div>
        )}
      </div>

      <DialogFooter>
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={() => setStep(1)} disabled={step === 1}>
            Back
          </Button>
          {step === 1 ? (
            <Button onClick={() => setStep(2)}>
              Next Step
            </Button>
          ) : (
            <Button onClick={onFinish}>
              Finish
            </Button>
          )}
        </div>
      </DialogFooter>
    </>
  );
}
