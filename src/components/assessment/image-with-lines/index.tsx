/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { FullLandmarks, SideLandmarks } from '../../../common/enums';
import { DetectedPoints, Point } from '../../../common/types';
import { UploadFileWithBase64 } from '../../../contexts/step';

import styles from './styles.module.scss';

type Props = {
  file: UploadFileWithBase64;
  points: DetectedPoints;
};

const ImageWithLines: React.FC<Props> = ({ file, points }: Props) => {
  const POINT_RADIUS = 5;
  const DRAGGABLE_CLASS_NAME = 'react-draggable-key-';

  const imageRef = useRef<HTMLImageElement>(null);
  const pointsContainer = useRef<HTMLDivElement>(null);

  const [relativePoints, setRelativePoints] = useState<
    Record<FullLandmarks | SideLandmarks, Omit<Point, 'z'>>
  >({} as Record<FullLandmarks | SideLandmarks, Omit<Point, 'z'>>);

  const calculateInitialPoints = (
    points: DetectedPoints
  ): Record<FullLandmarks | SideLandmarks, Omit<Point, 'z'>> => {
    const rect = imageRef.current?.getBoundingClientRect() as DOMRect;
    const calculatedPoints: Record<string, Omit<Point, 'z'>> = {};
    Object.entries(points?.landmarks).forEach(
      ([key, value]: [string, Point]) => {
        calculatedPoints[key] = {
          x: Math.floor(value.x * rect.width) - POINT_RADIUS,
          y: Math.floor(value.y * rect.height - rect.height) - POINT_RADIUS,
        };
      }
    );
    return calculatedPoints as Record<
      FullLandmarks | SideLandmarks,
      Omit<Point, 'z'>
    >;
  };

  useEffect(() => {
    if (imageRef.current) {
      console.log(points);
      const initPoints = calculateInitialPoints(points);
      setRelativePoints({ ...initPoints, ...relativePoints });
    }
  }, [imageRef.current]);

  return (
    <div className={styles.parentContainer} ref={pointsContainer}>
      <img
        src={file.preview}
        ref={imageRef}
        className={styles.img}
        alt="defined posture points"
      />

      {Object.entries(relativePoints).map(([key, point], i) => (
        <>
          <Draggable
            position={point}
            key={key}
            disabled={true}
            defaultClassName={`${DRAGGABLE_CLASS_NAME}${key}`}
          >
            <div className={styles.dot}></div>
          </Draggable>
          {/* <Draggable
            position={point}
            key={key}
            disabled={true}
            defaultClassName={`${DRAGGABLE_CLASS_NAME}${key}`}
          >
            <div
              className={styles.line}
              style={{ width: `Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)))` }}
            ></div>
          </Draggable> */}
        </>
      ))}
    </div>
  );
};

export default ImageWithLines;
