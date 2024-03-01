import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { PrismaService } from 'src/db/prisma/prisma.service';

describe('AnswerController', () => {
  let controller: AnswerController;
  let service: AnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerController],
      providers: [
        AnswerService,
        {
          provide: PrismaService,
          useValue: {
            sWYP_Question: {
              findUnique: jest.fn().mockResolvedValue({
                question_id: 1,
                question_title: '점심뭐먹음?',
                question_target: 'TEAM',
                user_id: 1,
                user: {
                  user_nickname: '미뷰어',
                },
              }),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<AnswerController>(AnswerController);
    service = module.get<AnswerService>(AnswerService);
  });

  it('should return question details for a given question_id', async () => {
    const questionId = 1;
    const response = await controller.getAnswer(questionId);

    expect(response).toEqual({
      question_id: 1,
      question_title: '점심뭐먹음?',
      question_target: 'TEAM',
      user_id: 1,
      user: {
        user_nickname: '미뷰어',
      },
    });
  });

  it('should throw an error if the question does not exist', async () => {
    jest.spyOn(service, 'getAnswer').mockRejectedValueOnce(new HttpException('존재하지 않는 게시물입니다.', HttpStatus.NOT_FOUND));

    await expect(controller.getAnswer(9999)).rejects.toThrow(HttpException);
  });
})