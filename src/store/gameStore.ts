import { create } from 'zustand';
import { GameState } from '../types';

interface GameStore extends GameState {
  startGame: (players: string[]) => void;
  nextQuestion: () => void;
  submitAnswer: (playerId: string, answer: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  currentQuestion: 0,
  players: [],
  isActive: false,
  timeRemaining: 0,

  startGame: (playerNames) => set({
    isActive: true,
    currentQuestion: 0,
    players: playerNames.map((name) => ({
      id: Math.random().toString(36).substr(2, 9),
      username: name,
      score: 0
    })),
    timeRemaining: 20
  }),

  nextQuestion: () => set((state) => ({
    currentQuestion: state.currentQuestion + 1,
    timeRemaining: 20
  })),

  submitAnswer: (playerId, answer) => set((state) => ({
    players: state.players.map((player) => 
      player.id === playerId
        ? { ...player, score: player.score + (answer === 2 ? 100 : 0) }
        : player
    )
  })),

  resetGame: () => set({
    currentQuestion: 0,
    players: [],
    isActive: false,
    timeRemaining: 0
  })
}));