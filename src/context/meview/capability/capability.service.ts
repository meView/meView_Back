import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { SWYP_ChipName, SWYP_ReviewType } from '@prisma/client';
import { ChipNameMapping } from './dto/capability-mapping';
import { CapabilityChipDto } from './dto/capability-chip.dto';

@Injectable()
export class CapabilityService {
  constructor(private prismaService: PrismaService) {}

  // 내 강약점에 대한 수량 파악
  async getMyCapabilities(user_id: number, review_type: SWYP_ReviewType): Promise<Record<string, number>> {
    try {
      // 해당 유저에게 작성된 답변지 중 강약점에 대한 정보만 가져오기
      const chips = await this.prismaService.sWYP_Chip.findMany({
        select: {
          chip_name: true,
          reviews: {
            where: {
              review_type,
              user_id
            }
          }
        }
      });

      // 가져온 강약점에서 데이터를 칩 이름 : 칩 개수 형태로 변환
      const result = chips.map(chip => ({
        [ chip.chip_name ]: chip.reviews.length
      }));

      // 데이터베이스에서 가져올때 영어로 되있는 chip name을 한글로 바꾸기 위해 reduce 메소드사용
      // "판단력" = 0 이런식으로 변환
      const transformResults = result.reduce((acc, curr) => {
          const key = Object.keys(curr)[0] as SWYP_ChipName; 
          const translatedKey = ChipNameMapping[key]; 
          acc[translatedKey] = curr[key]; 
          return acc;
        }, {});

      return transformResults;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        '서버 오류입니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 선택한 칩에 대한 답변지 정보를 가져옴
  async getCapabilityChips(user_id: number, chip_name: SWYP_ChipName, review_type: SWYP_ReviewType): Promise<CapabilityChipDto[]>{
    try {
      const reviews = await this.prismaService.sWYP_Review.findMany({
        where: {
          user_id,
          review_type,
          chip: {
            chip_name
          },
        },
        select: {
          review_description: true,
          response: {
            select: {
              question_id: true,
              response_title: true,
              response_responder: true
            }
          }
        }
      });

      // 데이터를 가져올때 중첩 객체로 가져오기 때문에 데이터를 가공하기 위해 사용
      const transformReviews = reviews.map(review => ({
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
  async getBoth(question_id: number, response_responder: string) {
    try {
      const both = await this.prismaService.sWYP_Review.findMany({
        where: {
          question_id,
          response: {
            response_responder
          }
        },
        select: {
          question_id: true,
          review_description: true,
          review_type: true,
          response: {
            select: {
              response_responder: true
            }
          },
          chip: {
            select: {
              chip_name: true
            }
          }
        }
      })

      console.log(both)

      const transformBoths = both.reduce((acc, curr) => {
        acc[curr.review_type] = acc[curr.review_type] || [];

        if (acc[curr.review_type].length < 2) {
          acc[curr.review_type].push({
            question_id: curr.question_id,
            review_description: curr.review_description,
            response_responder: curr.response.response_responder,
            chip: curr.chip.chip_name
          });
        }

        return acc;
      },{})

      return transformBoths;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        '서버 오류입니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
