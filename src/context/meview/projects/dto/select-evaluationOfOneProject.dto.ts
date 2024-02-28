export class SelectEvaluationOfOneProjectDTO {
  response_responder: string;
  review_type: string;
  reviews: {
    chip_id: number;
    chip_name: string;
    review_description: string;
  }[];
}
