// surveySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  surveys: [{
    title: 'Test Survey',
    description: 'This is a test survey.',
    questions: [
      {
        question: 'What is your favorite color?',
        options: ['Text field to answer the question'],
      },
    ],
  }],
  response: [],
};

export const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    addSurvey: (state, action) => {
      state.surveys=action.payload;
    },
    submitSurvey: (state, action) => {
      state.response.push(action.payload);
    },
  },
});

export const { addSurvey, submitSurvey } = surveySlice.actions;

export default surveySlice.reducer;
