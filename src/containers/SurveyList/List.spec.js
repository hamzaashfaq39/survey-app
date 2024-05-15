import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SurveyList from '.';
import { Provider } from 'react-redux'; // Importing the Provider component
import { useSelector } from 'react-redux'; // Importing the hook
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

describe('SurveyList component', () => {
  // Mock function for setStep prop
  const mockSetStep = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with survey details', () => {
    const surveyData = [{
      title: 'Test Survey',
      description: 'This is a test survey.',
      questions: [
        {
          question: 'What is your favorite color?',
          options: ['red',"blue"],
        },
      ],
    }];

    // Mocking useSelector hook to return the survey data
    useSelector.mockReturnValue(surveyData);

    render(
      <Provider store={store}> {/* Provide a mock store */}
        <SurveyList visible onClose={() => {}} setStep={mockSetStep} />
      </Provider>
    );

    expect(screen.getByText(/Test Survey/i)).toBeInTheDocument(); // Use regular expression for matching

    fireEvent.click(screen.getByText(/Test Survey/i));


    expect(screen.getByText(/Description: This is a test survey\./i)).toBeInTheDocument(); // Use regular expression for matching
    expect(screen.getByText(/Questions:/i)).toBeInTheDocument(); // Use regular expression for matching
    expect(screen.getByText(/What is your favorite color\?/i)).toBeInTheDocument(); // Use regular expression for matching
    expect(screen.getByLabelText(/red/i)).toBeInTheDocument(); // Use regular expression for matching
  });

  test('renders "No data" message when survey data is not provided', () => {
    // Mocking useSelector hook to return an empty array (no data)
    useSelector.mockReturnValue([]);

    render(
      <Provider store={store}> {/* Provide a mock store */}
        <SurveyList visible onClose={() => {}} setStep={mockSetStep} />
      </Provider>
    );

    expect(screen.getByText(/No data/i)).toBeInTheDocument(); // Use regular expression for matching
  });

});
