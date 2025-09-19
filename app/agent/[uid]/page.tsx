"use client";

import { useState, useEffect, useCallback } from "react";
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
import { AgentResponse } from "@/lib/mock-data";
import { getAgent, getLogs, CallLog } from "@/lib/functions";
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
  const fetchAgentAndLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch agent details
      console.log(uid);
      const agentData = await getAgent(uid);
      console.log(agentData);
      if (agentData) {
        setAgent(agentData);

        // Fetch logs for this agent
        console.log(uid);
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
  }, [uid]);
  useEffect(() => {
    fetchAgentAndLogs();
  }, [fetchAgentAndLogs]);



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
            <p className="text-muted-foreground">UID: {agent.uid}</p>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From Number</TableHead>
                <TableHead>To Number</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log.call_id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleLogClick(log.call_id)}
                >
                  <TableCell className="font-medium">
                    {log.from_number}
                  </TableCell>
                  <TableCell>{log.to_number}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        log.direction === "inbound"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {log.direction}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(log.start_timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {Math.floor(log.duration_ms / 60000)}:
                    {Math.floor((log.duration_ms % 60000) / 1000)
                      .toString()
                      .padStart(2, "0")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        log.call_status === "ended"
                          ? "bg-green-100 text-green-800"
                          : log.call_status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {log.call_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {log.call_analysis ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          log.call_analysis.is_successful
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {log.call_analysis.success_evaluation}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {log.call_cost
                      ? `$${log.call_cost.total_cost.toFixed(4)}`
                      : "N/A"}
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