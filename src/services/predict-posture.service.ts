import { HttpMethod } from '../common/enums';
import {
  IFullPosturePrediction,
  ISidePosturePrediction,
} from '../common/interfaces';
import { Http } from './http.service';

class PredictPostureService {
  private BASE = '/predict-posture';
  private URL = 'http://127.0.0.1:8086';

  async predictPosture(
    angles: string[],
    sideView: boolean
  ): Promise<IFullPosturePrediction | ISidePosturePrediction> {
    const http = new Http<IFullPosturePrediction | ISidePosturePrediction>();
    console.log('payload', JSON.stringify({ angles, sideView }));
    const resp: IFullPosturePrediction | ISidePosturePrediction =
      await http.load(
        this.BASE,
        {
          method: HttpMethod.POST,
          payload: JSON.stringify({ angles, sideView }),
        },
        this.URL
      );
    return resp as IFullPosturePrediction | ISidePosturePrediction;
  }
}

export { PredictPostureService };
