import * as React from "react";
import { Task, XP_REWARDS } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Clock, Zap } from "lucide-react";
import { formatDistanceToNow, isPast } from "date-fns";
import { motion } from "motion/react";

interface TaskItemProps {
  key?: React.Key;
  task: Task;
  onToggle: (id: string, completed: boolean, difficulty: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const isExpired = task.deadline && isPast(new Date(task.deadline)) && !task.is_completed;
  
  const difficultyColor = {
    Easy: "bg-green-100 text-green-700 hover:bg-green-100",
    Medium: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    Hard: "bg-red-100 text-red-700 hover:bg-red-100",
  }[task.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className={`flex items-center justify-between p-4 mb-3 rounded-xl border transition-all ${
        task.is_completed ? "bg-muted/50 border-muted opacity-80" : "bg-card border-border hover:shadow-md"
      } ${isExpired ? "border-red-400 bg-red-50/30" : ""}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <Checkbox
          checked={task.is_completed}
          onCheckedChange={(checked) => onToggle(task.id, !!checked, task.difficulty)}
          className="h-5 w-5 rounded-md"
        />
        <div className="flex flex-col">
          <span className={`font-medium ${task.is_completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {task.title}
          </span>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="secondary" className={`text-[10px] uppercase font-bold py-0 ${difficultyColor}`}>
              <Zap className="h-3 w-3 mr-1 fill-current" />
              {task.difficulty} (+{XP_REWARDS[task.difficulty]} XP)
            </Badge>
            {task.deadline && (
              <span className={`text-[11px] flex items-center gap-1 ${isExpired ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
                <Clock className="h-3 w-3" />
                {isPast(new Date(task.deadline)) ? "Expired" : formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        className="text-muted-foreground hover:text-destructive transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
