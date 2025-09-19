"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Agent } from "@/lib/mock-data";
import {
  createAgent,
  deleteAgent,
  getAllAgents,
  AgentResponse,
} from "@/lib/functions";
import { Plus, Eye, Trash2, Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    prompt: "",
    first_message: "",
    knowledge_base_id: "",
  });

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllAgents();
      if (response) {
        // Convert API response to our Agent interface
        const convertedAgents: Agent[] = response.map(
          (apiAgent: AgentResponse) => ({
            id: apiAgent.id,
            name: apiAgent.name,
            domain: "General", // Default domain since API doesn't provide this
            prompt: "", // API doesn't return prompt in list view
            uid: apiAgent.uid,
          })
        );
        setAgents(convertedAgents);
      }
    } catch (err) {
      setError(
        "Failed to fetch agents. Please check your API key and try again."
      );
      console.error("Error fetching agents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    if (
      formData.name &&
      formData.domain &&
      formData.prompt &&
      formData.first_message &&
      formData.knowledge_base_id
    ) {
      setIsCreating(true);
      setError(null);

      try {
        const newAgent = await createAgent({
          name: formData.name,
          prompt: formData.prompt,
          first_message: formData.first_message,
          knowledge_base_id: formData.knowledge_base_id,
        });

        if (newAgent) {
          // Add the new agent to the list
          const convertedAgent: Agent = {
            id: newAgent.id,
            name: newAgent.name,
            domain: formData.domain,
            prompt: formData.prompt,
            uid: newAgent.uid,
          };
          setAgents([...agents, convertedAgent]);
          setFormData({
            name: "",
            domain: "",
            prompt: "",
            first_message: "",
            knowledge_base_id: "",
          });
          setIsDialogOpen(false);
        } else {
          setError("Failed to create agent. Please try again.");
        }
      } catch (err) {
        setError(
          "Failed to create agent. Please check your API key and try again."
        );
        console.error("Error creating agent:", err);
      } finally {
        setIsCreating(false);
      }
    }
  };

  const handleDeleteAgent = async (uid: string) => {
    setIsDeleting(uid);
    setError(null);

    try {
      const success = await deleteAgent(uid);
      if (success) {
        setAgents(agents.filter((agent) => agent.uid !== uid));
      } else {
        setError("Failed to delete agent. Please try again.");
      }
    } catch (err) {
      setError(
        "Failed to delete agent. Please check your API key and try again."
      );
      console.error("Error deleting agent:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleViewLogs = (uid: string) => {
    router.push(`/agent/${uid}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">OpenMic Bot Control Panel</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Agent</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter agent name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Select
                    value={formData.domain}
                    onValueChange={(value) =>
                      setFormData({ ...formData, domain: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Receptionist">Receptionist</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={formData.prompt}
                    onChange={(e) =>
                      setFormData({ ...formData, prompt: e.target.value })
                    }
                    placeholder="Enter agent prompt"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="first_message">First Message</Label>
                  <Input
                    id="first_message"
                    value={formData.first_message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        first_message: e.target.value,
                      })
                    }
                    placeholder="Enter first message"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="knowledge_base_id">Knowledge Base ID</Label>
                  <Input
                    id="knowledge_base_id"
                    value={formData.knowledge_base_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        knowledge_base_id: e.target.value,
                      })
                    }
                    placeholder="Enter knowledge base ID"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAgent}
                  disabled={
                    !formData.name ||
                    !formData.domain ||
                    !formData.prompt ||
                    !formData.first_message ||
                    !formData.knowledge_base_id ||
                    isCreating
                  }
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Agent"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading agents...</span>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>UID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.domain}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {agent.uid}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewLogs(agent.uid)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View Logs
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAgent(agent.uid)}
                          disabled={isDeleting === agent.uid}
                          className="flex items-center gap-1"
                        >
                          {isDeleting === agent.uid ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Delete Agent
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!isLoading && agents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No agents found. Create your first agent to get started.
          </div>
        )}
      </div>
    </div>
  );
}
