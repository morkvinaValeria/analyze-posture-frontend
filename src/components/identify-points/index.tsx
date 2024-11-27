/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shrimpImage from '../../assets/img/shrimp.png';
import { AppRoute } from '../../common/enums';
import { ISideDetectedPoints } from '../../common/interfaces';
import { DetectedPoints, Point } from '../../common/types';
import { StepContext, UploadFileWithBase64 } from '../../contexts/step';
import { DetectPointsService } from '../../services/detect-points.service';
import ImageWithPoints from './image-with-points';

import styles from './styles.module.scss';

const IdentifyPoints: React.FC = () => {
  const DISABLED_COLOR = 'grey';
  const navigate = useNavigate();

  const stepContext = useContext(StepContext);
  const detectPointsService = new DetectPointsService();

  const [points, setPoints] = useState<Record<string, DetectedPoints>>({
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

  const getPoints = async (): Promise<Record<string, DetectedPoints>> => {
    setIsLoading(true);
    const fileList = stepContext?.fileList || [];
    let points: Record<string, DetectedPoints> = {};

    for (let i = 0; i < fileList.length; i++) {
      const base64 = fileList[i].base64.split(',')[1];
      const uid = fileList[i].uid;
      const resp = await detectPointsService.getPosturePoints(base64);
      points[uid] = resp;
    }
    return points;
  };

  const changeFile = (n: number) => {
    if (stepContext?.fileList && currentFile) {
      const newFile = stepContext?.fileList[currentFile.index + n];
      setCurrentFile({ ...newFile, index: currentFile.index + n });
    }
  };

  const saveNewPosition = (newPoint: Record<string, Omit<Point, 'z'>>) => {
    const changedPoints = {
      ...points,
      [currentFile.uid]: {
        landmarks: {
          ...points[currentFile.uid].landmarks,
          ...newPoint,
        },
        sideView: points[currentFile.uid].sideView,
        side:
          (points[currentFile.uid] as ISideDetectedPoints).side || undefined,
      } as DetectedPoints,
    };
    setPoints(changedPoints);
    stepContext?.setPointList(changedPoints);
  };

  useEffect(() => {
    if (stepContext?.pointList) {
      getPoints()
        .then((result) => {
          if (result) {
            setPoints(result);
            stepContext?.setPointList(result);
          }
        })
        .catch((e: any) => navigate(`/${AppRoute.NOT_FOUND}`));
    }
  }, []);

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
      <h5>Change positions of points if needed</h5>
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
          <ImageWithPoints
            file={currentFile}
            points={points[currentFile.uid]}
            adjustPoints={saveNewPosition}
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

export default IdentifyPoints;
