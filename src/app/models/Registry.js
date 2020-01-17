import Sequelize, { Model } from "sequelize";
import { isBefore } from "date-fns";

class Registry extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.FLOAT,
        active: {
          type: Sequelize.VIRTUAL(Sequelize.BOOLEAN, [
            "start_date",
            "end_date",
          ]),
          get() {
            return (
              isBefore(this.get("start_date"), new Date()) &&
              isBefore(new Date(), this.get("end_date"))
            );
          },
        },
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    // Adds student_id to the source model, which is the registries relation
    this.belongsTo(models.Student, { as: "student" });

    // Adds plan_id to the source model, which is the registries relation
    this.belongsTo(models.Plan, { as: "plan" });
  }
}

export default Registry;
