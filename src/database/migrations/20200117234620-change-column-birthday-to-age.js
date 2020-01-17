module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn({ tableName: "students" }, "date_of_birth"),
      queryInterface.addColumn("students", "age", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
    ]);
  },

  down: () => {},
};
