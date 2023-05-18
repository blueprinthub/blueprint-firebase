import "reflect-metadata";
import {container} from "tsyringe";
import {Firestore} from "firebase-admin/firestore";
import {FirestoreRemoteRepositoryFactory} from "./remote.repository.factory";
import {JiraRemoteRepository} from "../../services/jira.service";
import {PlatformName} from "../../../domain/entities/platform.enum";
import {AsanaRemoteRepository} from "../../services/asana.service";
import {GithubRemoteRepository} from "../../services/github.service";

describe("FirestoreRemoteRepositoryFactory", () => {
  const firestoreMock = {} as unknown as Firestore;
  let repoFactory:FirestoreRemoteRepositoryFactory;

  beforeAll(() => {
    container.register("firestore", {useValue: firestoreMock});
    repoFactory = container.resolve(FirestoreRemoteRepositoryFactory);
  });

  describe("buildFor", () => {
    test.each([
      {instance: JiraRemoteRepository, name: PlatformName.Jira},
      {instance: AsanaRemoteRepository, name: PlatformName.Asana},
      {instance: GithubRemoteRepository, name: PlatformName.Github},
    ])("should build the repo for $name when is called with '$name'",
      async ({instance, name}) => {
        const result = repoFactory.buildFor(name);
        expect(result).toBeInstanceOf(instance);
      });
  });
});
