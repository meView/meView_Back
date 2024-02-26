import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CapabilityService } from './capability.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { SWYP_ReviewType } from '@prisma/client';

@Controller('meview/capability')
export class CapabilityController {
  constructor(private readonly capabilityService: CapabilityService) {}

  @Get('strength')
  @UseGuards(AuthGuard)
  async getMyStrength(@Req() req: Request) {
    const user_id = req.user['user_id'];
    const review_type = req.url.split('/').pop().toUpperCase() as SWYP_ReviewType;
    return this.capabilityService.getMyCapabilitys(user_id, review_type);
  }

  @Get('weakness')
  @UseGuards(AuthGuard)
  async getMyWeakness(@Req() req: Request) {
    const user_id = req.user['user_id'];
    const review_type = req.url.split('/').pop().toUpperCase() as SWYP_ReviewType;
    return this.capabilityService.getMyCapabilitys(user_id, review_type);
  }


}
