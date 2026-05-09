import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Trophy, Zap } from "lucide-react";
import { XP_PER_LEVEL } from "@/types";

interface StatsDisplayProps {
  hp: number;
  xp: number;
  level: number;
}

export function StatsDisplay({ hp, xp, level }: StatsDisplayProps) {
  const xpPercentage = (xp % XP_PER_LEVEL);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="border-red-100 bg-red-50/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Health Points</CardTitle>
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">{hp}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
          <Progress value={hp} className="h-2 bg-red-100" />
        </CardContent>
      </Card>

      <Card className="border-blue-100 bg-blue-50/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Experience</CardTitle>
          <Zap className="h-4 w-4 text-blue-500 fill-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">{xp}</span>
            <span className="text-xs text-muted-foreground">Total XP</span>
          </div>
          <Progress value={xpPercentage} className="h-2 bg-blue-100" />
        </CardContent>
      </Card>

      <Card className="border-yellow-100 bg-yellow-50/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Player Level</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-4xl font-bold">{level}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Master</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
