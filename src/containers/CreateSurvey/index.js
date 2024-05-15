import React, { useState } from "react";
import { Card, Input, Button, List, Modal, message, Radio } from "antd";
import { useDispatch } from "react-redux";
import { addSurvey } from "../../store/slices/survey-slice";

const { TextArea } = Input;

const CreateSurvey = ({setStep}) => {
  const dispatch = useDispatch();
  const [surveyData, setSurveyData] = useState({
    title: "",
    description: "",
    questions: [],
  });
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [answerType, setAnswerType] = useState("text");

  // Function to add more options for a multiple choice question
  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions((prevOptions) => [...prevOptions, ""]);
    }
  };

  // Function to add a new question to the survey
  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      message.error("Please add a question.");
      return;
    }
  
    let newQuestionObject;
  
    // Create question object based on answer type
    if (answerType === "text") {
      newQuestionObject = {
        question: newQuestion,
        options: ["Text field to answer the question"], // For text fields, add an empty string to options
        answerType: answerType
      };
    } else if (answerType === "radio") {
      newQuestionObject = {
        question: newQuestion,
        options: options.filter((option) => option.trim() !== ""),
        answerType: answerType
      };
    }
  
    // If editing existing question, update the question at the specified index
    if (editIndex !== null) {
      const updatedQuestions = [...surveyData.questions];
      updatedQuestions[editIndex] = newQuestionObject;
      setSurveyData((prevData) => ({
        ...prevData,
        questions: updatedQuestions,
      }));
    } else {
      // Otherwise, add new question
      setSurveyData((prevData) => ({
        ...prevData,
        questions: [...prevData.questions, newQuestionObject],
      }));
    }
  
    // Reset state for next question
    setNewQuestion("");
    setOptions([""]);
    setModalVisible(false);
    setEditIndex(null);
    setAnswerType("text");
  };

  // Function to handle editing a question
  const handleEditQuestion = (index) => {
    const questionToEdit = surveyData.questions[index];
    setNewQuestion(questionToEdit.question);
    setOptions(questionToEdit.options);
    setAnswerType(questionToEdit.answerType);
    setEditIndex(index);
    setModalVisible(true);
  };

  // Function to handle form submission
  const handleSubmit = () => {
    if (!surveyData.title.trim() || !surveyData.description.trim() || surveyData.questions.length === 0) {
      message.error("Please fill in all required fields and add at least one question.");
      return;
    }
    dispatch(addSurvey([surveyData]));
    message.success("Survey created successfully!");
    // Clear the form fields after successful submission
    handleClearForm();
    setStep(1)
  };

  // Function to clear form fields
  const handleClearForm = () => {
    setSurveyData({
      title: "",
      description: "",
      questions: [],
    });
    setNewQuestion("");
    setOptions([""]);
    setModalVisible(false);
    setEditIndex(null);
    setAnswerType("text");
  };

  // Determine if submit button should be disabled
  const isSubmitDisabled = !surveyData.title.trim() || !surveyData.description.trim() || surveyData.questions.length === 0;

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, marginRight: "20px" }}>
        <Card title="Survey Details">
          <Input
            placeholder="Survey Title"
            value={surveyData.title}
            onChange={(e) =>
              setSurveyData({ ...surveyData, title: e.target.value })
            }
            style={{ marginBottom: "10px" }}
            data-testid="survey-title-input"
          />
          <TextArea
            placeholder="Survey Description"
            value={surveyData.description}
            onChange={(e) =>
              setSurveyData({ ...surveyData, description: e.target.value })
            }
            autoSize={{ minRows: 3, maxRows: 5 }}
            style={{ marginBottom: "10px" }}
            data-testid="survey-description-textarea"
          />
          <Button onClick={handleSubmit} type="primary" style={{ marginRight: "10px" }} data-testid="create-survey-button" disabled={isSubmitDisabled}>Create Survey</Button>
          <Button onClick={handleClearForm} data-testid="clear-button">Clear</Button>
        </Card>
      </div>
      <div style={{ flex: 1, maxHeight: "80vh", overflowY: "auto" }}>
        <Card title="Survey Questions">
          {surveyData.questions.length === 0 ? (
            <p>No questions added yet.</p>
          ) : (
            <List
              dataSource={surveyData.questions}
              renderItem={(item, index) => (
                <List.Item>
                  <div>
                    <p>
                      <strong>Q{index + 1}:</strong> {item.question}
                    </p>
                    {/* Render options for radio type questions */}
                    {item.answerType === "radio" && (
                      <ul>
                        {item.options.map((option, optionIndex) => (
                          <li key={optionIndex}>{option}</li>
                        ))}
                      </ul>
                    )}
                    {/* Render answer for text type questions */}
                    {item.answerType === "text" && (
                      <p>
                        {item?.options?.[0]}
                      </p>
                    )}
                    <Button onClick={() => handleEditQuestion(index)}>Edit</Button>
                  </div>
                </List.Item>
              )}
            />
          )}
          <Button onClick={() => setModalVisible(true)}>Add Question</Button>
        </Card>
      </div>
      {/* Modal for adding/editing questions */}
      <Modal
        title={editIndex !== null ? "Edit Question" : "Add New Question"}
        visible={modalVisible}
        onOk={handleAddQuestion}
        onCancel={() => {
          setModalVisible(false);
          setNewQuestion("");
          setOptions([""]);
          setEditIndex(null);
          setAnswerType("text");
        }}
      >
        <Input
          placeholder="Question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          style={{ marginBottom: "10px" }}
          data-testid="question-input"
        />
        {/* Radio group to select answer type */}
        <Radio.Group onChange={(e) => setAnswerType(e.target.value)} value={answerType} style={{ marginBottom: "10px" }}>
          <Radio value="text" >Text Field</Radio>
          <Radio value="radio">Radio Buttons</Radio>
        </Radio.Group>
        {/* Input fields for options of radio type questions */}
        {answerType === "radio" && (
          <>
            {options.map((option, index) => (
              <Input
                key={index}
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...options];
                  updatedOptions[index] = e.target.value;
                  setOptions(updatedOptions);
                }}
                style={{ marginBottom: "10px" }}
                data-testid={`option-input-${index}`}
              />
            ))}
            {/* Button to add more options */}
            <Button onClick={handleAddOption} disabled={options.length === 4} data-testid={`options-more-button`}>
              Add More Options
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default CreateSurvey;
