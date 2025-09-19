"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAgent, getLogById, AgentResponse, CallLog } from "@/lib/functions";
import { ArrowLeft, Loader2 } from "lucide-react";

interface LogDetailsPageProps {
  params: {
    uid: string;
    logId: string;
  };
}

export default function LogDetailsPage({ params }: LogDetailsPageProps) {
  const router = useRouter();
  const { uid, logId } = params;

  const [agent, setAgent] = useState<AgentResponse | null>(null);
  const [log, setLog] = useState<CallLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgentAndLog();
  }, [uid, logId]);

  const fetchAgentAndLog = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch agent details
      const agentData = await getAgent(uid);
      if (agentData) {
        setAgent(agentData);

        // Fetch specific log
        const logData = await getLogById(logId);
        if (logData) {
          setLog(logData);
        } else {
          setError("Log not found");
        }
      } else {
        setError("Agent not found");
      }
    } catch (err) {
      setError(
        "Failed to fetch log data. Please check your API key and try again."
      );
      console.error("Error fetching agent and log:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogs = () => {
    router.push(`/agent/${uid}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading log details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!agent || !log || error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Log Not Found</h1>
            <p className="text-muted-foreground mb-4">
              {error || "The requested log could not be found."}
            </p>
            <Button onClick={handleBackToLogs}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Logs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBackToLogs}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Logs
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Call Details</h1>
            <p className="text-muted-foreground">
              Agent: {agent.name} | Call ID: {log.id}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Call Information */}
          <div className="rounded-md border p-6">
            <h2 className="text-xl font-semibold mb-4">Call Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Call ID
                </label>
                <p className="text-lg font-mono">{log.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date & Time
                </label>
                <p className="text-lg">
                  {new Date(log.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Duration
                </label>
                <p className="text-lg">
                  {log.duration
                    ? `${Math.floor(log.duration / 60)}:${(log.duration % 60)
                        .toString()
                        .padStart(2, "0")}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <p className="text-lg">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      log.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : log.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {log.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          {log.summary && (
            <div className="rounded-md border p-6">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <p className="text-foreground leading-relaxed">{log.summary}</p>
            </div>
          )}

          {/* Full Transcript */}
          <div className="rounded-md border p-6">
            <h2 className="text-xl font-semibold mb-4">Full Transcript</h2>
            <div className="bg-muted/50 rounded-md p-4">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {log.transcript || "No transcript available for this call."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
