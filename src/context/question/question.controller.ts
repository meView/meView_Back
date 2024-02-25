import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  create(
    @Req() req: Request,
    @Body() createQuestionDto: CreateQuestionDto
    ) {
    const user = (req as any).user; 
    const user_id = user['user_id'];
    return this.questionService.create(user_id, createQuestionDto);
  }
}
