

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For better assertion messages
import App from './App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
  });

  test('renders CreateSurvey component', () => {
    render(<App />);
    expect(screen.getByText('Survey Details')).toBeInTheDocument();
    expect(screen.getByText('Survey Questions')).toBeInTheDocument();
  });

  // You can add more tests for other behaviors of the App component if needed
});
