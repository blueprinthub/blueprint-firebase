/* eslint-disable require-jsdoc */
import "reflect-metadata";
import {container} from "tsyringe";
import * as firebaseFunctionsTest from "firebase-functions-test";
import {FeaturesList} from "firebase-functions-test/lib/features";

import {
  PullTasksController,
} from "../../infrastructure/controllers/pull-tasks.controller";

class MockController implements PullTasksController {
  execute = jest.fn().mockReturnValue("test-value");
  pull = jest.fn() as never;
}
container.register(PullTasksController, {useClass: MockController});

import triggers from "./triggers";

describe("TasksTriggers", () => {
  let firebaseFunctions:FeaturesList;
  let mockController:PullTasksController;

  beforeEach(() => {
    firebaseFunctions = firebaseFunctionsTest();
    mockController = new MockController();
    container.register(PullTasksController, {useValue: mockController});
  });

  afterEach(() => {
    firebaseFunctions.cleanup();
  });

  describe("clone", () => {
    it("should return the same as controller", async () => {
      const {clone} = triggers;
      const result = await firebaseFunctions.wrap(clone)({} as never);
      expect(result).toEqual("test-value");
    });
  });
});
