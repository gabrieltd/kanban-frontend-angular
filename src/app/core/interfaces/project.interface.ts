import { Board } from './board.interface';

export interface Project {
  id: string;
  title: string;
  description: string;
  boards: Board[];
}
