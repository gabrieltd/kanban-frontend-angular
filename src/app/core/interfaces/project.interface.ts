import { Board } from './board.interface';
import { Membership } from './membership.interface';

export interface Project {
  id: string;
  title: string;
  description: string;
  boards: Board[];
  members: Membership[];
  createdAt: any;
}
