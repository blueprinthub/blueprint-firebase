import {Label} from "../../entities/label.entity";
import {PlatformName} from "../../entities/platform.enum";
import {Project} from "../../entities/project.entity";
import {Task} from "../../entities/task.entity";
import {User} from "../../entities/user.entity";

export const mockUser: User = {
  displayName: "Mock Username",
  platformURL: new URL("https://mocklinks.blueprint/user1"),
  avatarUrl: "https://mocklinks.blueprint/icon2",
};

export const mockLabel: Label = {
  name: "Completed",
  colorHex: "#000000",
};

const mockProject: Project = {
  id: "1234567890",
  platformId: "1234567890",
  platformURL: new URL("https://jira.com/1234567890"),
  platformName: PlatformName.Jira,
  name: "Blueprint",
  description: "Blueprint project",
  iconUrl: "https://jira.com/1234567890/icon.png",
  colorHex: "#000000",
  owner: "John Doe",
  slug: "blueprint",
};


export const mockTask: Task = {
  createdAt: new Date(1990, 5, 12),
  updatedAt: new Date(1990, 5, 12),
  id: "1234567890",
  project: mockProject,
  taskURL: new URL(
    "https://jira.com/1234567890/1234567890"
  ),
  isCompleted: false,
  title: "Blueprint task",
  description: "Blueprint task description",
  startDate: new Date(1990, 5, 12),
  dueDate: new Date(1990, 5, 12),
  estimatedTime: 3600,
  loggedTime: 1800,
  assigned: [mockUser],
  creator: mockUser,
  priority: 1,
  labels: [mockLabel],
};

