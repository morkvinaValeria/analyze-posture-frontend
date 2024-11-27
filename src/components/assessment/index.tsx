/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import shrimpImage from '../../assets/img/shrimp.png';
import { DetectedPoints } from '../../common/types';
import { StepContext, UploadFileWithBase64 } from '../../contexts/step';
import ImageWithLines from './image-with-lines';

import styles from './styles.module.scss';

const Assessment: React.FC = () => {
  const DISABLED_COLOR = 'grey';

  const stepContext = useContext(StepContext);

  const [points] = useState<Record<string, DetectedPoints>>({
    ...stepContext?.pointList,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentFile, setCurrentFile] = useState<
    UploadFileWithBase64 & { index: number }
  >({
    ...(stepContext?.fileList[0] as UploadFileWithBase64),
    index: 0,
  });

  const isPrevDisabled = () => currentFile?.index === 0;
  const isNextDisabled = () =>
    currentFile?.index >= (stepContext?.fileList || []).length - 1;

  const changeFile = (n: number) => {
    if (stepContext?.fileList && currentFile) {
      const newFile = stepContext?.fileList[currentFile.index + n];
      setCurrentFile({ ...newFile, index: currentFile.index + n });
    }
  };

  useEffect(() => {
    if (Object.keys(points).length !== 0) {
      setIsLoading(false);
    }
  }, [points, currentFile]);

  useEffect(() => {
    if (!points[currentFile.uid]) {
      setIsLoading(true);
    }
  }, [currentFile]);

  return (
    <>
      <h5>Assessment</h5>
      <br />
      {isLoading === false && currentFile && points[currentFile.uid] ? (
        <div className={styles.imgSlider}>
          <button
            className={styles.prev}
            onClick={() => changeFile(-1)}
            disabled={isPrevDisabled()}
            style={isPrevDisabled() ? { color: DISABLED_COLOR } : {}}
          >
            &#10094;
          </button>
          <ImageWithLines
            file={currentFile}
            points={points[currentFile.uid]}
            key={currentFile?.index || -1}
          />
          <button
            className={styles.next}
            onClick={() => changeFile(1)}
            disabled={isNextDisabled()}
            style={isNextDisabled() ? { color: DISABLED_COLOR } : {}}
          >
            &#10095;
          </button>
        </div>
      ) : (
        <div className={styles.spinnerContainer}>
          <img src={shrimpImage} className={styles.spinner} alt="spinner" />
        </div>
      )}
    </>
  );
};

export default Assessment;
