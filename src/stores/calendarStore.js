import { create } from 'zustand';
import dayjs from 'dayjs';

export const useCalendarStore = create((set) => ({
  selectedDate: dayjs(),
  viewMode: 'month',
  visibleRange: null,
  
  setSelectedDate: (date) => set({ selectedDate: date }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setVisibleRange: (range) => set({ visibleRange: range }),
}));
