import { container } from "tsyringe";

container.register("EventLocalRepository", { useClass: FirestoreEventLocalRepository });
container.register("EventRemoteRepositoryFactory");
