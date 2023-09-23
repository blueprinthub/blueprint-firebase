import "reflect-metadata";
import { container } from "tsyringe";
import { PlatformName } from "../../domain/entities/platform.enum";
import { Task } from "../../domain/entities/task.entity";
import { mockTask } from "../../domain/usecases/__mocks__/task.mock";
import { FirestoreTasksRepository } from "./tasks.repository";

const uid = "test-uid";
const platformName = PlatformName.Jira;

describe("FirestoreTasksRepository", () => {
  let repo: FirestoreTasksRepository;
  let firestoreMock: any;

  beforeEach(() => {
    firestoreMock = {
      collection: jest.fn().mockReturnThis(),
      doc: jest.fn().mockReturnThis(),
      add: jest.fn(),
      batch: jest.fn().mockReturnThis(),
      set: jest.fn(),
      commit: jest.fn(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      withConverter: jest.fn().mockReturnThis(),
    };

    container.clearInstances();
    container.register("firestore", { useValue: firestoreMock });
    repo = container.resolve(FirestoreTasksRepository);
  });

  describe("add", () => {
    it("adds tasks to firestore in batch", async () => {
      const tasks = Array<Task>(4).fill(mockTask);
      const uid = "test-uid";
      await repo.add(tasks, uid);

      expect(firestoreMock.collection).toHaveBeenCalledWith("tasks");
      expect(firestoreMock.set).toHaveBeenCalledTimes(4);
    });
  });

  describe("fetchLastFromPlatform", () => {
    it("returns last task added to firestore of a given platform", async () => {
      firestoreMock.get.mockReturnValue({
        empty: false,
        docs: ["test-doc-value"],
      });
      const result = await repo.fetchLastFromPlatform(platformName, uid);

      expect(firestoreMock.collection).toHaveBeenCalledWith("tasks");
      expect(firestoreMock.where).toHaveBeenCalledWith("platform", "==", platformName);
      expect(firestoreMock.limit).toHaveBeenCalledWith(1);
      expect(result).toEqual("test-doc-value");
    });

    it("does not crash with empty query snapshot", async () => {
      firestoreMock.get.mockReturnValue({
        empty: true,
      });
      const result = await repo.fetchLastFromPlatform(platformName, uid);
      expect(result).toEqual(undefined);
    });
  });
});
