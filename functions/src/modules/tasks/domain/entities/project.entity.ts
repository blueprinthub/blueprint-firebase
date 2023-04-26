import {PlatformName} from "./platform.enum";

export interface Project {
  platformName:PlatformName;
  name:string;
  description?:string
  iconUrl:string;
}
