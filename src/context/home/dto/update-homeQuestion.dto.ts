import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsDefined,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import { SWYP_QuestionTarget, SWYP_QuestionType } from '@prisma/client';

export class UpdateQuestionDTO {
  @IsNotEmpty()
  @IsEnum(SWYP_QuestionTarget)
  question_target: SWYP_QuestionTarget;

  @IsNotEmpty()
  @IsEnum(SWYP_QuestionType)
  question_type: SWYP_QuestionType;

  @IsNotEmpty()
  @IsString()
  question_title: string;
}

export class DeleteQuestionDTO {
  @IsNotEmpty()
  @IsBoolean()
  is_used: boolean;
}
