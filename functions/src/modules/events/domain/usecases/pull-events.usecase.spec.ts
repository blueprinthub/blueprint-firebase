import "reflect-metadata";
import {container} from "tsyringe";
import {Event, PlatformName} from "../entities";
import {EventRemoteRepositoryFactory}
  from "../repositories/remote/event.remote.repository.factory";
import {PullEventsUseCase} from "./pull-events.usecase";
import {testEvent} from "./__mocks__/event.mock";

describe("PullEvents", () => {
  const mockUid = "test-uid";
  const mockPlatform = PlatformName.GoogleCalendar;

  const eventsRepoMock = {
    add: jest.fn(),
    fetchLastFromPlatform: jest.fn(),
  };

  const remoteRepoMock={
    pull: jest.fn(),
  };

  const remoteFactoryMock: EventRemoteRepositoryFactory = {
    buildFor: jest.fn().mockReturnValue(remoteRepoMock),
  };

  let pullEventsUseCase: PullEventsUseCase;

  beforeEach(() => {
    container.register("EventLocalRepository", {useValue: eventsRepoMock});
    container.register("EventRemoteRepositoryFactory", {
      useValue: remoteFactoryMock,
    });
    pullEventsUseCase = container.resolve(PullEventsUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(pullEventsUseCase).toBeDefined();
  });

  it("should pull and save the events", async () => {
    const events = Array<Event>(5).fill(testEvent);
    remoteRepoMock.pull.mockReturnValue(events);

    await pullEventsUseCase.execute(mockPlatform, mockUid, "test-auth-id");
    expect(eventsRepoMock.add).toHaveBeenCalledWith(events, mockUid);
  });

  describe("should pass the last Task reference to pull function", () => {
    it("when task should pass the task", async () => {
      eventsRepoMock.fetchLastFromPlatform.mockReturnValueOnce(testEvent);
      await pullEventsUseCase.execute(mockPlatform, mockUid, "test-auth-id");
      expect(remoteRepoMock.pull)
        .toHaveBeenCalledWith(mockUid, "test-auth-id", testEvent);
    });

    it("if there is no events should call with undefined", async () => {
      eventsRepoMock.fetchLastFromPlatform.mockReturnValueOnce(undefined);
      await pullEventsUseCase.execute(mockPlatform, mockUid, "test-auth-id");
      expect(remoteRepoMock.pull)
        .toHaveBeenCalledWith(mockUid, "test-auth-id", undefined);
    });
  });
});
