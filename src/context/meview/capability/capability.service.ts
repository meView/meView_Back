import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { SWYP_ChipName, SWYP_ReviewType } from '@prisma/client';
import { ChipNameMapping, ChipNames } from './dto/capability-mapping';
import { CapabilityChipDto } from './dto/capability-chip.dto';
import { CapabilityBothDto } from './dto/capability-both.dto';
import { CapabilityDto } from './dto/capability.dto';

@Injectable()
export class CapabilityService {
  constructor(private prismaService: PrismaService) {}

  // 내 강약점에 대한 수량 파악
  async getMyCapabilities(
    user_id: number,
    review_type: SWYP_ReviewType,
  // ): Promise<CapabilityDto> {
  ): Promise<any> {
    try {
      // 해당 유저에게 작성된 답변지 중 강약점에 대한 정보만 가져오기
      const chips = await this.prismaService.sWYP_Review.findMany({
        where: {
          review_type,
          user_id,
          question: {
            is_used: true,
          }
        },
        select: {
          chip_id: true,
        }
      });

      // 가져온 강약점에서 데이터를 칩 이름 : 칩 개수 형태로 변환
      // const result = chips.reduce((acc, curr) => {
      //   const cnt = acc[curr.chip_id] || 0;
      //   acc[curr.chip_id] = cnt + 1;
      //   return acc;
      // },{});

      // 데이터베이스에서 가져올때 영어로 되있는 chip name을 한글로 바꾸기 위해 reduce 메소드사용
      // "판단력" = 0 이런식으로 변환
      // --> 칩 이름을 한글로 변경한부분 통일성을 위해 영어로 다시 변환
      // --> 기존 Record<string, number>에서 통일성을 위해 dto로 변경
      // --> reduce에 의해 생성된 객체는 동적으로 키를 가지는데 결과가 반환되는 시점에 필요한 모든 키가 포함되있다는걸 보장하지 않아 타입 오류가 발생
      // --> 그렇기 때문에 무조건 이 타입으로 반환될거다 라고 타입을 단언
      const transformResults = chips.reduce((acc, curr) => {
        const key = Object.values(curr).toString();
        const translatedKey = ChipNames[key];
        const cnt = acc[translatedKey] || 0;
        acc[translatedKey] = cnt + 1;
        return acc;
      }, {
        "JUDGMENT": 0,
        "OBSERVATION": 0,
        "LISTENING": 0,
        "COMMUNICATION": 0,
        "FRIENDLINESS": 0,
        "EXECUTION": 0,
        "PERSEVERANCE": 0,
      } as CapabilityDto);

      return transformResults;
    } catch (error) {
      throw new HttpException(
        '서버 오류입니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 선택한 칩에 대한 답변지 정보를 가져옴
  async getCapabilityChips(
    user_id: number,
    chip_name: SWYP_ChipName,
    review_type: SWYP_ReviewType,
  ): Promise<CapabilityChipDto[]> {
    try {
      const reviews = await this.prismaService.sWYP_Review.findMany({
        where: {
          user_id,
          review_type,
          chip: {
            chip_name,
          },
          question: {
            is_used: true,
          }
        },
        select: {
          review_description: true,
          response: {
            select: {
              question_id: true,
              response_title: true,
              response_responder: true,
            },
          },
        },
      });

      // 데이터를 가져올때 중첩 객체로 가져오기 때문에 데이터를 가공하기 위해 사용
      const transformReviews = reviews.map((review) => ({
        question_id: review.response.question_id,
        review_description: review.review_description,
        response_title: review.response.response_title,
        response_responder: review.response.response_responder,
      }));

      return transformReviews;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        '서버 오류입니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 해당 프로젝트를 작성한 답변자가 작성한 강점과 약점에 대한 모든 정보 조회
  // ? 어떻게 값이 리턴됨
  async getBoth(
    question_id: number,
    response_responder: string,
  ): Promise<CapabilityBothDto> {
    try {
      // 해당 작성자가 작성한 강약점에 대한 정보를 가져옴
      const both = await this.prismaService.sWYP_Review.findMany({
        where: {
          question_id,
          response: {
            response_responder,
          },
          question: {
            is_used: true,
          }
        },
        select: {
          question_id: true,
          review_description: true,
          review_type: true,
          response: {
            select: {
              response_responder: true,
            },
          },
          chip: {
            select: {
              chip_name: true,
            },
          },
        },
      });

      // 답변에 대한 강점과 약점을 분류
      const transformBoths = both.reduce(
        (acc, curr) => {
          acc[curr.review_type] = acc[curr.review_type] || [];

          if (acc[curr.review_type].length < 2) {
            acc[curr.review_type].push({
              question_id: curr.question_id,
              review_description: curr.review_description,
              chip_name: curr.chip.chip_name,
            });
          }

          return acc;
        },
        {
          STRENGTH: [],
          WEAKNESS: [],
        },
      );

      return { ...transformBoths, response_responder };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        '서버 오류입니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
