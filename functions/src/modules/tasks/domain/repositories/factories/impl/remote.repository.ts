import {Task} from "../../../entities/task.entity";

export interface RemoteRepository{
  pull(uid:string, authenticatorId:string, lastPulledTask?:Task):Promise<Task[]>
}
