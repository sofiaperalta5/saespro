import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page with welcome text', () => {
  render(<App />);
  const heading = screen.getByText(/Bienvenido/i);
  expect(heading).toBeInTheDocument();
});
