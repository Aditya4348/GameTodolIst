import { useState, useEffect } from "react";
import { Difficulty, Task, Profile, XP_REWARDS, XP_PER_LEVEL, HP_PENALTY } from "@/types";
import { StatsDisplay } from "@/components/StatsDisplay";
import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { Sword, Loader2, Play } from "lucide-react";
import { isPast } from "date-fns";

const STORAGE_KEYS = {
  TASKS: "questlist_tasks",
  PROFILE: "questlist_profile",
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<Profile>({
    id: "local-user",
    xp: 0,
    hp: 100,
    level: 1,
    updated_at: new Date().toISOString(),
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks) as Task[];
      setTasks(parsedTasks);
      
      const currentHP = savedProfile ? JSON.parse(savedProfile).hp : 100;
      checkExpiredTasks(parsedTasks, currentHP);
    }

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    }
  }, [tasks, initialized]);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    }
  }, [profile, initialized]);

  const checkExpiredTasks = (currentTasks: Task[], currentHP: number) => {
    const expiredTasks = currentTasks.filter(
      (t) => t.deadline && isPast(new Date(t.deadline)) && !t.is_completed
    );

    if (expiredTasks.length > 0) {
      const damage = expiredTasks.length * HP_PENALTY;
      const newHP = Math.max(0, currentHP - damage);
      
      if (newHP !== currentHP) {
        setProfile(prev => ({ ...prev, hp: newHP }));
        toast.error(`You took ${damage} damage from ${expiredTasks.length} expired quests!`, {
          description: "Don't let your tasks expire warrior!",
        });
      }
    }
  };

  const updateStatsAfterCompletion = (difficulty: Difficulty) => {
    const reward = XP_REWARDS[difficulty];
    let newXp = profile.xp + reward;
    let newLevel = profile.level;

    if (newXp >= XP_PER_LEVEL) {
      newLevel += Math.floor(newXp / XP_PER_LEVEL);
      newXp = newXp % XP_PER_LEVEL;
      toast.success("LEVEL UP!", {
        description: `You are now level ${newLevel}!`,
      });
    }

    setProfile(prev => ({
      ...prev,
      xp: newXp,
      level: newLevel,
      updated_at: new Date().toISOString()
    }));
  };

  const handleAddTask = (title: string, difficulty: Difficulty, deadline: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      user_id: "local-user",
      title,
      difficulty,
      deadline: deadline || "",
      is_completed: false,
      created_at: new Date().toISOString(),
    };

    setTasks(prev => [newTask, ...prev]);
    toast.info("New Quest Started", { description: `${title} (${difficulty})` });
  };

  const handleToggleTask = (id: string, completed: boolean, difficulty: string) => {
    setTasks(prev => prev.map((t) => (t.id === id ? { ...t, is_completed: completed } : t)));

    if (completed) {
      updateStatsAfterCompletion(difficulty as Difficulty);
      toast.success(`Quest Completed!`, {
        description: `Earned XP for ${difficulty} task.`,
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter((t) => t.id !== id));
    toast.info("Quest abandoned");
  };

  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20 font-sans selection:bg-primary/20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Sword className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">QuestList</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">LVL {profile.level}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        <StatsDisplay hp={profile.hp} xp={profile.xp} level={profile.level} />
        
        <div className="mb-8 bg-blue-500 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Current Active Quests</p>
            <h2 className="text-3xl font-bold mb-4">{tasks.filter(t => !t.is_completed).length} Quests Remaining</h2>
            <div className="flex gap-2">
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                {tasks.filter(t => t.difficulty === 'Hard' && !t.is_completed).length} High Threat
              </div>
            </div>
          </div>
          <Play className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10 group-hover:scale-110 transition-transform duration-700 rotate-12" />
        </div>

        <TaskForm onAddTask={handleAddTask} />

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Quests</h3>
            <span className="text-xs text-muted-foreground">{tasks.length} Total</span>
          </div>
          
          <div className="relative">
            <AnimatePresence mode="popLayout" initial={false}>
              {tasks.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white rounded-3xl border border-dashed border-muted"
                >
                  <p className="text-muted-foreground italic">No active quests. Time to start your adventure!</p>
                </motion.div>
              ) : (
                tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
