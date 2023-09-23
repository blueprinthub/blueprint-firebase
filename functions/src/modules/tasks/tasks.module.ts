import { container } from "tsyringe";
import { FirestoreRemoteRepositoryFactory } from "./infrastructure/repositories/factories/remote.repository.factory";
import { FirestoreTasksRepository } from "./infrastructure/repositories/tasks.repository";

container.register("TasksRepository", { useClass: FirestoreTasksRepository });
container.register("RemoteRepositoryFactory", {
  useClass: FirestoreRemoteRepositoryFactory,
});

import triggers from "./interfaces/firestore/triggers";
import routes from "./interfaces/http/routes";
export default { ...triggers, ...routes };
