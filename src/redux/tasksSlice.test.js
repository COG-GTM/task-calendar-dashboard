import tasksReducer, { addTask, editTask, deleteTask, setTasks } from './tasksSlice';

describe('tasksSlice', () => {
  const initialState = [];

  test('should return the initial state', () => {
    expect(tasksReducer(undefined, { type: undefined })).toEqual([]);
  });

  test('should handle setTasks', () => {
    const tasks = [
      { id: '1', title: 'Task 1', category: 'success', date: '2025-09-04' },
      { id: '2', title: 'Task 2', category: 'warning', date: '2025-09-05' },
    ];
    
    const actual = tasksReducer(initialState, setTasks(tasks));
    expect(actual).toEqual(tasks);
  });

  test('should handle addTask', () => {
    const newTask = {
      title: 'New Task',
      description: 'New Description',
      category: 'success',
      date: '2025-09-04',
    };
    
    const actual = tasksReducer(initialState, addTask(newTask));
    
    expect(actual).toHaveLength(1);
    expect(actual[0]).toMatchObject(newTask);
    expect(actual[0].id).toBeDefined();
  });

  test('should handle editTask', () => {
    const existingTasks = [
      { id: '1', title: 'Original Task', category: 'success', date: '2025-09-04' },
    ];
    
    const updatedTask = {
      id: '1',
      title: 'Updated Task',
      category: 'warning',
      date: '2025-09-04',
    };
    
    const actual = tasksReducer(existingTasks, editTask(updatedTask));
    
    expect(actual).toHaveLength(1);
    expect(actual[0]).toEqual(updatedTask);
  });

  test('should handle deleteTask', () => {
    const existingTasks = [
      { id: '1', title: 'Task 1', category: 'success', date: '2025-09-04' },
      { id: '2', title: 'Task 2', category: 'warning', date: '2025-09-05' },
    ];
    
    const actual = tasksReducer(existingTasks, deleteTask('1'));
    
    expect(actual).toHaveLength(1);
    expect(actual[0].id).toBe('2');
  });

  test('should not modify state when editing non-existent task', () => {
    const existingTasks = [
      { id: '1', title: 'Task 1', category: 'success', date: '2025-09-04' },
    ];
    
    const updatedTask = {
      id: '999',
      title: 'Non-existent Task',
      category: 'warning',
      date: '2025-09-04',
    };
    
    const actual = tasksReducer(existingTasks, editTask(updatedTask));
    
    expect(actual).toEqual(existingTasks);
  });

  test('should not modify state when deleting non-existent task', () => {
    const existingTasks = [
      { id: '1', title: 'Task 1', category: 'success', date: '2025-09-04' },
    ];
    
    const actual = tasksReducer(existingTasks, deleteTask('999'));
    
    expect(actual).toEqual(existingTasks);
  });
});
