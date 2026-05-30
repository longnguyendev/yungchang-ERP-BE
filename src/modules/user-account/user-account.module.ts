import { PrismaService } from '@/prisma.service';
import { Module } from '@nestjs/common';

import { EmployeeModule } from '../employee/employee.module';
import { UserAccountResolver } from './user-account.resolver';
import { UserAccountService } from './user-account.service';

@Module({
  imports: [EmployeeModule],
  providers: [UserAccountResolver, UserAccountService, PrismaService],
  exports: [UserAccountService],
})
export class UserAccountModule {}
