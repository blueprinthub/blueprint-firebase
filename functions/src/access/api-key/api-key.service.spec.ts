import "reflect-metadata";
import {container} from "tsyringe";
import {ApiKeyService, ApiKeyServiceImpl} from "./api-key.service";

describe("ApiKeyServiceImpl", () => {
  let firestoreMock:any;
  let apiKeyService:ApiKeyService;

  beforeEach(() => {
    firestoreMock = {
      collection: jest.fn().mockReturnThis(),
      doc: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn(),
    };
    container.register("firestore", {useValue: firestoreMock});
    apiKeyService = container.resolve(ApiKeyServiceImpl);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("generateUserKey", () => {
    it("should generate a valid API key", async () => {
      const apiKey = await apiKeyService.generateUserKey("userid");
      expect(apiKey.startsWith("bp-")).toBe(true);
      expect(apiKey.length).toBe(35);
    });

    it("should update the user document with the generated API key",
      async () => {
        const mockUid = "test-uid";
        await apiKeyService.generateUserKey(mockUid);
        expect(firestoreMock.collection).toHaveBeenCalledWith("users");
        expect(firestoreMock.doc).toHaveBeenCalledWith(mockUid);
        expect(firestoreMock.update).toHaveBeenCalled();
      });
  });

  describe("getUserByKey", () => {
    it("should return the user ID when a valid API key is provided",
      async () => {
        const queryResult = {
          empty: false,
          docs: [{id: "userid"}],
        };
        firestoreMock.collection("users").where.mockReturnThis();
        firestoreMock.collection("users").where().limit.mockReturnThis();
        firestoreMock.collection("users").where().limit()
          .get.mockResolvedValue(queryResult);
        const userId = await apiKeyService.getUserByKey("valid-api-key");
        expect(userId).toBe("userid");
      });

    it("should return null when an invalid API key is provided", async () => {
      const queryResult = {empty: true};
      firestoreMock.collection("users").where.mockReturnThis();
      firestoreMock.collection("users").where().limit.mockReturnThis();
      firestoreMock.collection("users").where().limit()
        .get.mockResolvedValue(queryResult);
      const userId = await apiKeyService.getUserByKey("invalid-api-key");
      expect(userId).toBeNull();
    });
  });
});
