import {Priority} from "./priority.entity";
import {Project} from "./project.entity";
import {User} from "./user.entity";

export interface Task{
  title:string;
  estimatedTime?:number; // time in milliseconds
  description:string;
  isCompleted:boolean;
  createdAt?:Date;
  updatedAt?:Date;
  dueDate?:Date
  permalink:string;
  startDate:Date;
  loggedTime:number; // time in milliseconds
  priority:Priority;
  project:Project
  creator:User;
  assigned:User[];
}
