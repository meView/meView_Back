import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import {
  DeleteQuestionDTO,
  UpdateQuestionDTO,
} from './dto/update-homeQuestion.dto';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { MyQuestionDetailDto, MyQuestionListDto } from './dto/select-home.dto';

@Injectable()
export class HomeService {
  constructor(private prismaService: PrismaService) {}

  // 나의 질문지 목록 가져오기
  async getMyQuestionList(user_id: number): Promise<MyQuestionListDto[]> {
    try {
      const questions = await this.prismaService.sWYP_Question.findMany({
        where: {
          user_id,
          is_used: true,
        },
        select: {
          question_id: true,
          question_title: true,
        },
      });

      return questions;
    } catch (error) {
      throw new HttpException(
        '서버 오류입니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 나의 질문지 상세보기
  async getMyQuestionDetail(
    user_id: number,
    question_id: number,
  ): Promise<MyQuestionDetailDto> {
    try {
      const questionDetail = await this.prismaService.sWYP_Question.findUnique({
        where: {
          user_id,
          question_id,
          is_used: true,
        },
        select: {
          question_id: true,
          question_type: true,
          question_target: true,
          question_title: true,
        },
      });

      return questionDetail;
    } catch (error) {
      throw new HttpException(
        '서버 오류입니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateQuestion(
    user_id: number,
    question_id: number,
    data: UpdateQuestionDTO,
  ): Promise<UpdateQuestionDTO> {
    try {
      await this.prismaService.sWYP_Question.findUniqueOrThrow({
        where: { question_id, user_id, is_used: true },
      });

      const updatedQuestion = await this.prismaService.sWYP_Question.update({
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
      await this.prismaService.sWYP_Question.findUniqueOrThrow({
        where: { question_id, user_id, is_used: true },
      });

      const deletedQuestion = await this.prismaService.sWYP_Question.update({
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
