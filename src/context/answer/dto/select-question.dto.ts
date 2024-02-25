export class SelectQuestionDTO {
  question_id: number;
  question_title: string;
  user_id: number;
  user: {
    user_nickname: string;
  };
}
