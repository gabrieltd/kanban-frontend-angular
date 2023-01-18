import { User } from './user.inferface';
export interface Membership {
  projectId: string;
  userId: string;
  canWrite: boolean;
  pending: boolean;
  user?: User;
}
