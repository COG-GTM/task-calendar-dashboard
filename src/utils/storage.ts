import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Task} from '../types/Task';

const TASKS_KEY = '@TaskManager:tasks';

export async function loadTasks(): Promise<Task[]> {
  try {
    const json = await AsyncStorage.getItem(TASKS_KEY);
    if (json !== null) {
      return JSON.parse(json) as Task[];
    }
    return [];
  } catch {
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {
    // Silently fail – the next save will retry
  }
}
