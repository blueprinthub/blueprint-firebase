import "reflect-metadata";
import * as firebaseFunctionsTest from "firebase-functions-test";
import { container } from "tsyringe";
import { FeaturesList } from "firebase-functions-test/lib/features";

const firestoreMock = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  set: jest.fn(),
};
const apiKeyServiceMock = {
  generateUserKey: jest.fn(),
  getUserByKey: jest.fn(),
};

container.register("firestore", { useValue: firestoreMock });
container.register("api-key", { useValue: apiKeyServiceMock });

import userFunctions from "./users.module";

describe("UsersModule", () => {
  let firebaseFunctions: FeaturesList;

  beforeAll(() => {
    firebaseFunctions = firebaseFunctionsTest();
  });

  afterEach(() => {
    firebaseFunctions.cleanup();
  });

  describe("createAfterSignUp", () => {
    it("creates a user document when a new user signs up", async () => {
      const { createAfterSignUp } = userFunctions;
      const user = firebaseFunctions.auth.exampleUserRecord();
      await firebaseFunctions.wrap(createAfterSignUp)(user);

      expect(firestoreMock.collection).toHaveBeenCalledWith("users");
      expect(firestoreMock.doc).toHaveBeenCalledWith(user.uid);
      expect(firestoreMock.set).toHaveBeenCalledWith({
        email: user.email,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
    });
  });

  describe("createApiKey", () => {
    it("generates a new API key for the user", async () => {
      const { createApiKey } = userFunctions;
      const uid = "test-uid";
      const context = { auth: { uid } };
      const mockKey = "test-api-key";
      apiKeyServiceMock.generateUserKey.mockResolvedValueOnce(mockKey);

      const result = await firebaseFunctions.wrap(createApiKey)({}, context);

      expect(apiKeyServiceMock.generateUserKey).toHaveBeenCalledWith(uid);
      expect(result).toEqual({ key: mockKey });
    });
  });

  describe("getByKey", () => {
    it("should return the user ID from the request headers", async () => {
      const { getByKey } = userFunctions;
      const mockUid = "test-uid";
      apiKeyServiceMock.getUserByKey.mockResolvedValueOnce(mockUid);

      const reqMock = { headers: { authorization: "Token test-token" } };
      const resMock = { json: jest.fn() };
      await getByKey(reqMock as never, resMock as never);

      expect(resMock.json).toHaveBeenCalledWith({ uid: mockUid });
    });
  });
});
