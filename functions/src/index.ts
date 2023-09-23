import "reflect-metadata";
import { container } from "tsyringe";
import { configFactory } from "./common/config/config.service";
import { getFirestore } from "./common/firestore/firestore.service";
import { ApiKeyServiceImpl } from "./access/api-key/api-key.service";

// AuthenticatorsModule
import authRoutes from "./modules/authenticators/authenticators.module";

// UsersModule
import userRoutes from "./modules/users/users.module";

// TasksModule
import tasksRoutes from "./modules/tasks/tasks.module";

container.register("config", { useFactory: configFactory });
container.register("firestore", { useValue: getFirestore() });
container.register("api-key", { useClass: ApiKeyServiceImpl });
export const authenticators = authRoutes;
export const users = userRoutes;
export const tasks = tasksRoutes;
