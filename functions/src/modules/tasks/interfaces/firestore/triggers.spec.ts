/* eslint-disable require-jsdoc */
import "reflect-metadata";
import {container} from "tsyringe";
import * as firebaseFunctionsTest from "firebase-functions-test";
import {FeaturesList} from "firebase-functions-test/lib/features";
import {
  PullTasksController,
} from "../../infrastructure/controllers/pull-tasks.controller";

jest.mock("../../infrastructure/controllers/pull-tasks.controller");

container.register(PullTasksController, {useClass: PullTasksController});

import triggers from "./triggers";

describe("TasksTriggers", () => {
  let firebaseFunctions:FeaturesList;

  beforeEach(() => {
    firebaseFunctions = firebaseFunctionsTest();
    container.register(PullTasksController, {useClass: PullTasksController});
  });

  afterEach(() => {
    firebaseFunctions.cleanup();
  });

  describe("clone", () => {
    it("should return the same as controller", async () => {
      const execute = jest.spyOn(PullTasksController.prototype, "execute")
        .mockImplementation();

      const {clone} = triggers;
      await firebaseFunctions.wrap(clone)({} as never);
      expect(execute).toHaveBeenCalled();
    });
  });
});
