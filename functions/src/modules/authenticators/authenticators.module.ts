import { container } from "tsyringe";
import { FirestoreAccessRepository } from "./infrastructure/repositories/access.repository";
import { OAuth2RepositoryContext } from "./infrastructure/repositories/oauth2.repository";

container.register("AccessRepository", { useClass: FirestoreAccessRepository });
container.register("OAuth2Repository", { useClass: OAuth2RepositoryContext });

import routes from "./interfaces/http/routes";
export default routes;
