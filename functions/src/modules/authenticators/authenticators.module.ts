import { container } from "tsyringe";
import { FirestoreAccessRepository } from "./infrastructure/repositories/access.repository";
import { OAuth2RepositoryContext } from "./infrastructure/repositories/oauth2.repository";

import routes from "./interfaces/http/routes";

container.register("AccessRepository", { useClass: FirestoreAccessRepository });
container.register("OAuth2Repository", { useClass: OAuth2RepositoryContext });
export default routes;
