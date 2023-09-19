import "reflect-metadata";
import {container} from "tsyringe";
import {Event, PlatformName} from "../entities";
import {EventRemoteRepositoryFactory} from "../repositories/remotes/event.remote.repository.factory";

describe("PullTasks", () => {
  const mockUid = "test-uid";
  const mockPlatform = PlatformName.GoogleCalendar;

  const tasksRepoMock = {
    add: jest.fn(),
    fetchLastFromPlatform: jest.fn(),
  };

  const remoteRepoMock={
    pull: jest.fn(),
  };

  const remoteFactoryMock: EventRemoteRepositoryFactory = {
    buildFor: jest.fn(function() {
      return remoteRepoMock;
    }),
  };

  let pullTasks: PullTasks;

  beforeEach(() => {
    container.register("TasksRepository", {useValue: tasksRepoMock});
    container.register("RemoteRepositoryFactory", {
      useValue: remoteFactoryMock,
    });
    pullTasks = container.resolve(PullTasks);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(pullTasks).toBeDefined();
  });

  it("should pull and save the tasks", async () => {
    const tasks = Array<Task>(5).fill(mockTask);
    remoteRepoMock.pull.mockReturnValue(tasks);

    await pullTasks.execute(mockPlatform, mockUid, "test-auth-id");
    expect(tasksRepoMock.add).toHaveBeenCalledWith(tasks, mockUid);
  });

  describe("should pass the last Task reference to pull function", () => {
    it("when task should pass the task", async () => {
      tasksRepoMock.fetchLastFromPlatform.mockReturnValueOnce(mockTask);
      await pullTasks.execute(mockPlatform, mockUid, "test-auth-id");
      expect(remoteRepoMock.pull)
        .toHaveBeenCalledWith(mockUid, "test-auth-id", mockTask);
    });

    it("if there is no tasks should call with undefined", async () => {
      tasksRepoMock.fetchLastFromPlatform.mockReturnValueOnce(undefined);
      await pullTasks.execute(mockPlatform, mockUid, "test-auth-id");
      expect(remoteRepoMock.pull)
        .toHaveBeenCalledWith(mockUid, "test-auth-id", undefined);
    });
  });
});
