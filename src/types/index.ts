export interface User {
  id: string;
  username: string;
  email: string;
  isInstructor: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  questions: Question[];
}

export interface GameState {
  currentQuestion: number;
  players: {
    id: string;
    username: string;
    score: number;
  }[];
  isActive: boolean;
  timeRemaining: number;
}