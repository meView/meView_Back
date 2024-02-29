import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class CapabilityValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // 소문자로 넘어온 값 대문자로 변환
    value = value.toUpperCase();
    return value;
  }
}
