import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { TransformChipIdInterceptor } from '../../../interceptors/transformchipid.interceptor';

@Controller('meview/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getMyProjects(
    @Req() req: Request,
    @Query('sort') sort: 'oldest' | 'newest' = 'newest',
    // desc: 최신순, asc: 오래된 순
  ) {
    const user_id = req.user['user_id'];
    return await this.projectsService.getMyProjects(user_id, sort);
  }

  @Get('strength/:question_id')
  @UseGuards(AuthGuard)
  async getMyStrengthOfOneProject(
    @Req() req: Request,
    @Param('question_id', ParseIntPipe) question_id: number,
    @Query('sort') sort: 'oldest' | 'newest' = 'newest',
  ) {
    const user_id = req.user['user_id'];
    return await this.projectsService.getMyEvaluationOfOneProject(
      user_id,
      'STRENGTH',
      question_id,
      sort,
    );
  }

  @Get('weakness/:question_id')
  @UseGuards(AuthGuard)
  async getMyWeaknessOfOneProject(
    @Req() req: Request,
    @Param('question_id', ParseIntPipe) question_id: number,
    @Query('sort') sort: 'oldest' | 'newest' = 'newest',
  ) {
    const user_id = req.user['user_id'];
    return await this.projectsService.getMyEvaluationOfOneProject(
      user_id,
      'WEAKNESS',
      question_id,
      sort,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
