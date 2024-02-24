import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { SWYP_User } from '@prisma/client';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private PrismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<SWYP_User> {
    try {
      // 이미 데이터베이스에 있는 경우
      const existingUser = await this.PrismaService.sWYP_User.findUnique({
        where: { user_email: createUserDto.user_email },
      });

      // TODO: 유저가 이미 있는 경우 처리 방법 수정 예정, 현재는 어떤 행동도 안함.
      if (existingUser) {
        console.log('User already exists: ', existingUser);
        return;
      }

      // 없는 경우 생성
      const createdUser = await this.PrismaService.sWYP_User.create({
        data: createUserDto,
      });

      return createdUser;
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(fields: Partial<UserDto>): Promise<UserDto | undefined> {
    try {
      const user = await this.PrismaService.sWYP_User.findUnique({
        where: {
          user_email: fields.user_email,
        },
      });

      return user;
    } catch (error) {
      throw new HttpException('Not Found', 404);
    }
  }
}
