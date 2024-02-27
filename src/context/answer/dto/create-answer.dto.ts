import { SWYP_ReviewType } from '@prisma/client';

interface ReviewData {
  review_type: SWYP_ReviewType;
  review_description: string;
  chip_id: number;
}

export class CreateAnswerDto {
  user_id: number;
  question_id: number;
  response_title: string;
  response_responder: string;
  review_data: ReviewData[];
}
