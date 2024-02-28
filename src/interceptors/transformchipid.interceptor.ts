import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformChipIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('interceptor');
    return next
      .handle()
      .pipe(
        map((data) =>
          data && data.data && Array.isArray(data.data)
            ? this.transformData(data)
            : data,
        ),
      );
  }

  private transformData(data: any): any {
    const chipIdToNameMapping = {
      1: 'JUDGMENT',
      2: 'OBSERVATION',
      3: 'LISTENING',
      4: 'COMMUNICATION',
      5: 'FRIENDLINESS',
      6: 'EXECUTION',
      7: 'PERSEVERANCE',
      // ... 다른 chip_id와 chip_name의 매핑
    };

    return {
      ...data,
      data: data.data.map((item) => ({
        ...item,
        reviews: Array.isArray(item.reviews)
          ? item.reviews.map((review: any) => ({
              ...review,
              chip_name: review.chip_id
                ? chipIdToNameMapping[review.chip_id]
                : undefined,
              chip_id: review.chip_id ? review.chip_id : undefined,
            }))
          : undefined,
      })),
    };
  }
}
