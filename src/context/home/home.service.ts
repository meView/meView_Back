import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
          user_id
        },
        select: {
          question_id: true,
          question_title: true,
        }
      })

      return questions;
    } catch (error) {
      throw new HttpException(
        '서버 오류입니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 나의 질문지 상세보기
  async getMyQuestionDetail(user_id: number, question_id: number): Promise<MyQuestionDetailDto> {
    try {
      const questionDetail = await this.prismaService.sWYP_Question.findUnique({
        where: {
          user_id,
          question_id
        },
        select: {
          question_id: true,
          question_type: true,
          question_target: true,
          question_title: true
        }
      })

      return questionDetail;
    } catch (error) {
      throw new HttpException(
        '서버 오류입니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
