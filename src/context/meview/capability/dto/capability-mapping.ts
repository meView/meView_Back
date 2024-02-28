import { SWYP_ChipName } from "@prisma/client";

export const ChipNameMapping: Record<SWYP_ChipName, string> = {
  JUDGMENT: "판단력",
  OBSERVATION: "관찰력",
  LISTENING: "경청능력",
  COMMUNICATION: "소통능력",
  FRIENDLINESS: "친화력",
  EXECUTION: "실행력",
  PERSEVERANCE: "끈기력",
};