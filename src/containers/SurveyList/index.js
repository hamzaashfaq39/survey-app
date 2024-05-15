import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, List, Modal, Button, message, Input, Radio } from "antd";
import { submitSurvey } from "../../store/slices/survey-slice";

// Component for displaying a list of surveys
const SurveyList = ({ setStep }) => {
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const surveys = useSelector((state) => state.survey.surveys);

  // Function to handle click on a survey item
  const handleSurveyClick = (survey) => {
    setSelectedSurvey(survey);
  };

  return (
    <>
      {/* Card component to contain the survey list */}
      <Card title="Survey List">
        <List
          dataSource={surveys}
          renderItem={(survey, index) => (
            <List.Item
              data-testid={`survey-item`} // Specify test ID here
              onClick={() => handleSurveyClick(survey)}
              style={{
                cursor: "pointer",
                backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#ffffff",
                padding: "8px",
              }}
            >
              <div>
                <h3>
                  {index + 1}. {survey.title}
                </h3>
              </div>
            </List.Item>
          )}
        />
      </Card>
      {/* Modal component to display survey questions */}
      <SurveyQuestionsModal
        survey={selectedSurvey}
        visible={selectedSurvey !== null}
        onClose={() => setSelectedSurvey(null)}
        setStep={setStep}
      />
    </>
  );
};

// Modal component for displaying survey questions and collecting responses
const SurveyQuestionsModal = ({ survey, visible, onClose, setStep }) => {
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(false);

  // If no survey is selected, return null to render nothing
  if (!survey) {
    return null;
  }

  // Function to handle change in answer for a question
  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: value,
    }));
  };

  // Function to handle submission of survey responses
  const handleSubmit = () => {
    // Check if all questions are answered
    const allQuestionsAnswered = survey.questions.every(
      (question, questionIndex) =>
        question.options.length === 1 &&
        question.options[0] === "Text field to answer the question"
          ? answers[questionIndex] !== undefined
          : answers[questionIndex] !== undefined
    );

    // If any question is not answered, show error message and return
    if (!allQuestionsAnswered) {
      setError(true);
      message.error("Please answer all questions.");
      return;
    }

    // Prepare responses for submission
    const responses = survey.questions.map((question, questionIndex) => {
      if (
        question.options.length === 1 &&
        question.options[0] === "Text field to answer the question"
      ) {
        return { question: question.question, answer: answers[questionIndex] };
      } else {
        const answerIndex = answers[questionIndex];
        const answer =
          answerIndex !== undefined
            ? question.options[answerIndex]
            : "Not selected";
        return { question: question.question, answer };
      }
    });

    // Dispatch action to submit survey responses
    dispatch(
      submitSurvey({
        title: survey.title,
        dateTime: new Date().toISOString(),
        responses,
      })
    );
    // Show success message, close modal, and proceed to next step
    message.success("Response successfully submitted");
    onClose();
    setStep(2);
  };

  return (
    <Modal
      title={survey.title}
      visible={visible}
      onCancel={() => {
        onClose();
        setError(false);
      }}
      footer={[
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <h3>Description: {survey.description}</h3>
      <h4>Questions:</h4>
      {/* Display each survey question with input options */}
      {survey.questions.map((question, questionIndex) => (
        <div key={questionIndex} style={{ marginBottom: "20px" }}>
          <h5 data-testid={`question-${questionIndex + 1}`}>
            {questionIndex + 1}. {question.question}
          </h5>
          {/* Render text input for questions with only text field as an option,
          otherwise render radio buttons for options */}
          {question.options.length === 1 &&
          question.options[0] === "Text field to answer the question" ? (
            <Input
              placeholder="Type your answer here..."
              onChange={(e) =>
                handleAnswerChange(questionIndex, e.target.value)
              }
              data-testid={`question-input-${questionIndex + 1}`}
            />
          ) : (
            question.options.map((option, optionIndex) => (
              <Radio
                key={optionIndex}
                onChange={() => handleAnswerChange(questionIndex, optionIndex)}
                checked={answers[questionIndex] === optionIndex}
              >
                {option}
              </Radio>
            ))
          )}
        </div>
      ))}
      {/* Display error message if any */}
      {error && <p style={{ color: "red" }}>Please answer all questions.</p>}
    </Modal>
  );
};

export default SurveyList;
