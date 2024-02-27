import { HttpException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { SelectProjectDTO } from './dto/select-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private PrismaService: PrismaService) {}
  create(createProjectDto: CreateProjectDto) {
    return 'This action adds a new project';
  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  async getMyProjects(
    user_id: number,
    sort: 'asc' | 'desc',
  ): Promise<SelectProjectDTO[] | null> {
    try {
      // question & question 에 대한 response 가져오기
      const questionWithResponse =
        await this.PrismaService.sWYP_Question.findMany({
          where: { user_id, is_used: true },
          orderBy: { question_created_at: sort },
          select: {
            question_id: true,
            question_title: true,
            responses: {
              where: { user_id: user_id },
              select: {
                response_id: true,
              },
            },
          },
        });

      // response count 구하기
      const questionWithResponseCountAndTotal = questionWithResponse.map(
        (question) => {
          const count = question.responses.length;
          return {
            question_id: question.question_id,
            question_title: question.question_title,
            count,
          };
        },
      );

      return questionWithResponseCountAndTotal;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new HttpException('서버 오류', 404);
    }
  }
}
