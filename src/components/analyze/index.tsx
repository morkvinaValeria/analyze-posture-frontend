import React from 'react';
import { StepProvider } from '../../contexts/step';
import Assessment from '../assessment';
import Menu from '../common/menu';
import Stepper from '../common/stepper';
import IdentifyPoints from '../identify-points';
import UploadImages from '../upload';
import ButtonSection from './button-section';

import styles from './styles.module.scss';

const AnalyzePosture: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const NUMBER_OF_STEPS = 3;

  const goToNextStep = (): void =>
    setCurrentStep((prev) => (prev === NUMBER_OF_STEPS - 1 ? prev : prev + 1));
  const goToPreviousStep = () =>
    setCurrentStep((prev) => (prev <= 0 ? prev : prev - 1));

  const renderSwitch = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return <UploadImages />;
      case 1:
        return <IdentifyPoints />;
      case 2:
        return <Assessment />;
      default:
        return <UploadImages />;
    }
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <Menu />
        <div className={styles.creteRecordBody}>
          <h4>
            <strong>Analyze your posture</strong>
          </h4>
          <Stepper currentStep={currentStep} numberOfSteps={NUMBER_OF_STEPS} />
          <br />
          <StepProvider>
            {renderSwitch(currentStep)}
            <ButtonSection
              currentStep={currentStep}
              numberOfSteps={NUMBER_OF_STEPS}
              onClickBack={goToPreviousStep}
              onClickNext={goToNextStep}
            />
          </StepProvider>
        </div>
      </div>
    </>
  );
};

export default AnalyzePosture;
