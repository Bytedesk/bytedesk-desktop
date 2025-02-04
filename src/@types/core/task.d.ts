// 
declare namespace TASK {

  type Task = {
    id: number;
    text?: string;
    done?: boolean;
  };

  type TaskAction = {
    type: string;
    id?: number;
    text?: string;
    task?: Task;
  };

}

