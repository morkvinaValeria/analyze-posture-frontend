import axios from 'axios';
import { ContentType, HttpHeader, HttpMethod } from '../common/enums';
import { HttpOptions } from '../common/types';
import { HttpError } from '../exceptions';

class Http<T = unknown> {
  public async load(
    urlParams: string,
    options: Partial<HttpOptions> = {},
    baseUrl: string = 'http://127.0.0.1:3001'
  ): Promise<T> {
    try {
      const {
        method = HttpMethod.GET,
        contentType = ContentType.JSON,
        payload = null,
        authorization,
        email = null,
      } = options;

      const headers = this.getHeaders(contentType, authorization, email);
      const response = await axios(`${baseUrl}${urlParams}`, {
        method,
        headers,
        data: payload,
      });

      return response.data;
    } catch (err) {
      console.log(err);
      throw new HttpError({ message: err as string });
    }
  }

  private getHeaders(
    contentType?: ContentType,
    authorization?: string,
    email?: string | null
  ): { [key: string]: string } {
    let headers = {};
    if (contentType) {
      headers = { ...headers, ...{ [HttpHeader.CONTENT_TYPE]: contentType } };
    }
    if (authorization) {
      headers = {
        ...headers,
        ...{ [HttpHeader.AUTHORIZATION]: authorization },
      };
    }
    if (email) {
      headers = { ...headers, ...{ [HttpHeader.EMAIL]: email } };
    }
    return headers;
  }
}

export { Http };
