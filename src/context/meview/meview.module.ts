import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { CapabilityModule } from './capability/capability.module';

@Module({
  imports: [ProjectsModule, CapabilityModule],
})
export class MeviewModule {}
