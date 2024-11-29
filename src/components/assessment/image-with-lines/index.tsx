/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { FullLandmarks, Side, SideLandmarks } from '../../../common/enums';
import { DetectedPoints, Point } from '../../../common/types';
import { UploadFileWithBase64 } from '../../../contexts/step';

import styles from './styles.module.scss';

type Props = {
  file: UploadFileWithBase64;
  points: DetectedPoints;
  saveAngles: (angles: Record<string, number>) => void;
};

const ImageWithLines: React.FC<Props> = ({
  file,
  points,
  saveAngles,
}: Props) => {
  const POINT_RADIUS = 5;
  const DRAGGABLE_CLASS_NAME = 'react-draggable-key-';
  const FULL_VIEW_PARTS = ['Shoulder', 'Hip', 'Knee'];
  const SIDE_VIEW_PARTS = [
    ['ear', 'shoulder'],
    ['shoulder', 'hip'],
    ['hip', 'knee'],
    ['knee', 'ankle'],
  ];
  const BACK_EXCEPTION_LINES = ['rightShoulder', 'rightHip', 'rightKnee'];
  const FRONT_EXCEPTION_LINES = ['leftShoulder', 'leftHip', 'leftKnee'];
  const SIDE_EXCEPTION_LINES = ['ankle'];

  const imageRef = useRef<HTMLImageElement>(null);
  const pointsContainer = useRef<HTMLDivElement>(null);

  const [relativePoints, setRelativePoints] = useState<
    Record<FullLandmarks | SideLandmarks, Omit<Point, 'z'>>
  >({} as Record<FullLandmarks | SideLandmarks, Omit<Point, 'z'>>);
  const [angles, setAngles] = useState<Record<string, number>>({});
  const [exceptionLines, setExceptionLines] = useState<string[]>([]);
  const [side, setSide] = useState<Side>();

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
    } else if (p1.x < p2.x && -p1.y > -p2.y) {
      setExceptionLines(BACK_EXCEPTION_LINES);
      return degrees(Math.atan(-(p1.y - p2.y) / (p2.x - p1.x)));
    } else if (p1.x < p2.x && -p1.y < -p2.y) {
      setExceptionLines(BACK_EXCEPTION_LINES);
      return 180 - degrees(Math.atan(-(p2.y - p1.y) / (p2.x - p1.x)));
    } else if (p2.x < p1.x && -p2.y > -p1.y) {
      setExceptionLines(FRONT_EXCEPTION_LINES);
      return 180 - degrees(Math.atan(-(p2.y - p1.y) / (p1.x - p2.x)));
    } else if (p2.x < p1.x && -p2.y < -p1.y) {
      setExceptionLines(FRONT_EXCEPTION_LINES);
      return degrees(Math.atan(-(p1.y - p2.y) / (p1.x - p2.x)));
    } else {
      return -1;
    }
  };

  const calculateSideAngle = (
    p1: Omit<Point, 'z'>,
    p2: Omit<Point, 'z'>,
    side: Side
  ): number => {
    const left = p1.x < p2.x ? p1 : p2;
    const right = p1.x >= p2.x ? p1 : p2;
    setExceptionLines(SIDE_EXCEPTION_LINES);
    setSide(side);

    if (left.x === right.x) {
      return 0;
    } else if (left.x < right.x && -left.y < -right.y && side === Side.RIGHT) {
      return degrees(Math.atan((right.x - left.x) / -(right.y - left.y)));
    } else if (left.x < right.x && -right.y < -left.y && side === Side.RIGHT) {
      return 180 - degrees(Math.atan((right.x - left.x) / -(left.y - right.y)));
    } else if (left.x < right.x && -left.y < -right.y && side === Side.LEFT) {
      return 180 - degrees(Math.atan((right.x - left.x) / -(right.y - left.y)));
    } else if (left.x < right.x && -right.y < -left.y && side === Side.LEFT) {
      return degrees(Math.atan((right.x - left.x) / -(left.y - right.y)));
    } else {
      return -1;
    }
  };

  const calculateAngles = (
    points: Record<FullLandmarks | SideLandmarks, Omit<Point, 'z'>>,
    sideView: boolean,
    side: Side
  ): Record<string, number> => {
    const degrees: Record<string, number> = {};
    if (!sideView) {
      FULL_VIEW_PARTS.forEach((part) => {
        const right = points[`right${part}` as FullLandmarks];
        const left = points[`left${part}` as FullLandmarks];
        const angle = calculateBackAngle(left, right);
        degrees[`${part.toLowerCase()}s`] = angle;
      });
    } else {
      SIDE_VIEW_PARTS.forEach((part) => {
        const part1 = points[part[0] as SideLandmarks];
        const part2 = points[part[1] as SideLandmarks];
        const angle = calculateSideAngle(part1, part2, side);
        degrees[`${part[0]}-${part[1]}`] = angle;
      });
    }

    saveAngles(degrees);
    return degrees;
  };

  const getView = (bodyPart: string) => {
    let isSideView = true;
    let fullViewPart = '';
    FULL_VIEW_PARTS.forEach((part) => {
      if (!bodyPart.includes(part) === false) {
        isSideView = !bodyPart.includes(part);
        fullViewPart = part;
        return;
      }
    });
    return { isSideView, fullViewPart };
  };

  const getAngleDegree = (bodyPart: string): number => {
    const { isSideView, fullViewPart } = getView(bodyPart);
    if (isSideView) {
      const sideViewAngleKey = Object.keys(angles).find((key) =>
        key.includes(`${bodyPart}-`)
      ) as string;
      const resAngle = angles[sideViewAngleKey];
      const k1 = side === Side.RIGHT ? 1 : -1;
      const k2 = side === Side.RIGHT ? -90 : 90;

      return resAngle < 90 ? 90 + resAngle * k1 : (resAngle + k2) * k1;
    } else {
      const foundAngle = angles[`${fullViewPart.toLowerCase()}s`];
      const k1 = exceptionLines[0] === FRONT_EXCEPTION_LINES[0] ? 1 : -1;
      const k2 = exceptionLines[0] === FRONT_EXCEPTION_LINES[0] ? -1 : 1;

      return foundAngle > 90 ? (180 - foundAngle) * k1 : foundAngle * k2;
    }
  };

  const getLengthBeetweenPoints = (
    p1: Omit<Point, 'z'>,
    p2: Omit<Point, 'z'>
  ): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const calculateWidth = (
    bodyPart: string,
    pointsList: Record<FullLandmarks | SideLandmarks, Omit<Point, 'z'>>
  ): number => {
    const { isSideView, fullViewPart } = getView(bodyPart);
    const point1 = pointsList[bodyPart as FullLandmarks | SideLandmarks];

    if (!isSideView) {
      const foundKey = Object.keys(pointsList).find(
        (key) => key.includes(fullViewPart) && key !== bodyPart
      ) as FullLandmarks | SideLandmarks;
      return getLengthBeetweenPoints(point1, pointsList[foundKey]);
    } else {
      const foundKey = (
        SIDE_VIEW_PARTS.find((part) => part[0] === bodyPart) as string[]
      )[1] as FullLandmarks | SideLandmarks;
      return getLengthBeetweenPoints(point1, pointsList[foundKey]);
    }
  };

  useEffect(() => {
    if (imageRef.current) {
      console.log(points);
      const initPoints = calculateInitialPoints(points);
      setRelativePoints({ ...initPoints, ...relativePoints });

      console.log('initPoints', initPoints);
      const calculatedAngles = calculateAngles(
        initPoints,
        points.sideView,
        points.sideView ? points.side : Side.RIGHT
      );
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
            <div className={styles.dot}>
              {exceptionLines.includes(key) ? (
                <></>
              ) : (
                <div
                  className={styles.line}
                  style={{
                    width: `${calculateWidth(key, relativePoints)}px`,
                    transform: `translate(5.5px, 5px) rotate(${getAngleDegree(
                      key
                    )}deg)`,
                    transformOrigin: 'left',
                  }}
                ></div>
              )}
            </div>
          </Draggable>
        </>
      ))}
    </div>
  );
};

export default ImageWithLines;
