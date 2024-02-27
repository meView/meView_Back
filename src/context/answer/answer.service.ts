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
      // 질문지를 작성한 유저의 정보를 가져오기 위해 해당 테이블에 PK로 조회
      // 조회시 작성자의 이름정보가 필요하기 때문에 user의 user_nickname을 가져옴
      const answer = await this.prismaService.sWYP_Question.findUnique({
        where: {
          question_id,
        },
        select: {
          question_id: true,
          question_title: true,
          question_target: true,
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
  // 질문지를 작성한 유저가 데이터를 보내면 SWYP_Response 테이블에 작성자의 정보가 입력
  // 작성자의 정보가 정상적으로 입력되면 넘어온 reviewData를 SWYP_Review 테이블에 저장
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

      await this.prismaService.$transaction(async (prisma) => {
        // SWYP_Response 테이블에 어떤 질문지에 누가 응답했는지 저장
        const createResponse = await prisma.sWYP_Response.create({
          data: {
            user_id,
            question_id,
            response_title,
            response_responder,
          },
        });

        // chip, review_type, review_description 정보가 최대 6개까지 들어오기 때문에
        // 최대 6번 반복문 실행
        await Promise.all(
          reviewData.map((e) =>
            prisma.sWYP_Review.create({
              data: {
                response_id: createResponse.response_id, // createResponse의 값을 바로 가져와서 사용
                review_type: e.review_type,
                review_description: e.review_description,
                user_id,
                question_id,
                chip_id: e.chip_id,
              },
            }),
          ),
        );
      });
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
