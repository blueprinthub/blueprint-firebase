import { container } from "tsyringe";
import { FirestoreEventLocalRepository } from "./infrastructure/repositories/local/firestore-event-local.repository";
import { FirestoreEventRemoteRepositoryFactory } from "./infrastructure/repositories/remote/factories/remote.repository.factory";

container.register("EventLocalRepository", { useClass: FirestoreEventLocalRepository });
container.register("EventRemoteRepositoryFactory", { useClass: FirestoreEventRemoteRepositoryFactory });

import triggers from "./interfaces/firestore/triggers";
export default { ...triggers };
