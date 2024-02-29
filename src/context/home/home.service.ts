import { HttpException, Injectable } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import {
  DeleteQuestionDTO,
  UpdateQuestionDTO,
} from './dto/update-homeQuestion.dto';
import { PrismaService } from 'src/db/prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private PrismaService: PrismaService) {}
  create(createHomeDto: CreateHomeDto) {
    return 'This action adds a new home';
  }

  findAll() {
    return `This action returns all home`;
  }

  findOne(id: number) {
    return `This action returns a #${id} home`;
  }

  update(id: number, updateHomeDto: UpdateHomeDto) {
    return `This action updates a #${id} home`;
  }

  remove(id: number) {
    return `This action removes a #${id} home`;
  }

  async updateQuestion(
    user_id: number,
    question_id: number,
    data: UpdateQuestionDTO,
  ): Promise<UpdateQuestionDTO> {
    try {
      await this.PrismaService.sWYP_Question.findUniqueOrThrow({
        where: { question_id, user_id },
      });

      const updatedQuestion = await this.PrismaService.sWYP_Question.update({
        where: { question_id, user_id },
        data: {
          question_target: data.question_target,
          question_type: data.question_type,
          question_title: data.question_title,
        },
      });

      return updatedQuestion;
    } catch (error) {
      throw new HttpException('Bad Request', 400);
    }
  }

  async deleteQuestion(
    user_id: number,
    question_id: number,
    data: DeleteQuestionDTO,
  ): Promise<DeleteQuestionDTO> {
    try {
      await this.PrismaService.sWYP_Question.findUniqueOrThrow({
        where: { question_id, user_id },
      });

      const deletedQuestion = await this.PrismaService.sWYP_Question.update({
        where: { question_id, user_id },
        data: {
          is_used: data.is_used,
        },
      });

      return deletedQuestion;
    } catch (error) {
      throw new HttpException('Bad Request', 400);
    }
  }
}
