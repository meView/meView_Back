import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { CreateAnswerDTO } from './dto/create-answer.dto';
import { SWYP_User, SWYP_Question } from '@prisma/client';
import { SelectQuestionDTO } from './dto/select-question.dto';
import { CreateReviewDTO } from './dto/create-review.dto';

@Injectable()
export class AnswerService {
  constructor(private prismaService: PrismaService) {}

  // 질문지 호출
  async getAnswer(question_id: number): Promise<SelectQuestionDTO> {
    try {
      const answer = await this.prismaService.sWYP_Question.findUnique({
        where: {
          question_id,
        },
        select: {
          question_id: true,
          question_title: true,
          user_id: true,
          user: {
            select: {
              user_nickname: true,
            },
          },
        },
      });

      if (!answer) {
        throw new Error('존재하지 않는 게시물입니다.');
      }

      return answer;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        '서버 오류입니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 작성된 답변 저장
  async writeAnswer(
    createAnswerDTO: CreateAnswerDTO,
  ): Promise<{ message: string }> {
    try {
      const {
        user_id,
        question_id,
        response_title,
        response_responder,
        reviewData,
      } = createAnswerDTO;

      const createResponse = await this.prismaService.sWYP_Response.create({
        data: {
          user_id,
          question_id,
          response_title,
          response_responder,
        },
      });

      await Promise.all(
        reviewData.map((e) =>
          this.prismaService.sWYP_Review.create({
            data: {
              response_id: createResponse.response_id,
              review_type: e.review_type,
              review_description: e.review_description,
              user_id,
              question_id,
              chip_id: e.chip_id,
            },
          }),
        ),
      );

      return { message: '답변이 성공적으로 저장되었습니다.' };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        '서버 오류입니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
