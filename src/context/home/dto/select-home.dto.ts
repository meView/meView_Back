import { SWYP_QuestionTarget, SWYP_QuestionType } from '@prisma/client';

export class MyQuestionListDto {
  question_id: number;
  question_title: string;
}

export class MyQuestionDetailDto {
  question_id: number;
  question_type: SWYP_QuestionType;
  question_target: SWYP_QuestionTarget;
  question_title: string;
}
