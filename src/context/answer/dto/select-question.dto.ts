export class SelectQuestionDto {
  question_id: number;
  question_title: string;
  question_target: string;
  user_id: number;
  user: {
    user_nickname: string;
  };
}
