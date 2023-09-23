/* eslint-disable require-jsdoc */
import "reflect-metadata";
import { AbstractRemoteRepository } from "./remote.repository.abstract";

class DummyRemote extends AbstractRemoteRepository<never> {
  getTasks = jest.fn();

  mapper = jest.fn();
}

describe("RemoteRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAccess", () => {
    it("should be able to get access keys from authenticator", async () => {
      const docMock = {
        get: jest.fn().mockReturnValue("test-token"),
      };
      const firestoreMock = {
        doc: jest.fn().mockReturnThis(),
        collection: jest.fn().mockReturnThis(),
        get: jest.fn().mockReturnValue(docMock),
      };

      const jiraRemote = new DummyRemote(firestoreMock as never);
      const access = await jiraRemote.getAccess("test-id-1", "test-authid-1");
      expect(firestoreMock.collection).toHaveBeenCalledWith("users");
      expect(firestoreMock.doc).toHaveBeenCalledWith("test-id-1");
      expect(firestoreMock.collection).toHaveBeenCalledWith("authenticators");
      expect(firestoreMock.doc).toHaveBeenCalledWith("test-authid-1");
      expect(docMock.get).toHaveBeenCalledWith("accessToken");
      expect(access).toEqual("test-token");
    });
  });
});
