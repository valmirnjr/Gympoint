import { Router } from "express";

import StudentController from "./app/controllers/StudentController";
import SessionController from "./app/controllers/SessionController";
import PlanController from "./app/controllers/PlanController";
import RegistryController from "./app/controllers/RegistryController";
import CheckInController from "./app/controllers/CheckInController";
import HelpOrderController from "./app/controllers/HelpOrderController";
import AnswerOrderController from "./app/controllers/AnswerOrderController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();

routes.post("/sessions", SessionController.store);

routes.post("/students/:id/checkins", CheckInController.store);

routes.get("/students/:id/checkins", CheckInController.index);

routes.post("/students/:id/help-orders", HelpOrderController.store);

routes.get("/students/:id/help-orders", HelpOrderController.index);

routes.use(authMiddleware);

routes.get("/students", StudentController.index);

routes.post("/students", StudentController.store);

routes.put("/students/:id", StudentController.update);

routes.get("/plans", PlanController.index);

routes.post("/plans", PlanController.store);

routes.put("/plans/:id", PlanController.update);

routes.delete("/plans/:id", PlanController.delete);

routes.get("/registries", RegistryController.index);

routes.post("/registries", RegistryController.store);

routes.put("/registries/:id", RegistryController.update);

routes.delete("/registries/:id", RegistryController.delete);

routes.get("/help-orders", AnswerOrderController.index);

routes.post("/help-orders/:orderId/answer", AnswerOrderController.store);

export default routes;
