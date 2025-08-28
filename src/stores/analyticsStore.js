import { create } from 'zustand';

export const useAnalyticsStore = create((set, get) => ({
  tempFilter: "",
  appliedFilter: "",
  
  setTempFilter: (filter) => set({ tempFilter: filter }),
  
  applyFilter: () => set((state) => ({ 
    appliedFilter: state.tempFilter 
  })),
  
  resetFilter: () => set({ 
    tempFilter: "", 
    appliedFilter: "" 
  }),
  
  getChartData: (tasks, categories) => {
    return Object.keys(categories).map((cat) => ({
      name: cat,
      value: tasks.filter((t) => t.category === cat).length,
    }));
  },
  
  getFilteredTasks: (tasks, selectedDate, appliedFilter) => {
    return tasks.filter(
      (t) =>
        t.date === selectedDate.format("YYYY-MM-DD") &&
        (!appliedFilter || t.category === appliedFilter)
    );
  },
}));
