/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  IFullPosturePrediction,
  ISidePosturePrediction,
} from '../../../common/interfaces';
import shrimpImage from '../../../assets/img/shrimp.png';

import styles from './styles.module.scss';

type Props = {
  predictedResult: IFullPosturePrediction | ISidePosturePrediction;
};
type PostureType = {
  class: string;
  probability: number;
  description: string;
  actions: string[];
};

const Prediction: React.FC<Props> = ({ predictedResult }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [postureTypes, setPostureTypes] = useState<PostureType[]>([]);

  useEffect(() => {
    if (predictedResult && Object.keys(predictedResult).length !== 0) {
      const splittedMessage: string[] = predictedResult.message.split('\n');

      let classes: PostureType[] = [];
      Object.entries(predictedResult)
        .sort((a, b) => b[1] - a[1])
        .forEach(([key, probability], i) => {
          if (key !== 'message' && probability >= 0.25) {
            classes.push({
              class: key,
              probability,
              description: splittedMessage[i - 1].split(' Action: ')[0],
              actions: splittedMessage[i - 1].split(' Action: ')[1].split('; '),
            });
          }
        });
      setPostureTypes(classes);
      console.log(postureTypes);
      setIsLoading(false);
    }
  }, [predictedResult]);

  useEffect(() => {
    if (!postureTypes) {
      setIsLoading(true);
    }
  }, [postureTypes]);

  return (
    <div className={styles.prediction}>
      {isLoading === false ? (
        <>
          <b>Posture Classification</b>
          <p>
            Using neural network algorithms, your posture is categorized into
            specific classifications (e.g., neutral, scoliotic, kyphotic). This
            classification helps identify patterns that may contribute to
            discomfort or movement inefficiencies.
          </p>
          {postureTypes.map((element) => (
            <div className={styles.predictionItem}>
              <p>
                {element.description}
                {/* {element.description.split(' posture').map((el, i) => {
                  if (i === 0) {
                    return <b>{el} posture</b>;
                  } else {
                    return <text>{el}</text>;
                  }
                })} */}
                <br />
                Probability:&nbsp;
                {Math.round(element.probability * 100)}%
              </p>
              Recommended Exercises:
              <div>
                {element.actions.map((action) => (
                  <text>
                    🤸‍♀️ {action.replace(/^[0-9]\)/, '')}
                    <br></br>
                  </text>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.spinnerContainer}>
          <img src={shrimpImage} className={styles.spinner} alt="spinner" />
        </div>
      )}
    </div>
  );
};

export default Prediction;
