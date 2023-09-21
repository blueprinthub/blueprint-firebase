import "reflect-metadata";
import {FirestoreAccessRepository} from "./access.repository";
import {Access} from "../../domain/entities/access.entity";
import {container} from "tsyringe";

describe("FirestoreAccessRepository", () => {
  let repo: FirestoreAccessRepository;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let firestoreMock: any;

  beforeEach(() => {
    firestoreMock = {
      collection: jest.fn().mockReturnThis(),
      doc: jest.fn().mockReturnThis(),
      add: jest.fn(),
      set: jest.fn(),
    };
    container.clearInstances();
    container.register("firestore", {useValue: firestoreMock});
    repo = container.resolve(FirestoreAccessRepository);
  });

  it("should save access correctly", async () => {
    const access: Access = {
      accessToken: "abc",
      platformName: "jira",
      user: {gid: "gid"},
    };
    firestoreMock.add.mockResolvedValue(undefined);

    await repo.save(access, "user1");

    expect(firestoreMock.collection).toHaveBeenCalledWith("users");
    expect(firestoreMock.doc).toHaveBeenCalledWith("user1");
    expect(firestoreMock.collection).toHaveBeenCalledWith("authenticators");
    expect(firestoreMock.set).toHaveBeenCalledWith(access);
  });
});
