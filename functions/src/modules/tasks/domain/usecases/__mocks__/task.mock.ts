import {PlatformName} from "../../entities/platform.enum";
import {Task} from "../../entities/task.entity";
import {User} from "../../entities/user.entity";

export const mockUser:User= {
  displayName: "Mock Username",
  permalink: "https://mocklinks.blueprint/user1",
  iconUrl: "https://mocklinks.blueprint/icon2",
};

export const mockTask:Task = {
  title: "Mock",
  description: "Mock Description",
  isCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  permalink: "https://mocklinks.blueprint/task1",
  startDate: new Date(),
  loggedTime: 0,
  priority: 1,
  project: {
    platformName: PlatformName.Jira,
    iconUrl: "https://mocklinks.blueprint/icon1",
    name: "Mock Project",
  },
  creator: mockUser,
  assigned: [mockUser],
};

