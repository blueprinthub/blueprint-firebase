import "reflect-metadata";
import {container} from "tsyringe";
import {TasksRepository} from "../repositories/tasks.repository";
import {AddTask} from "./add-task.usecase";
import {mockTask} from "./__mocks__/task.mock";

describe("AddTask", () => {
  const mockUid = "test-uid";


  const tasksRepoMock:TasksRepository = {
    add: jest.fn(),
    fetchLastFromPlatform: jest.fn(),
  };

  let addTask: AddTask;

  beforeEach(() => {
    container.register("TasksRepository", {useValue: tasksRepoMock});
    addTask = container.resolve(AddTask);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(addTask).toBeDefined();
  });

  it("should add the task", async () => {
    await addTask.execute(mockTask, mockUid);
    expect(tasksRepoMock.add).toHaveBeenCalled;
  });

  it("should call the add method with a list", async () => {
    await addTask.execute(mockTask, mockUid);
    expect(tasksRepoMock.add).toHaveBeenCalledWith([mockTask], mockUid);
  });
});
