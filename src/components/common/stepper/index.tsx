import React from 'react';
import styles from './styles.module.scss';

type Props = {
  currentStep: number;
  numberOfSteps: number;
};

const Stepper: React.FC<Props> = ({ currentStep, numberOfSteps }: Props) => {
  const activeColor = (index: number) => (currentStep >= index ? 'Active' : '');
  const isFinalStep = (index: number) => index === numberOfSteps - 1;

  return (
    <div className={styles.stepperContainer}>
      {Array.from({ length: numberOfSteps }).map((_, index) => (
        <>
          <React.Fragment key={index}>
            <div className={styles[`step${activeColor(index)}`]} />
            {isFinalStep(index) ? null : (
              <div className={styles[`finalStep${activeColor(index)}`]} />
            )}
          </React.Fragment>
        </>
      ))}
    </div>
  );
};

export default Stepper;
