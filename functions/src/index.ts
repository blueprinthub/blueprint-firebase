import "reflect-metadata";
import {container} from "tsyringe";
import {configFactory} from "./common/config/config.service";
import {firestore} from "./common/firestore/firestore.service";

container.register("config", {useFactory: configFactory});
container.register("firestore", {useValue: firestore});

// AuthenticatorsModule
import authRoutes from "./modules/authenticators/authenticators.module";
export const authenticators = authRoutes;

// UsersModule
import userRoutes from "./modules/users/users.module";
export const users = userRoutes;

// TasksModule
import tasksRoutes from "./modules/tasks/tasks.module";
export const tasks = tasksRoutes;

import apiRoutes from "./auth/oauth/oauth.service";
export const api = apiRoutes;
