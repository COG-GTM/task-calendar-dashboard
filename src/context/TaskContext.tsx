import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import {v4 as uuidv4} from 'uuid';
import type {Category, Priority, Task} from '../types/Task';
import {loadTasks, saveTasks} from '../utils/storage';

// ── Action types ──────────────────────────────────────────────

type Action =
  | {type: 'SET_TASKS'; payload: Task[]}
  | {type: 'ADD_TASK'; payload: Task}
  | {type: 'UPDATE_TASK'; payload: Task}
  | {type: 'DELETE_TASK'; payload: string}
  | {type: 'TOGGLE_TASK'; payload: string};

// ── Reducer ───────────────────────────────────────────────────

function taskReducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'SET_TASKS':
      return action.payload;
    case 'ADD_TASK':
      return [action.payload, ...state];
    case 'UPDATE_TASK':
      return state.map(t => (t.id === action.payload.id ? action.payload : t));
    case 'DELETE_TASK':
      return state.filter(t => t.id !== action.payload);
    case 'TOGGLE_TASK':
      return state.map(t =>
        t.id === action.payload ? {...t, completed: !t.completed} : t,
      );
    default:
      return state;
  }
}

// ── Context value type ────────────────────────────────────────

interface TaskContextValue {
  tasks: Task[];
  addTask: (input: {
    title: string;
    description: string;
    priority: Priority;
    category: Category;
    dueDate: string | null;
  }) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────

export function TaskProvider({children}: {children: React.ReactNode}) {
  const [tasks, dispatch] = useReducer(taskReducer, []);

  // Load persisted tasks on mount
  useEffect(() => {
    loadTasks().then(loaded => {
      dispatch({type: 'SET_TASKS', payload: loaded});
    });
  }, []);

  // Persist every time tasks change (skip the initial empty array)
  const isInitialMount = React.useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback(
    (input: {
      title: string;
      description: string;
      priority: Priority;
      category: Category;
      dueDate: string | null;
    }) => {
      const newTask: Task = {
        id: uuidv4(),
        title: input.title,
        description: input.description,
        completed: false,
        priority: input.priority,
        category: input.category,
        createdAt: new Date().toISOString(),
        dueDate: input.dueDate,
      };
      dispatch({type: 'ADD_TASK', payload: newTask});
    },
    [],
  );

  const updateTask = useCallback((task: Task) => {
    dispatch({type: 'UPDATE_TASK', payload: task});
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({type: 'DELETE_TASK', payload: id});
  }, []);

  const toggleTask = useCallback((id: string) => {
    dispatch({type: 'TOGGLE_TASK', payload: id});
  }, []);

  const value = useMemo(
    () => ({tasks, addTask, updateTask, deleteTask, toggleTask}),
    [tasks, addTask, updateTask, deleteTask, toggleTask],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return ctx;
}
