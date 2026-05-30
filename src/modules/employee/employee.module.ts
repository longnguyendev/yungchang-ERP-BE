import { PrismaService } from '@/prisma.service';
import { Module } from '@nestjs/common';

import { EmployeeResolver } from './employee.resolver';
import { EmployeeService } from './employee.service';

@Module({
  providers: [EmployeeResolver, EmployeeService, PrismaService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
