import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryScreen from '.';
import { Provider, useSelector } from 'react-redux';
import store from '../../store/store';

// Mocking the useSelector hook
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'), // Use actual implementation for other hooks
  useSelector: jest.fn(),
}));

global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

describe('HistoryScreen component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with survey details', () => {
    // Mock survey data
    const mockSurveys = [
        {
            title: "testing",
            dateTime: "2024-05-09T18:12:44.756Z",
            responses: [
                {
                    question: 'What is your favorite color?',
                    answer: "blue"
                }
            ]
        }
    ];

    // Mocking useSelector hook to return the survey data
    useSelector.mockReturnValue(mockSurveys);

    render(
      <Provider store={store}>
        <HistoryScreen />
      </Provider>
    );

    expect(screen.getByText(/testing/i)).toBeInTheDocument(); // Use regular expression for matching
    expect(screen.getByText(/2024 May 09/i)).toBeInTheDocument(); // Use regular expression for matching

    // Click on view responses button
    fireEvent.click(screen.getByText(/View Responses/i));

    // Assert that modal is displayed
    expect(screen.getByText(/Survey Responses/i)).toBeInTheDocument(); // Use regular expression for matching
    expect(screen.getByText(/What is your favorite color?/i)).toBeInTheDocument(); // Use regular expression for matching
    expect(screen.getByText(/blue/i)).toBeInTheDocument(); // Use regular expression for matching
  });

  test('renders "No surveys available" message when survey data is not provided', () => {
    // Mocking useSelector hook to return an empty array (no data)
    useSelector.mockReturnValue([]);

    render(
      <Provider store={store}>
        <HistoryScreen />
      </Provider>
    );

    expect(screen.getByText(/No surveys available/i)).toBeInTheDocument(); // Use regular expression for matching
  });


});
