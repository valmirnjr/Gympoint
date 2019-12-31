import Student from "../models/Student";
import HelpOrder from "../models/HelpOrder";

class HelpOrderController {
  async index(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res
        .status(400)
        .json({ error: "No student was found for the id passed." });
    }

    try {
      const helpOrders = await HelpOrder.findAll({
        where: {
          student_id: student.id,
        },
        attributes: ["question", "answer", "answer_at"],
      });

      return res.status(200).json(helpOrders);
    } catch (err) {
      return res.status(500).json({
        error:
          "Internal Server Error. Your help orders could not be retrieved.",
      });
    }
  }

  async store(req, res) {
    const { question } = req.body;

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res
        .status(400)
        .json({ error: "No student was found for the id passed." });
    }

    try {
      await HelpOrder.create({
        student_id: student.id,
        question,
      });
    } catch (err) {
      return res.status(500).json({
        error: "Internal server error! Your message could not be sent.",
      });
    }

    return res.status(200).json({ success: "Question sent" });
  }
}

export default new HelpOrderController();
