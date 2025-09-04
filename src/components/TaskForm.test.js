import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../redux/tasksSlice';
import App from '../App';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      tasks: tasksReducer,
    },
    preloadedState: {
      tasks: [],
      ...initialState,
    },
  });
};

const renderWithProvider = (component, { initialState = {} } = {}) => {
  const store = createTestStore(initialState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('Task Form', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('validates required fields', async () => {
    renderWithProvider(<App />);
    
    const addButton = screen.getByText(/Add Task/i);
    fireEvent.click(addButton);
    
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /Add Task/i });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Category is required/i)).toBeInTheDocument();
    });
  });

  test('adds new task successfully', async () => {
    const { store } = renderWithProvider(<App />);
    
    const addButton = screen.getByText(/Add Task/i);
    fireEvent.click(addButton);
    
    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText(/Enter title/i);
      const descriptionInput = screen.getByPlaceholderText(/Enter description/i);
      
      fireEvent.change(titleInput, { target: { value: 'New Test Task' } });
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    });
    
    const categorySelect = document.querySelector('.ant-select-selector');
    fireEvent.mouseDown(categorySelect);
    
    await waitFor(() => {
      const successOption = screen.getByText('success');
      fireEvent.click(successOption);
    });
    
    const submitButton = screen.getByRole('button', { name: /Add Task/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const tasks = store.getState().tasks;
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('New Test Task');
      expect(tasks[0].description).toBe('Test Description');
      expect(tasks[0].category).toBe('success');
    });
  });

  test('edits existing task', async () => {
    const today = new Date().toISOString().split('T')[0];
    const mockTask = {
      id: '1',
      title: 'Original Task',
      description: 'Original Description',
      category: 'success',
      date: today,
    };

    const { store } = renderWithProvider(<App />, { 
      initialState: { tasks: [mockTask] } 
    });
    
    await waitFor(() => {
      expect(screen.getByText('Original Task')).toBeInTheDocument();
    });
    
    const editButton = screen.getByRole('button', { name: /Edit/i });
    fireEvent.click(editButton);
    
    await waitFor(() => {
      const titleInput = screen.getByDisplayValue('Original Task');
      fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
    });
    
    const updateButton = screen.getByRole('button', { name: /Update Task/i });
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      const tasks = store.getState().tasks;
      expect(tasks[0].title).toBe('Updated Task');
    });
  });

  test('deletes task', async () => {
    const today = new Date().toISOString().split('T')[0];
    const mockTask = {
      id: '1',
      title: 'Task to Delete',
      description: 'Will be deleted',
      category: 'success',
      date: today,
    };

    const { store } = renderWithProvider(<App />, { 
      initialState: { tasks: [mockTask] } 
    });
    
    await waitFor(() => {
      expect(screen.getByText('Task to Delete')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      const tasks = store.getState().tasks;
      expect(tasks).toHaveLength(0);
    });
  });
});
