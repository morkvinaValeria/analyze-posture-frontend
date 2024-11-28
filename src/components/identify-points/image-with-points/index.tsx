/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import Draggable, { DraggableBounds } from 'react-draggable';
import { FullLandmarks, SideLandmarks } from '../../../common/enums';
import { DetectedPoints, Point } from '../../../common/types';
import { UploadFileWithBase64 } from '../../../contexts/step';

import styles from './styles.module.scss';

type Props = {
  file: UploadFileWithBase64;
  points: DetectedPoints;
  adjustPoints: (points: Record<string, Omit<Point, 'z'>>) => void;
};

const ImageWithPoints: React.FC<Props> = ({
  file,
  points,
  adjustPoints,
}: Props) => {
  const POINT_RADIUS = 5;
  const DRAGGABLE_CLASS_NAME = 'react-draggable-key-';

  const imageRef = useRef<HTMLImageElement>(null);
  const pointsContainer = useRef<HTMLDivElement>(null);

  const [relativePoints, setRelativePoints] = useState<
    Record<FullLandmarks | SideLandmarks, Omit<Point, 'z'>>
  >({} as Record<FullLandmarks | SideLandmarks, Omit<Point, 'z'>>);
  const [bounds, setBounds] = useState<DraggableBounds>();

  const handleStop = (e: any, ui: any) => {
    const classes: string[] = ui.node.className.split(' ');
    const key = classes
      .find((name: string) => name.includes('-key'))
      ?.split(DRAGGABLE_CLASS_NAME)[1] as FullLandmarks | SideLandmarks;

    const newCoord = {
      x: ui.x,
      y: ui.y,
    };
    setRelativePoints({ ...relativePoints, [key]: newCoord });
    const normPoints = calculateNormalizedPoints({ [key]: newCoord });
    adjustPoints(normPoints);
  };

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

  const calculateNormalizedPoints = (
    points: Record<string, Omit<Point, 'z'>>
  ) => {
    const rect = imageRef.current?.getBoundingClientRect() as DOMRect;
    const landmarks = {} as Record<string, Point>;

    Object.entries(points).forEach(
      ([key, value]: [string, Omit<Point, 'z'>]) => {
        landmarks[key] = {
          x: (value.x + POINT_RADIUS) / rect.width,
          y: (value.y + POINT_RADIUS + rect.height) / rect.height,
        } as Point;
      }
    );

    return landmarks;
  };

  useEffect(() => {
    if (imageRef.current) {
      const initPoints = calculateInitialPoints(points);
      setRelativePoints({ ...initPoints, ...relativePoints });
    }
  }, [imageRef.current]);

  useEffect(() => {
    if (pointsContainer.current) {
      setBounds({
        bottom: 0 - 2 * POINT_RADIUS,
        left: 0,
        right: pointsContainer.current.clientWidth - 2 * POINT_RADIUS,
        top: -pointsContainer.current.clientHeight,
      });
    }
  }, [pointsContainer.current]);

  return (
    <div className={styles.parentContainer} ref={pointsContainer}>
      <img
        src={file.preview}
        ref={imageRef}
        className={styles.img}
        alt="defined posture points"
      />

      {Object.entries(relativePoints).map(([key, point], i) => (
        <Draggable
          bounds={bounds}
          offsetParent={pointsContainer.current as HTMLElement}
          onStop={handleStop}
          defaultPosition={point}
          key={key}
          defaultClassName={`${DRAGGABLE_CLASS_NAME}${key}`}
        >
          <div className={styles[`dot-${key}`]}></div>
        </Draggable>
      ))}
    </div>
  );
};

export default ImageWithPoints;
