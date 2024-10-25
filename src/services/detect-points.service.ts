import { HttpMethod } from '../common/enums';
import { DetectedPoints } from '../common/types';
import { Http } from './http.service';

class DetectPointsService {
  private BASE = '/posture-points';
  private URL = 'http://127.0.0.1:8000';

  async getPosturePoints(base64: string): Promise<DetectedPoints> {
    const http = new Http<DetectedPoints>();
    const resp: DetectedPoints = await http.load(
      this.BASE,
      {
        method: HttpMethod.POST,
        payload: JSON.stringify({ base64 }),
      },
      this.URL
    );
    return resp as DetectedPoints;
  }
}

export { DetectPointsService };
