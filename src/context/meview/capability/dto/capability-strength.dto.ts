export interface CapabilityStrength {
  판단력: number;
  관찰력: number;
  경청능력: number;
  소통능력: number;
  친화력: number;
  실행력: number;
  끈기력: number;
}

export class CapabilityStrengthDto {
  chip_names: CapabilityStrength[]
}