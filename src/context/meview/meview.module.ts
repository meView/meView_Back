import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
// TODO: capability Module 추가
@Module({
  imports: [ProjectsModule],
})
export class MeviewModule {}
