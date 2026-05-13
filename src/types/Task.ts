export type Priority = 'low' | 'medium' | 'high';

export type Category = 'personal' | 'work' | 'shopping' | 'health' | 'other';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: string;
  dueDate: string | null;
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: '#4CAF50',
  medium: '#FF9800',
  high: '#F44336',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  personal: '\u{1F464}',
  work: '\u{1F4BC}',
  shopping: '\u{1F6D2}',
  health: '\u{2764}',
  other: '\u{1F4CC}',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  personal: '#7C4DFF',
  work: '#2196F3',
  shopping: '#FF6D00',
  health: '#E91E63',
  other: '#607D8B',
};
