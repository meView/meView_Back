import { SWYP_QuestionTarget, SWYP_QuestionType } from '@prisma/client';

export class CreateQuestionDto {
  question_target: SWYP_QuestionTarget;
  question_title: string;
  question_type: SWYP_QuestionType;
}
