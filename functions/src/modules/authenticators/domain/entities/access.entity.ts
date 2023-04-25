import {UserData} from "./user-data.entity";

export interface Access{
  accessToken:string
  refreshToken?:string;
  platformName:string;
  user:UserData;
}
