import { Router } from "express";

import StudentController from "./app/controllers/StudentController";

import User from "./app/models/User";
import Student from "./app/models/Student";

const routes = new Router();

routes.post("/students", StudentController.store);

export default routes;
