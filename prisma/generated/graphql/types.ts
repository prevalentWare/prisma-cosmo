import { gql } from 'apollo-server-micro';
import { ClientTypes } from './client/types';
import { PageTypes } from './page/types';
import { ProfileTypes } from './profile/types';
import { ProjectTypes } from './project/types';
import { ReportTypes } from './report/types';
import { RoleTypes } from './role/types';
import { UserTypes } from './user/types';
import { TestTypes } from './test/types';
import { GQLEnums } from './enums';

const genericTypes = gql`
  scalar DateTime
`;

export const types = [
  genericTypes,
  GQLEnums,
  ClientTypes,
  PageTypes,
  ProfileTypes,
  ProjectTypes,
  ReportTypes,
  RoleTypes,
  UserTypes,
  TestTypes,
];
