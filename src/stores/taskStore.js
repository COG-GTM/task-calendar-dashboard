import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      
      setTasks: (tasks) => set({ tasks }),
      
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { id: nanoid(), ...task }]
      })),
      
      editTask: (updatedTask) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === updatedTask.id 
            ? { ...task, ...updatedTask }
            : task
        )
      })),
      
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(task => String(task.id) !== String(taskId))
      })),
    }),
    {
      name: 'tasks',
      getStorage: () => localStorage,
    }
  )
);
