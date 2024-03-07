import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { PrismaService } from 'src/db/prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private prismaService: PrismaService) {}

  async create(
    user_id: number,
    createQuestionDto: CreateQuestionDto,
  ): Promise<CreateQuestionDto> {
    try {
      const { question_target, question_title, question_type } =
        createQuestionDto;

      const response = await this.prismaService.sWYP_Question.create({
        data: {
          question_target,
          question_title,
          question_type,
          user_id,
        },
      });

      return response;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Server error.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
