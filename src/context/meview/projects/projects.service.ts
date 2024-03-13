import { HttpException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { SelectProjectDTO } from './dto/select-project.dto';
import { SelectEvaluationOfOneProjectDTO } from './dto/select-evaluationOfOneProject.dto';

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
    sort: 'oldest' | 'newest',
  ): Promise<SelectProjectDTO[] | null> {
    try {
      // question & question 에 대한 response 가져오기
      const sortedType = sort === 'oldest' ? 'asc' : 'desc';
      const questionWithResponse =
        await this.PrismaService.sWYP_Question.findMany({
          where: { user_id, is_used: true },
          orderBy: { question_created_at: sortedType },
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

  async getMyEvaluationOfOneProject(
    user_id: number,
    evaluation: 'STRENGTH' | 'WEAKNESS',
    question_id: number,
    sort: 'oldest' | 'newest',
  ): Promise<SelectEvaluationOfOneProjectDTO[] | null> {
    try {
      const sortedType = sort === 'oldest' ? 'asc' : 'desc';
      const questionWithResponse =
        await this.PrismaService.sWYP_Question.findUnique({
          where: { question_id, user_id, is_used: true },
          select: {
            responses: {
              where: { user_id, question_id },
              orderBy: { user_id: sortedType },
              select: {
                response_id: true,
                response_responder: true,
                reviews: {
                  where: { review_type: evaluation },
                  select: {
                    review_type: true,
                    review_description: true,
                    chip_id: true,
                    chip: {
                      select: {
                        chip_name: true,
                        chip_id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

      const mappedDataDTO: SelectEvaluationOfOneProjectDTO[] =
        questionWithResponse.responses.map((response) => {
          return {
            response_responder: response.response_responder,
            review_type: evaluation,
            reviews: response.reviews.map((review) => ({
              chip_id: review.chip.chip_id,
              chip_name: review.chip.chip_name,
              review_description: review.review_description,
            })),
          };
        });

      return mappedDataDTO;
    } catch (error) {
      throw new HttpException('Internal Server Error', 404);
    }
  }
}
