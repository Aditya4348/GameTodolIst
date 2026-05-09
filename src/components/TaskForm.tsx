import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Difficulty } from "@/types";
import { Plus } from "lucide-react";

interface TaskFormProps {
  onAddTask: (title: string, difficulty: Difficulty, deadline: string) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(title, difficulty, deadline);
    setTitle("");
    setDeadline("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-xl border mb-8 shadow-sm">
      <div className="flex-1 space-y-2">
        <Label htmlFor="title" className="text-xs uppercase text-muted-foreground">Quest Title</Label>
        <Input
          id="title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-10"
        />
      </div>
      
      <div className="w-full md:w-32 space-y-2">
        <Label htmlFor="difficulty" className="text-xs uppercase text-muted-foreground">Difficulty</Label>
        <Select value={difficulty} onValueChange={(val) => setDifficulty(val as Difficulty)}>
          <SelectTrigger id="difficulty" className="h-10">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-48 space-y-2">
        <Label htmlFor="deadline" className="text-xs uppercase text-muted-foreground">Deadline</Label>
        <Input
          id="deadline"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="h-10 text-sm"
        />
      </div>

      <div className="flex items-end">
        <Button type="submit" className="h-10 w-full md:w-auto gap-2">
          <Plus className="h-4 w-4" />
          Add Quest
        </Button>
      </div>
    </form>
  );
}
