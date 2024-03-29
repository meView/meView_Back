import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';

@Module({
  providers: [AnswerService],
  controllers: [AnswerController],
  exports: [AnswerService],
})
export class AnswerModule {}
