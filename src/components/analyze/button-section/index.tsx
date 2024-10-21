import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { StepContext } from '../../../contexts/step';

import styles from './styles.module.scss';

type Props = {
  currentStep: number;
  numberOfSteps: number;
  onClickBack: () => void;
  onClickNext: () => void;
};

const ButtonSection: React.FC<Props> = ({
  currentStep,
  numberOfSteps,
  onClickBack,
  onClickNext,
}: Props) => {
  const stepContext = useContext(StepContext);

  return (
    <>
      <section className={styles.stepperButtonsContainer}>
        <Button
          onClick={onClickBack}
          className={styles.stepperButton}
          variant="success"
          disabled={currentStep === 0 ? true : false}
        >
          Back
        </Button>

        <Button
          onClick={onClickNext}
          className={styles.stepperButton}
          variant="success"
          disabled={
            currentStep === numberOfSteps - 1 || !stepContext?.isNextValid
              ? true
              : false
          }
        >
          Next
        </Button>
      </section>
    </>
  );
};

export default ButtonSection;
