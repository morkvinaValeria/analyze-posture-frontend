import { Side, SideLandmarks } from '../../enums';
import { Point } from '../../types';

export interface ISideDetectedPoints {
  landmarks: Record<SideLandmarks, Point>;
  sideView: true;
  side: Side;
}
