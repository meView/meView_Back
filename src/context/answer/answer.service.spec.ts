import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

describe('AnswerService', () => {
  let controller: AnswerController;
  let service: AnswerService;
  let createAnswerDto: CreateAnswerDto;
  let prismaService: PrismaService;

  describe('getAnswer', () => {

  // 질문지 호출 테스트 코드
  beforeEach(async () => {
    // Test.createTestingModule 메서드를 사용하여 테스트 모듈 생성
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerController],
      // 테스트 환경 설정을 하기위한 provider 설정
      // 테스트 대상이 되는 컨트롤러, 서비스 등을 프로바이더로 등록
      // 질문지 호출을 테스트 하기 위해 AnswerService를 호출
      providers: [
        AnswerService,
        {
          // 의존성 주입 및 모킹 설정
          // 실제 데이터베이스나 외부 API를 호출하는 대신 모킹된 객체를 사용하여 테스트
          provide: PrismaService,
          useValue: {
            // 질문지 호출 같은 경우 question_id 데이터를 요청하고 받아오기 때문에 
            // question_id로 조회를 했을때 넘어오는 데이터의 형식을 모킹
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
    }).compile(); // compile() 메소드를 호출하여 모듈을 컴파일하고 테스트에 사용할 인스턴스를 생성

    // module.get을 사용하여 테스트 모듈로 부터 컨트롤러 또는 서비스의 인스턴스를 얻어옴
    controller = module.get<AnswerController>(AnswerController);
    service = module.get<AnswerService>(AnswerService);
  });

  it('should return question details for a given question_id', async () => {
    const question_id = 1;
    const response = await controller.getAnswer(question_id);

    console.log(response);

    // expect: 예외처리
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

// 작성된 답변 저장 테스트
describe('writeAnswer', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn().mockImplementation(async (callback) => {
              return callback({
                sWYP_Response: {
                  // response 테이블에 데이터가 저장됬을때 response_id를 바로 사용하기 때문에 해당 객체를 지정
                  create: jest.fn().mockResolvedValue({ response_id: 1 }),
                },
                sWYP_Review: {
                  create: jest.fn().mockResolvedValue(true),
                },
              });
            }),
          },
        },
      ],
    }).compile();


    service = module.get<AnswerService>(AnswerService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should save an answer successfully', async () => {
    const createAnswerDto: CreateAnswerDto = {
        user_id : 1,
        question_id : 1,
        response_title : "hihi",
        response_responder : "하이",
        review_data : [
            {
            review_type: "STRENGTH",
            review_description: "test",
            chip_id: 6
            },
            {
            review_type: "WEAKNESS",
            review_description: "test",
            chip_id: 2
            },
            {
            review_type: "WEAKNESS",
            review_description: "test",
            chip_id: 4
            }
        ]
    };

    const result = await service.writeAnswer(createAnswerDto);

    // toHaveBeenCalled: jest의 모킹 함수에 대한 검증 메소드로 $transaction이 호출되는지 확인
    expect(prismaService.$transaction).toHaveBeenCalled();
    expect(result).toEqual({ message: '답변이 성공적으로 저장되었습니다.' });
  });

  // 데이터 저장 중 트랜잭션이 실패 했을 경우에 대한 실패 시나리오
  it('should fail if there is an error saving review data', async () => {
    prismaService.$transaction = jest.fn().mockImplementationOnce(async (callback) => {
      const prismaMock = {
        sWYP_Response: {
          create: jest.fn().mockResolvedValue({ response_id: 1 }),
        },
        sWYP_Review: {
          create: jest.fn().mockRejectedValue(new Error('Mock Error')),
        },
      };
      return callback(prismaMock);
    });
  
    await expect(service.writeAnswer(createAnswerDto)).rejects.toThrow(HttpException);
    });
  })
})