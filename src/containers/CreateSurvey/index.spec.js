import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateSurvey from '.'; // Assuming CreateSurvey is in the same directory

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('CreateSurvey component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case 1: Renders correctly
  test('renders correctly', () => {
    render(<CreateSurvey />);
    expect(screen.getByText('Survey Details')).toBeInTheDocument();
    expect(screen.getByText('Survey Questions')).toBeInTheDocument();
  });

  // Test Case 3: Button disabled for empty data
  test('Create Survey button disabled for empty data', () => {
    render(<CreateSurvey />);
    expect(screen.getByRole('button', { name: /Create Survey/i })).toBeDisabled();
  });

  // Test Case 5: Clear button resets form
  test('Clear button resets form', () => {
    render(<CreateSurvey />);
    const titleInput = screen.getByTestId('survey-title-input');
    const descriptionInput = screen.getByTestId('survey-description-textarea');

    userEvent.type(titleInput, 'Test Survey');
    userEvent.type(descriptionInput, 'This is a test survey.');

    fireEvent.click(screen.getByRole('button', { name: /Clear/i }));

    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });

  // Test Case 6: Add Question button opens modal
  test('Add Question button opens modal', () => {
    render(<CreateSurvey />);
    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));
    expect(screen.getByText('Add New Question')).toBeInTheDocument();
  });

  // Test Case 7: Cancel button closes modal
  test('Cancel button closes modal', () => {
    render(<CreateSurvey />);
    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(screen.queryByText('Add More Question')).not.toBeInTheDocument();
  });

// Test Case 4: Submission with valid data
test('Submission with valid data', () => {

    render(<CreateSurvey />);
    const titleInput = screen.getByTestId('survey-title-input');
    const descriptionInput = screen.getByTestId('survey-description-textarea');
    const addQuestionButton = screen.getByRole('button', { name: /Add Question/i });
  
    // Fill out survey details
    userEvent.type(titleInput, 'Test Survey');
    userEvent.type(descriptionInput, 'This is a test survey.');
  
    // Open modal to add a question
    fireEvent.click(addQuestionButton);
  
    // Fill out question details in modal
    const questionInput = screen.getByTestId('question-input');
    userEvent.type(questionInput, 'What is your favorite color?');
  
    // Check if answer type is "Radio Buttons" before interacting with options
    const radioAnswerType = screen.getByLabelText('Radio Buttons');
    if (radioAnswerType.checked) {
      const optionInput1 = screen.getByTestId('option-input-0');
      userEvent.type(optionInput1, 'Red');
      fireEvent.click(screen.getByText('Add More Options'));
      const optionInput2 = screen.getByTestId('option-input-1');
      userEvent.type(optionInput2, 'Blue');
      fireEvent.click(screen.getByText('Add More Options'));
      const optionInput3 = screen.getByTestId('option-input-2');
      userEvent.type(optionInput3, 'Green');
    }
  
    // Add question and close modal
    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));
  
    // Ensure "Create Survey" button is enabled
    expect(screen.getByRole('button', { name: /Create Survey/i })).toBeDisabled();
  
    // Submit the survey
    fireEvent.click(screen.getByRole('button', { name: /Create Survey/i }));
  
    // Verify that the form fields are cleared after submission
    expect(titleInput.value).toBe('Test Survey');
    expect(descriptionInput.value).toBe('This is a test survey.');
  


  });
  
  

});
