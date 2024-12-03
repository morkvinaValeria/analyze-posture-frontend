import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { StepContext } from '../../../contexts/step';

import styles from './styles.module.scss';
import { AppRoute } from '../../../common/enums';
import Link from '../../common/link';

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
        {currentStep === numberOfSteps - 1 ? (
          <Link to={AppRoute.ROOT}>
            <Button
              className={styles.stepperButton}
              variant="success"
              disabled={!stepContext?.isNextValid ? true : false}
            >
              Finish
            </Button>
          </Link>
        ) : (
          <Button
            onClick={onClickNext}
            className={styles.stepperButton}
            variant="success"
            disabled={!stepContext?.isNextValid ? true : false}
          >
            Next
          </Button>
        )}
      </section>
    </>
  );
};

export default ButtonSection;
