import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

/**
 * @description
 * The UsersModule is responsible for handling all user-related operations.
 * It includes controllers and services for managing user accounts, authentication, and authorization.
 * It uses TypeORM for database operations and provides a repository for user entities.
 * @export
 * @class UsersModule
 */

@Module({
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
