import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CapabilityService } from './capability.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { CapabilityValidationPipe } from './pipes/capability-validation.pipe';

@Controller('meview/capability')
export class CapabilityController {
  constructor(private readonly capabilityService: CapabilityService) {}

  // 내 강점
  @Get('strength')
  @UseGuards(AuthGuard)
  async getMyStrength(@Req() req: Request) {
    const user_id = req.user['user_id'];
    return this.capabilityService.getMyCapabilities(user_id, 'STRENGTH');
  }

  // 내 약점
  @Get('weakness')
  @UseGuards(AuthGuard)
  async getMyWeakness(@Req() req: Request) {
    const user_id = req.user['user_id'];
    return this.capabilityService.getMyCapabilities(user_id, 'WEAKNESS');
  }

  // 내 강점 / 칩 선택
  @Get('strength/:chip_name')
  @UseGuards(AuthGuard)
  async getStrengthChip(
    @Req() req: Request,
    @Param('chip_name', CapabilityValidationPipe) chip_name,
  ) {
    const user_id = req.user['user_id'];
    return this.capabilityService.getCapabilityChips(
      user_id,
      chip_name,
      'STRENGTH',
    );
  }

  // 내 약점 / 칩 선택
  @Get('weakness/:chip_name')
  @UseGuards(AuthGuard)
  async getWeaknessChip(
    @Req() req: Request,
    @Param('chip_name', CapabilityValidationPipe) chip_name,
  ) {
    const user_id = req.user['user_id'];
    return this.capabilityService.getCapabilityChips(
      user_id,
      chip_name,
      'WEAKNESS',
    );
  }

  // 닉네임별 자세한 리뷰
  @Get('both/:question_id/:response_responder')
  @UseGuards(AuthGuard)
  async getBoth(
    @Param('question_id', ParseIntPipe) question_id,
    @Param('response_responder') response_responder: string,
  ) {
    return this.capabilityService.getBoth(question_id, response_responder);
  }
}
