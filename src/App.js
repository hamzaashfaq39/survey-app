import { ConfigProvider } from 'antd';
import './App.css';
import CreateSurvey from './containers/CreateSurvey';
import { Provider } from 'react-redux';
import store from './store/store';
import SurveyList from './containers/SurveyList';
import { useState } from 'react';
import HistoryScreen from './containers/History';

function App() {
  const [step, setStep] = useState(0);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <CreateSurvey setStep={setStep} />;
      case 1:
        return <SurveyList setStep={setStep} />;
      case 2:
        return <HistoryScreen />;
      default:
        return null;
    }
  };

  return (
    <Provider store={store}>
      <ConfigProvider direction="ltr">
        {renderStep()}
      </ConfigProvider>
    </Provider>
  );
}

export default App;
