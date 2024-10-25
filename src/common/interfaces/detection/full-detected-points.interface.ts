import { FullLandmarks } from '../../enums';
import { Point } from '../../types';

export interface IFullDetectedPoints {
  landmarks: Record<FullLandmarks, Point>;
  sideView: false;
}
