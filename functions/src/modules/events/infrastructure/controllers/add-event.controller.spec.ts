import "reflect-metadata";
import { container } from "tsyringe";
import { AddEventUseCase } from "../../domain/usecases/add-event.usecase";
import { AddEventViaApiKeyController } from "./add-event.controller";

jest.mock("../../domain/usecases/add-event.usecase");

describe("AddEventUseCaseViaApiKey", () => {
  let controller: AddEventViaApiKeyController;

  beforeEach(() => {
    container.register(AddEventUseCase, { useClass: AddEventUseCase });
    controller = container.resolve(AddEventViaApiKeyController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should execute use case and return json", async () => {
      const reqMock = { headers: { uid: "test-uid" }, body: "test-body" };
      const resMock = { json: jest.fn() };
      const execute = jest.spyOn(AddEventUseCase.prototype, "execute").mockImplementation();

      await controller.execute(reqMock as never, resMock as never);
      expect(execute).toHaveBeenCalledWith("test-body", "test-uid");
      expect(resMock.json).toHaveBeenCalled();
    });

    it("should crash if uid header isn't set", () => {
      expect(async () => controller.execute({} as never, {} as never)).rejects.toThrow();
    });
  });
});
