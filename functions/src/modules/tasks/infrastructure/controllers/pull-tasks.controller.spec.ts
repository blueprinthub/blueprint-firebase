import "reflect-metadata";
import { container } from "tsyringe";
import { PullTasks } from "../../domain/usecases/pull-tasks.usecase";
import { PullTasksController } from "./pull-tasks.controller";

jest.mock("../../domain/usecases/pull-tasks.usecase");

describe("AddTaskViaApiKey", () => {
  let controller: PullTasksController;

  beforeEach(() => {
    container.register(PullTasks, { useClass: PullTasks });
    controller = container.resolve(PullTasksController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should execute usecase and return json", async () => {
      const changeMock = {
        data: jest.fn().mockReturnValue({
          platformName: "jira",
        }),
      };
      const contextMock = {
        params: {
          uid: "test-uid",
          authenticatorId: "test-authid",
        },
      };
      const execute = jest.spyOn(PullTasks.prototype, "execute").mockImplementation();

      await controller.execute(changeMock as never, contextMock as never);
      expect(execute).toHaveBeenCalled();
      expect(changeMock.data).toHaveBeenCalled();
    });
  });
});
