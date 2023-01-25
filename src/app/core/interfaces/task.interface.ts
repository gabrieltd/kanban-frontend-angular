export interface Task {
  id: string;
  description: string;
  color: 'red' | 'blue' | 'yellow' | 'purple' | 'orange' | 'green' | 'pink';
  priority: number;
  boardId: string;
}
