import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task calendar dashboard', () => {
  render(<App />);
  const titleElement = screen.getByText(/Task Calendar Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});
