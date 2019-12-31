import Sequelize from "sequelize";
import mongoose from "mongoose";

import User from "../app/models/User";
import Student from "../app/models/Student";
import Plan from "../app/models/Plan";
import Registry from "../app/models/Registry";
import HelpOrder from "../app/models/HelpOrder";

import databaseConfig from "../config/database";

const models = [User, Student, Plan, Registry, HelpOrder];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      "mongodb://localhost:27017/gympoint",
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
