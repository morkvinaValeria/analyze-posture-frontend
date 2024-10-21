import React, { useContext } from 'react';
import { StepContext } from '../../contexts/step';

const IdentifyPoints: React.FC = () => {
  const stepContext = useContext(StepContext);
  console.log(stepContext?.fileList[0].preview);
  return (
    <>
      <h5>Change positions of dots if needed</h5>
      <br />
      {/* <p>{stepContext?.fileList}</p> */}
      <img src={stepContext?.fileList[0].preview} alt="posture points"></img>
    </>
  );
};

export default IdentifyPoints;
