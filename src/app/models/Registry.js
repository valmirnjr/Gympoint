import Sequelize, { Model } from "sequelize";

class Registry extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.FLOAT,
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
