import { ClientResolvers } from './client/resolvers';
import { PageResolvers } from './page/resolvers';
import { ProfileResolvers } from './profile/resolvers';
import { ProjectResolvers } from './project/resolvers';
import { ReportResolvers } from './report/resolvers';
import { RoleResolvers } from './role/resolvers';
import { UserResolvers } from './user/resolvers';
import { TestResolvers } from './test/resolvers';

export const resolvers = [
  ClientResolvers,
  PageResolvers,
  ProfileResolvers,
  ProjectResolvers,
  ReportResolvers,
  RoleResolvers,
  UserResolvers,
  TestResolvers,
];
