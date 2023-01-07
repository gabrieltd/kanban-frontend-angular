import { Task } from './task.interface';

export interface Board {
  id: string;
  title: string;
  priority: number;
  tasks: Task[];
}
