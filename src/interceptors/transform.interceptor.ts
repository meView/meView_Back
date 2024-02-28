import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  success: true;
  code: 'OK';
  data: T;
  statusCode: 200;
  response_responder?: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(_: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // 기본 응답 객체
        const response: Response<T> = {
          success: true,
          code: 'OK',
          data,
          statusCode: 200,
        };

        // result 내에 response_responder가 있으면 최상위에 추가
        if (data?.response_responder) {
          response.response_responder = data.response_responder;
          // response_responder를 제외한 나머지 데이터를 data에 할당
          const { response_responder, ...rest } = data;
          response.data = rest;
        }

        return response;
      }),
    );
  }
}
