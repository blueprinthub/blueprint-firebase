/* eslint-disable require-jsdoc */
import "reflect-metadata";
import {container} from "tsyringe";
import * as firebaseFunctionsTest from "firebase-functions-test";
import {FeaturesList} from "firebase-functions-test/lib/features";

import {
  ConnectController,
} from "../../infrastructure/controllers/connect.controller";

class MockController implements ConnectController {
  execute = jest.fn().mockReturnValue("test-value");
  connect = jest.fn() as never;
}
container.register(ConnectController, {useClass: MockController});

import routes from "./routes";

describe("AuthenticatorsRoutes", () => {
  let firebaseFunctions:FeaturesList;
  let mockController:ConnectController;

  beforeEach(() => {
    firebaseFunctions = firebaseFunctionsTest();
    mockController = new MockController();
    container.register(ConnectController, {useValue: mockController});
  });

  afterEach(() => {
    firebaseFunctions.cleanup();
  });

  describe("connect", () => {
    it("should return the same as controller", async () => {
      const {connect} = routes;
      const result = await firebaseFunctions.wrap(connect)({a: "a"});
      expect(result).toEqual("test-value");
    });
  });
});
