export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Profile {
  id: string;
  xp: number;
  hp: number;
  level: number;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  difficulty: Difficulty;
  deadline: string;
  is_completed: boolean;
  created_at: string;
}

export const XP_REWARDS: Record<Difficulty, number> = {
  Easy: 10,
  Medium: 25,
  Hard: 50,
};

export const XP_PER_LEVEL = 100;
export const HP_PENALTY = 15;
