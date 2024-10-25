import { ContentType, HttpMethod } from '../../enums';

type HttpOptions = {
  method: HttpMethod;
  contentType: ContentType; //header
  authorization: string; //header
  email?: string; //custom header
  payload: BodyInit | null;
};

export type { HttpOptions };
