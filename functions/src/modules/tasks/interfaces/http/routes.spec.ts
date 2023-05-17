/* eslint-disable require-jsdoc */
import "reflect-metadata";
import {container} from "tsyringe";
import * as firebaseFunctionsTest from "firebase-functions-test";
import {FeaturesList} from "firebase-functions-test/lib/features";

import {
  AddTaskViaApiKey,
} from "../../infrastructure/controllers/add-task.controller";

class MockController implements AddTaskViaApiKey {
  execute = jest.fn().mockReturnValue("test-value");
  add = jest.fn() as never;
}

const apiKeyServiceMock = {
  generateUserKey: jest.fn(),
  getUserByKey: jest.fn(),
};
const mockController = new MockController;

container.register("api-key", {useValue: apiKeyServiceMock});
container.register(AddTaskViaApiKey, {useValue: mockController});

import routes from "./routes";

describe("TasksRoutes", () => {
  let firebaseFunctions:FeaturesList;

  beforeEach(() => {
    firebaseFunctions = firebaseFunctionsTest();
  });

  afterEach(() => {
    firebaseFunctions.cleanup();
  });

  describe("addTask", () => {
    it("the controller is being called", async () => {
      const {addTask} = routes;

      const mockUid = "test-uid";
      apiKeyServiceMock.getUserByKey.mockResolvedValueOnce(mockUid);

      const reqMock = {headers: {authorization: "Token test-token"}};
      await addTask(reqMock as never, {} as never);

      expect(mockController.execute).toHaveBeenCalled();
    });
  });
});
