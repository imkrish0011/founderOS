import { create } from 'zustand';

export type TopicStatus = 'locked' | 'active' | 'completed';

export interface LearningTopic {
  id: string;
  title: string;
  status: TopicStatus;
  currentTopic?: string;
}

interface LearningState {
  topics: LearningTopic[];
  addTopic: (topic: Omit<LearningTopic, 'id'>) => void;
  updateTopic: (id: string, updates: Partial<Omit<LearningTopic, 'id'>>) => void;
  deleteTopic: (id: string) => void;
  toggleStatus: (id: string) => void;
}

export const useLearning = create<LearningState>((set) => ({
  topics: [],
  addTopic: (topic) => set((state) => ({
    topics: [...state.topics, { ...topic, id: crypto.randomUUID() }]
  })),
  updateTopic: (id, updates) => set((state) => ({
    topics: state.topics.map((t) => (t.id === id ? { ...t, ...updates } : t))
  })),
  deleteTopic: (id) => set((state) => ({
    topics: state.topics.filter((t) => t.id !== id)
  })),
  toggleStatus: (id) => set((state) => ({
    topics: state.topics.map((t) => {
      if (t.id === id) {
        let newStatus: TopicStatus = 'locked';
        if (t.status === 'locked') newStatus = 'active';
        else if (t.status === 'active') newStatus = 'completed';
        else newStatus = 'locked';
        return { ...t, status: newStatus };
      }
      return t;
    })
  })),
}));
