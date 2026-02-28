import {create} from 'zustand';
import { MemoryType } from "@/models/Memory";

interface MemoriesState {
  memories: MemoryType[];
  addMemory: (memory: MemoryType) => void;
  removeMemory: (id: string) => void;
}

export const useMemoriesStore = create<MemoriesState>((set) => ({
  memories: [],
  addMemory: (memory) =>
    set((state) => ({memories: [...state.memories, memory]})),
  setMemories: (memories: MemoryType[]) =>
    set(() => ({memories})),
  removeMemory: (id) =>
    set((state) => ({
      memories: state.memories.filter((memory) => memory.id !== id),
    })),
}));