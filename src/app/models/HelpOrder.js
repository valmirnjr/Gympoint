import Sequelize, { Model } from "sequelize";

class HelpOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        question: Sequelize.TEXT,
        answer: Sequelize.TEXT,
        answer_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    // Adds student_id to the source model, which is the help_orders relation
    this.belongsTo(models.Student, { as: "student" });
  }
}

export default HelpOrder;
