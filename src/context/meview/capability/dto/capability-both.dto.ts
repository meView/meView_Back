// if (acc[curr.review_type].length < 2) {
//   acc[curr.review_type].push({
//     question_id: curr.question_id,
//     review_description: curr.review_description,
//     response_responder: curr.response.response_responder,
//     chip: curr.chip.chip_name
//   });
// }
export interface CapabilityBoths {
  question_id: number;
  review_description: string;
  chip_name: string;
}

export class CapabilityBothDto {
  response_responder: string;
  STRENGTH: CapabilityBoths[];
  WEAKNESS: CapabilityBoths[];
}

// "STRENGTH": [
//   {
//     "question_id": 7,
//     "review_description": "seven",
//     "response_responder": "seven",
//     "chip": "JUDGMENT"
//   },
//   {
//     "question_id": 7,
//     "review_description": "seven",
//     "response_responder": "seven",
//     "chip": "OBSERVATION"
//   }
// ],
// "WEAKNESS": [
//   {
//     "question_id": 7,
//     "review_description": "seven",
//     "response_responder": "seven",
//     "chip": "LISTENING"
//   }
// ]
// },