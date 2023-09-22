import "reflect-metadata";
import {container} from "tsyringe";


import {PullEventsController} from "./pull-events.controller";
import {PullEventsUseCase} from "../../domain/usecases/pull-events.usecase";

jest.mock("../../domain/usecases/pull-events.usecase");

describe("AddTaskViaApiKey", () => {
  let controller:PullEventsController;

  beforeEach(() => {
    container.register(PullEventsUseCase, {useClass: PullEventsUseCase});
    controller = container.resolve(PullEventsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should execute usecase and return json", async () => {
      const changeMock = {data: jest.fn().mockReturnValue({
        platformName: "google-calendar",
      })};
      const contextMock = {params: {
        uid: "test-uid",
        authenticatorId: "test-authid",
      }};
      const execute =
          jest.spyOn(PullEventsUseCase.prototype, "execute")
            .mockImplementation();

      await controller.execute(changeMock as never, contextMock as never);
      expect(execute).toHaveBeenCalled();
      expect(changeMock.data).toHaveBeenCalled();
    });
  });
});
