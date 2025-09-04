import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './redux/tasksSlice';
import App from './App';

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

describe('Task Calendar Dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders task calendar dashboard title', () => {
    renderWithProvider(<App />);
    const titleElement = screen.getByText(/Task Calendar Dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders add task button', () => {
    renderWithProvider(<App />);
    const addButton = screen.getByText(/Add Task/i);
    expect(addButton).toBeInTheDocument();
  });

  test('renders calendar component', () => {
    renderWithProvider(<App />);
    const calendar = document.querySelector('.ant-picker-calendar');
    expect(calendar).toBeInTheDocument();
  });

  test('renders task categories chart', () => {
    renderWithProvider(<App />);
    const chartTitle = screen.getByText(/Task Categories Chart/i);
    expect(chartTitle).toBeInTheDocument();
  });

  test('opens add task modal when add button is clicked', async () => {
    renderWithProvider(<App />);
    const addButton = screen.getByText(/Add Task/i);
    
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Add Task/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter title/i)).toBeInTheDocument();
    });
  });

  test('displays empty state when no tasks exist', () => {
    renderWithProvider(<App />);
    const emptyState = screen.getByText(/No tasks/i);
    expect(emptyState).toBeInTheDocument();
  });

  test('loads tasks from localStorage on mount', () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        category: 'success',
        date: '2025-09-04',
      },
    ];
    localStorage.setItem('tasks', JSON.stringify(mockTasks));

    const { store } = renderWithProvider(<App />);
    
    expect(store.getState().tasks).toEqual(mockTasks);
  });

  test('filters tasks by category', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Success Task',
        category: 'success',
        date: '2025-09-04',
      },
      {
        id: '2',
        title: 'Warning Task',
        category: 'warning',
        date: '2025-09-04',
      },
    ];

    renderWithProvider(<App />, { initialState: { tasks: mockTasks } });
    
    const categorySelect = document.querySelector('.ant-select-selector');
    fireEvent.mouseDown(categorySelect);
    
    await waitFor(() => {
      const successOption = screen.getByText('success');
      fireEvent.click(successOption);
    });
    
    const applyButton = screen.getByText(/Apply/i);
    fireEvent.click(applyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Success Task')).toBeInTheDocument();
      expect(screen.queryByText('Warning Task')).not.toBeInTheDocument();
    });
  });

  test('resets filter when reset button is clicked', async () => {
    renderWithProvider(<App />);
    
    const resetButton = screen.getByText(/Reset/i);
    fireEvent.click(resetButton);
    
    const categorySelect = document.querySelector('.ant-select-selection-search-input');
    expect(categorySelect).toHaveValue('');
  });
});
