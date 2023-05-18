/* eslint-disable require-jsdoc */
import "reflect-metadata";
import {container} from "tsyringe";
import * as firebaseFunctionsTest from "firebase-functions-test";
import {FeaturesList} from "firebase-functions-test/lib/features";
import {
  ConnectController,
} from "../../infrastructure/controllers/connect.controller";

jest.mock("../../infrastructure/controllers/connect.controller");

container.register(ConnectController, {useClass: ConnectController});

import routes from "./routes";

describe("AuthenticatorsRoutes", () => {
  let firebaseFunctions:FeaturesList;

  beforeEach(() => {
    firebaseFunctions = firebaseFunctionsTest();
    container.register(ConnectController, {useClass: ConnectController});
  });

  afterEach(() => {
    firebaseFunctions.cleanup();
  });

  describe("connect", () => {
    it("should return the same as controller", async () => {
      const execute = jest.spyOn(ConnectController.prototype, "execute")
        .mockImplementation();

      const {connect} = routes;
      await firebaseFunctions.wrap(connect)({a: "a"});
      expect(execute).toHaveBeenCalled();
    });
  });
});
