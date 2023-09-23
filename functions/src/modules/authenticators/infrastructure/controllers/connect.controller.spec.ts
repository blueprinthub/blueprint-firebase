import "reflect-metadata";
import { container } from "tsyringe";
import { ConnectOAuth } from "../../domain/usecases/connect-oauth.usecase";
import { ConnectController } from "./connect.controller";

jest.mock("../../domain/usecases/connect-oauth.usecase");

describe("TasksTriggers", () => {
  let controller: ConnectController;

  beforeEach(() => {
    container.register(ConnectOAuth, { useClass: ConnectOAuth });
    controller = container.resolve(ConnectController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should throw error when there's no user", () => {
      expect(async () => {
        await controller.execute({} as never, {} as never);
      }).rejects.toThrow();
    });

    it("should call execute with right params", async () => {
      const mockData = {
        code: "test-code",
        platform: "test-platform",
      };

      const execute = jest.spyOn(ConnectOAuth.prototype, "execute").mockImplementation();

      await controller.execute(mockData, {
        auth: {
          uid: "test-uid",
        },
      } as never);

      expect(execute).toHaveBeenCalledWith(mockData, "test-uid");
    });
  });
});
