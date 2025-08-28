import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isModalOpen: false,
  isEditing: false,
  editId: null,
  formData: {},
  
  openAddModal: (date) => set({
    formData: {
      title: "",
      description: "",
      category: "",
      date: date ? date.format("YYYY-MM-DD") : "",
    },
    isEditing: false,
    isModalOpen: true,
  }),
  
  openEditModal: (task) => set({
    formData: task,
    editId: task.id,
    isEditing: true,
    isModalOpen: true,
  }),
  
  closeModal: () => set({
    isModalOpen: false,
    isEditing: false,
    editId: null,
    formData: {},
  }),
  
  setFormData: (data) => set({ formData: data }),
}));
