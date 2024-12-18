/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import rfdc from 'rfdc';
import shrimpImage from '../../assets/img/shrimp.png';
import { AppRoute, FullLandmarks, SideLandmarks } from '../../common/enums';
import { ISideDetectedPoints } from '../../common/interfaces';
import { DetectedPoints, Point } from '../../common/types';
import { StepContext, UploadFileWithBase64 } from '../../contexts/step';
import { DetectPointsService } from '../../services/detect-points.service';
import ImageWithPoints from './image-with-points';

import styles from './styles.module.scss';

const IdentifyPoints: React.FC = () => {
  const DISABLED_COLOR = 'grey';
  const BEFORE_SLEEP_WEIGHT = 0.4;

  const navigate = useNavigate();
  const clone = rfdc();
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
  const filesWoPoints = (stepContext?.fileList || [])
    .map((el) => el.uid)
    .filter((el) => !Object.keys(stepContext?.pointList || {}).includes(el));
  const [fileListWoPoints, setFileListWoPoints] =
    useState<string[]>(filesWoPoints);

  const isPrevDisabled = () => currentFile?.index === 0;
  const isNextDisabled = () =>
    currentFile?.index >= (stepContext?.fileList || []).length - 1;

  const getPoints = async (): Promise<Record<string, DetectedPoints>> => {
    setIsLoading(true);
    const fileList = stepContext?.fileList || [];
    let points: Record<string, DetectedPoints> = {};

    //TODO: getPoints only for fileListWoPoints && save points partially to not override existing ones
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

  const add = (accumulator: number, a: number) => accumulator + a;

  const calculateStatPoints = (points: Record<string, DetectedPoints>) => {
    const listWithPoints = Object.values(points);
    const ordWeight = (1 - BEFORE_SLEEP_WEIGHT) / (listWithPoints.length - 1);

    const statPoints = clone(listWithPoints[listWithPoints.length - 1]);
    const landmarksKeys = Object.keys(statPoints.landmarks) as (FullLandmarks &
      SideLandmarks)[];

    landmarksKeys.forEach((landmarkKey) => {
      const bsPoint = statPoints.landmarks[landmarkKey] as Point;
      const otherPointsX = listWithPoints
        .slice(0, -1)
        .map((el) => (el.landmarks[landmarkKey] as Point).x * ordWeight);
      const otherPointsY = listWithPoints
        .slice(0, -1)
        .map((el) => (el.landmarks[landmarkKey] as Point).y * ordWeight);

      bsPoint.x = bsPoint.x * BEFORE_SLEEP_WEIGHT + otherPointsX.reduce(add, 0);
      bsPoint.y = bsPoint.y * BEFORE_SLEEP_WEIGHT + otherPointsY.reduce(add, 0);
    });

    return { [Object.keys(points)[listWithPoints.length - 1]]: statPoints };
  };

  useEffect(() => {
    const filesWithPoints = Object.keys(stepContext?.pointList || {});
    const fileListNames = (stepContext?.fileList || []).map((el) => el.uid);
    filesWithPoints
      .filter((el) => !fileListNames.includes(el))
      .forEach((el) => delete stepContext?.pointList[el]);

    if (filesWithPoints.length === 0 || fileListWoPoints.length > 0) {
      getPoints()
        .then((result) => {
          if (result) {
            setPoints(result);
            setFileListWoPoints([]);
            stepContext?.setPointList(result);
          }
        })
        .catch((e: any) => navigate(`/${AppRoute.NOT_FOUND}`));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(points).length !== 0 || fileListWoPoints.length > 0) {
      setIsLoading(false);
    }
  }, [points, currentFile, fileListWoPoints]);

  useEffect(() => {
    if (Object.keys(points).length !== 0) {
      stepContext?.setStatisticalPoints({});
      stepContext?.setStatisticalFileList([]);

      if (stepContext?.isStatisticalMode) {
        const calcStatPoints = calculateStatPoints(points);
        const foundFile =
          stepContext?.fileList.find(
            (el) => el.uid === Object.keys(calcStatPoints)[0]
          ) || ({} as UploadFileWithBase64);
        stepContext?.setStatisticalPoints(calcStatPoints);
        stepContext?.setStatisticalFileList([foundFile]);
      }
    }
  }, [points, currentFile]);

  useEffect(() => {
    if (!points[currentFile.uid] || fileListWoPoints.length > 0) {
      setIsLoading(true);
    }
  }, [currentFile, fileListWoPoints]);

  return (
    <>
      <h5>Select Key Points for Analysis</h5>
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
          <div className={styles.description}>
            <b>
              Side:&nbsp;
              {points[currentFile.uid].sideView
                ? (points[currentFile.uid] as ISideDetectedPoints).side
                : 'BACK/FRONT'}
              {/*TODO: define side BACK/FRONT*/}
            </b>
            <p>
              To perform an accurate analysis, please review the following key
              anatomical points. These points are crucial for evaluating
              alignment, symmetry, and functional movement:
            </p>
            {points[currentFile.uid].sideView ? (
              <div>
                <p>
                  <div className={styles.dotWithText}>
                    <b>1. Ear</b> <div className={styles.dotEar}></div>
                  </div>
                  The lowest point of the ear (earlobe) is used to assess head
                  position relative to the neck and shoulders, aiding in posture
                  and balance evaluation.
                </p>
                <p>
                  <div className={styles.dotWithText}>
                    <b>2. Shoulder</b>
                    <div className={styles.dotShoulder}></div>
                  </div>
                  The highest point of the shoulder, typically the acromion, is
                  identified to evaluate alignment and symmetry across the upper
                  body.
                </p>
                <p>
                  <div className={styles.dotWithText}>
                    <b>3. Hip (Large Swivel Joint)</b>
                    <div className={styles.dotHip}></div>
                  </div>
                  The prominent point of the hip, usually the greater
                  trochanter, serves as a reference for pelvic alignment and
                  lower body posture analysis.
                </p>
                <p>
                  <div className={styles.dotWithText}>
                    <b>4. Knee</b>
                    <div className={styles.dotKnee}></div>
                  </div>
                  The center of the knee joint, generally at the midpoint of the
                  patella (kneecap), is crucial for analyzing leg alignment,
                  load distribution, and movement mechanics.
                </p>
                <p>
                  <div className={styles.dotWithText}>
                    <b>5. Ankle</b>
                    <div className={styles.dotAnkle}></div>
                  </div>
                  The center of ankle joint, typically at the midpoint between
                  the inner and outer ankle bones (medial and lateral malleoli).
                  This point is crucial for evaluating foot alignment and the
                  connection between lower limb mechanics and balance.
                </p>
              </div>
            ) : (
              <div>
                <p>
                  <div className={styles.dotWithText}>
                    <b>1. Shoulders (Left </b>
                    <div className={styles.dotLeftShoulder} />
                    <b> &nbsp;and Right </b>
                    <div className={styles.dotRightShoulder} />)
                  </div>
                  Identify and select the highest point of both shoulders,
                  typically the acromion. These points help evaluate shoulder
                  height symmetry and overall upper body alignment.
                </p>
                <p>
                  <div className={styles.dotWithText}>
                    <b>2. Hips (Left </b>
                    <div className={styles.dotLeftHip} />
                    <b> &nbsp;and Right </b>
                    <div className={styles.dotRightHip} />)
                  </div>
                  Choose either the hip joint (greater trochanter) or the lowest
                  point of the gluteal fold for each side. These points are
                  critical for assessing pelvic alignment and lower body
                  posture.
                </p>
                <p>
                  <div className={styles.dotWithText}>
                    <b>3. Knees (Left </b>
                    <div className={styles.dotLeftKnee} />
                    <b> &nbsp;and Right </b>
                    <div className={styles.dotRightKnee} />)
                  </div>
                  Mark the center of each knee joint, usually at the midpoint of
                  the patella (kneecap). These points are vital for analyzing
                  leg alignment and balance between the lower limbs.
                </p>
              </div>
            )}
            <h5>Automatic Selection and Manual Adjustment</h5>
            <p>
              Our system has automatically marked these points for your
              convenience. However, if you notice that any of the points are not
              correctly positioned, you are free to adjust them as needed.
            </p>
            <h6>How to Adjust:</h6>
            <p>
              1. Simply click on a point and drag it to the correct location.{' '}
              <br></br>
              2. Ensure Accuracy: Accurate point placement ensures reliable
              analysis and meaningful insights.
            </p>
            <p>
              This combination of automation and manual adjustment empowers you
              to achieve precision and confidence in the analysis process.
            </p>
          </div>
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
