"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Log } from "@/lib/mock-data";
import { getAgent, getLogs, AgentResponse, CallLog } from "@/lib/functions";
import { ArrowLeft, Loader2 } from "lucide-react";

interface AgentLogsPageProps {
  params: {
    uid: string;
  };
}

export default function AgentLogsPage({ params }: AgentLogsPageProps) {
  const router = useRouter();
  const { uid } = params;

  const [agent, setAgent] = useState<AgentResponse | null>(null);
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgentAndLogs();
  }, [uid]);

  const fetchAgentAndLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch agent details
      const agentData = await getAgent(uid);
      if (agentData) {
        setAgent(agentData);

        // Fetch logs for this agent
        const logsData = await getLogs(uid);
        if (logsData) {
          setLogs(logsData);
        }
      } else {
        setError("Agent not found");
      }
    } catch (err) {
      setError(
        "Failed to fetch agent data. Please check your API key and try again."
      );
      console.error("Error fetching agent and logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogClick = (logId: string) => {
    router.push(`/agent/${uid}/log/${logId}`);
  };

  const handleBackToAgents = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading agent data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!agent || error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
            <p className="text-muted-foreground mb-4">
              {error || "The requested agent could not be found."}
            </p>
            <Button onClick={handleBackToAgents}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
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
            onClick={handleBackToAgents}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Agents
          </Button>

          <div className="mb-4">
            <h1 className="text-3xl font-bold">{agent.name}</h1>
            <p className="text-muted-foreground">
              UID: {agent.uid} | Created:{" "}
              {new Date(agent.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Call ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transcript Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleLogClick(log.id)}
                >
                  <TableCell className="font-medium">{log.id}</TableCell>
                  <TableCell>
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {log.duration
                      ? `${Math.floor(log.duration / 60)}:${(log.duration % 60)
                          .toString()
                          .padStart(2, "0")}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        log.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : log.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.transcript
                      ? log.transcript.substring(0, 100) + "..."
                      : "No transcript available"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No logs found for this agent.
          </div>
        )}
      </div>
    </div>
  );
}
