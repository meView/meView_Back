import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CapabilityStrengthDto } from './dto/capability-strength.dto';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { SWYP_ChipName, SWYP_ReviewType } from '@prisma/client';
import { chipNameMapping } from './dto/\bcapability-mapping';

@Injectable()
export class CapabilityService {
  constructor(private prismaService: PrismaService) {}

  // 내 강약점에 대한 수량 파악
  async getMyCapabilitys(user_id: number, review_type: SWYP_ReviewType): Promise<Record<string, number>> {
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

      // 가져온 강점에서 불필요한 데이터는 제거
      const result = chips.map(chip => ({
        [ chip.chip_name ]: chip.reviews.length
      }));

      // 데이터베이스에서 가져올때 영어로 되있는 chip name을 한글로 바꾸기 위해 reduce 메소드사용
      // "판단력" = 0 이런식으로 변환
      const transformResults = result.reduce((acc, curr) => {
          const key = Object.keys(curr)[0] as SWYP_ChipName; 
          const translatedKey = chipNameMapping[key]; 
          acc[translatedKey] = curr[key]; 
          return acc;
        }, {} as Record<string, number>);

      return transformResults;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        '서버 오류입니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
