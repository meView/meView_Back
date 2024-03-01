import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Get(':question_id')
  async getAnswer(@Param('question_id', ParseIntPipe) question_id: number) {
    return this.answerService.getAnswer(question_id);
  }

  @Post('create')
  async writeAnswer(@Body() createAnswerDTO: CreateAnswerDto) {
    return this.answerService.writeAnswer(createAnswerDTO);
  }
}
