// style.js
import styled from 'styled-components';
import { Card } from 'antd';

const HomeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledCard = styled(Card)`
  width: 80%;
  max-width: 600px;
  height: 80%;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export { HomeWrapper, StyledCard };
