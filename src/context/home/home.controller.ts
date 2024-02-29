import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  HttpException,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import {
  DeleteQuestionDTO,
  UpdateQuestionDTO,
} from './dto/update-homeQuestion.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('questions')
  @UseGuards(AuthGuard)
  async getMyQuestionList(
    @Req() req: Request ) {
    const user_id = req.user['user_id'];
    return this.homeService.getMyQuestionList(user_id);
  }

  @Get('/question/:question_id')
  @UseGuards(AuthGuard)
  async getMyQuestionDetail(
    @Req() req: Request,
    @Param('question_id', ParseIntPipe) question_id: number ) {
      const user_id = req.user['user_id'];
      return this.homeService.getMyQuestionDetail(user_id, question_id);
  }

  @Put('question/update/:question_id')
  @UseGuards(AuthGuard)
  async updateQuestion(
    @Req() req: Request,
    @Param('question_id', ParseIntPipe) question_id: number,
    @Body(new ValidationPipe()) data: UpdateQuestionDTO,
  ) {
    const user_id = req.user['user_id'];
    return await this.homeService.updateQuestion(user_id, question_id, data);
  }

  @Put('question/delete/:question_id')
  @UseGuards(AuthGuard)
  async updateQuestionIsUsed(
    @Req() req: Request,
    @Param('question_id', ParseIntPipe) question_id: number,
    @Body(new ValidationPipe()) data: DeleteQuestionDTO,
  ) {
    const user_id = req.user['user_id'];
    return await this.homeService.deleteQuestion(user_id, question_id, data);
  }
}
