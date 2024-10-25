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
    const calculatedPoints: Record<string, Omit<Point, 'z'>> = {};
    Object.entries(points?.landmarks).forEach(
      ([key, value]: [string, Point]) => {
        calculatedPoints[key] = {
          x: value.x * rect.width - rect.left,
          y: value.y * rect.height - rect.bottom,
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
  }, [imageRef.current]);

  return (
    <>
      <div className={styles.parentContainer}>
        <img src={file.preview} alt="posture points" ref={imageRef}></img>
        {Object.entries(relativePoints).map(([key, point], i) => (
          <Draggable
            bounds="parent"
            onDrag={handleDrag}
            defaultPosition={point}
          >
            <div className={styles.dot}></div>
          </Draggable>
        ))}
      </div>
    </>
  );
};

export default ImageWithPoints;
