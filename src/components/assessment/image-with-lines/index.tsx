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
  const [angles, setAngles] = useState<Record<string, number>>();

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

  const degrees = (radians: number): number => {
    return (radians * 180) / Math.PI;
  };

  const calculateBackAngle = (
    p1: Omit<Point, 'z'>,
    p2: Omit<Point, 'z'>
  ): number => {
    if (p1.y === p2.y) {
      return 0;
      //back side
    } else if (p1.x < p2.x && -p1.y > -p2.y) {
      return degrees(Math.atan(-(p1.y - p2.y) / (p2.x - p1.x)));
      //back side
    } else if (p1.x < p2.x && -p1.y < -p2.y) {
      return 180 - degrees(Math.atan(-(p2.y - p1.y) / (p2.x - p1.x)));
      //front side
    } else if (p2.x < p1.x && -p2.y > -p1.y) {
      return 180 - degrees(Math.atan(-(p2.y - p1.y) / (p1.x - p2.x)));
      //front side
    } else if (p2.x < p1.x && -p2.y < -p1.y) {
      return degrees(Math.atan(-(p1.y - p2.y) / (p1.x - p2.x)));
    } else {
      return -1;
    }
  };

  const calculateSideAngle = (
    p1: Omit<Point, 'z'>,
    p2: Omit<Point, 'z'>
  ): number => {
    const left = p1.x < p2.x ? p1 : p2;
    const right = p1.x >= p2.x ? p1 : p2;

    if (left.x === right.x) {
      return 0;
    } else if (left.x < right.x && -left.y < -right.y) {
      return degrees(Math.atan((right.x - left.x) / -(right.y - left.y)));
    } else if (left.x < right.x && -right.y < -left.y) {
      return 180 - degrees(Math.atan((right.x - left.x) / -(left.y - right.y)));
    } else {
      return -1;
    }
  };

  const calculateAngles = (
    points: Record<FullLandmarks | SideLandmarks, Omit<Point, 'z'>>,
    sideView: boolean
  ): Record<string, number> => {
    const degrees: Record<string, number> = {};
    if (!sideView) {
      const parts = ['Shoulder', 'Hip', 'Knee'];
      parts.forEach((part) => {
        const right = points[`right${part}` as FullLandmarks];
        const left = points[`left${part}` as FullLandmarks];
        const angle = calculateBackAngle(left, right);
        degrees[`${part.toLowerCase()}s`] = angle;
      });
    } else {
      const parts = [
        ['ear', 'shoulder'],
        ['shoulder', 'hip'],
        ['hip', 'knee'],
        ['knee', 'ankle'],
      ];
      parts.forEach((part) => {
        const part1 = points[part[0] as SideLandmarks];
        const part2 = points[part[1] as SideLandmarks];
        const angle = calculateSideAngle(part1, part2);
        degrees[`${part[0]}-${part[1]}`] = angle;
      });
    }

    return degrees;
  };

  useEffect(() => {
    if (imageRef.current) {
      console.log(points);
      const initPoints = calculateInitialPoints(points);
      setRelativePoints({ ...initPoints, ...relativePoints });

      const calculatedAngles = calculateAngles(initPoints, points.sideView);
      setAngles(calculatedAngles);
      console.log('angles', angles);
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
