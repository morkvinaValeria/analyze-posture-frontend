import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import Menu from '../common/menu';
import Stepper from '../common/stepper';
import UploadImages from '../upload';
import { StepContext, StepProvider } from '../../contexts/step';

import styles from './styles.module.scss';

const AnalyzePosture: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const stepContext = useContext(StepContext);
  const NUMBER_OF_STEPS = 5;

  const goToNextStep = (): void =>
    setCurrentStep((prev) => (prev === NUMBER_OF_STEPS - 1 ? prev : prev + 1));
  const goToPreviousStep = () =>
    setCurrentStep((prev) => (prev <= 0 ? prev : prev - 1));

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
            {currentStep === 0 ? <UploadImages></UploadImages> : <></>}
          </StepProvider>
          <section className={styles.stepperButtonsContainer}>
            <Button
              onClick={goToPreviousStep}
              className={styles.stepperButton}
              variant="success"
              disabled={currentStep === 0 ? true : false}
            >
              Back
            </Button>

            <Button
              onClick={goToNextStep}
              className={styles.stepperButton}
              variant="success"
              disabled={currentStep === NUMBER_OF_STEPS - 1 ? true : false}
            >
              Next
            </Button>
          </section>
        </div>
      </div>
    </>
  );
};

export default AnalyzePosture;
