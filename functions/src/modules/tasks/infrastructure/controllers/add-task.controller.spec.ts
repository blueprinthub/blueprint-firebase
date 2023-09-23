import "reflect-metadata";
import { container } from "tsyringe";
import { AddTask } from "../../domain/usecases/add-task.usecase";
import { AddTaskViaApiKey } from "./add-task.controller";

jest.mock("../../domain/usecases/add-task.usecase");

describe("AddTaskViaApiKey", () => {
  let controller: AddTaskViaApiKey;

  beforeEach(() => {
    container.register(AddTask, { useClass: AddTask });
    controller = container.resolve(AddTaskViaApiKey);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should execute usecase and return json", async () => {
      const reqMock = { headers: { uid: "test-uid" }, body: "test-body" };
      const resMock = { json: jest.fn() };
      const execute = jest.spyOn(AddTask.prototype, "execute").mockImplementation();

      await controller.execute(reqMock as never, resMock as never);
      expect(execute).toHaveBeenCalledWith("test-body", "test-uid");
      expect(resMock.json).toHaveBeenCalled();
    });

    it("should crash if uid header isn't set", () => {
      expect(async () => controller.execute({} as never, {} as never)).rejects.toThrow();
    });
  });
});
