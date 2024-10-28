import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { FullLandmarks, SideLandmarks } from '../../../common/enums';
import { DetectedPoints, Point } from '../../../common/types';
import { UploadFileWithBase64 } from '../../../contexts/step';

import styles from './styles.module.scss';

type Props = {
  file: UploadFileWithBase64;
  points: DetectedPoints;
  adjustPoints: (points: DetectedPoints) => void;
};

type State = {
  deltaPosition: Omit<Point, 'z'>;
};

const ImageWithPoints: React.FC<Props> = ({
  file,
  points,
  adjustPoints,
}: Props) => {
  const POINT_RADIUS = 5;
  const imageRef = useRef<HTMLImageElement>(null);

  const [relativePoints, setRelativePoints] = useState<
    Record<FullLandmarks | SideLandmarks, Omit<Point, 'z'>>
  >({} as Record<FullLandmarks | SideLandmarks, Omit<Point, 'z'>>);
  const [state, setState] = useState<State>({
    deltaPosition: {
      x: 0,
      y: 0,
    },
  });

  const handleDrag = (e: any, ui: any) => {
    const { x, y } = state.deltaPosition;
    console.log(ui);
    setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      },
    });
  };

  const calculateInitialPoints = (points: DetectedPoints) => {
    const rect = imageRef.current?.getBoundingClientRect() as DOMRect;
    console.log('rect', rect);
    console.log('initial points', points);
    const calculatedPoints: Record<string, Omit<Point, 'z'>> = {};
    Object.entries(points?.landmarks).forEach(
      ([key, value]: [string, Point]) => {
        calculatedPoints[key] = {
          x: Math.floor(value.x * rect.width) - POINT_RADIUS,
          y: Math.floor(value.y * rect.height) - POINT_RADIUS,
        };
      }
    );
    console.log('calculatedPoints', calculatedPoints);
    return calculatedPoints;
  };

  useEffect(() => {
    if (imageRef.current) {
      const initPoints = calculateInitialPoints(points);
      setRelativePoints(initPoints);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageRef.current]);

  return (
    <div className={styles.parentContainer}>
      <img
        src={file.preview}
        ref={imageRef}
        className={styles.img}
        alt="defined posture points"
      />

      {Object.entries(relativePoints).map(([key, point], i) => (
        <Draggable bounds="parent" onDrag={handleDrag} positionOffset={point}>
          <div className={styles.dot}></div>
        </Draggable>
      ))}
    </div>
  );
};

export default ImageWithPoints;
