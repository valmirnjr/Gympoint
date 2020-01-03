import * as Yup from "yup";

import Student from "../models/Student";
import HelpOrder from "../models/HelpOrder";

import Mail from "../../lib/Mail";

class AnswerOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer: null,
      },
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string()
        .required()
        .strict(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation failed" });
    }

    const helpOrder = await HelpOrder.findByPk(req.params.orderId);
    const student = await Student.findByPk(helpOrder.student_id);

    if (!helpOrder) {
      return res
        .status(400)
        .json({ error: "No order was found for the id passed." });
    }

    if (helpOrder.answer) {
      return res
        .status(400)
        .json({ error: "This questions has already been answered." });
    }

    const { answer } = req.body;

    await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    /**
     * Send e-mail to student with the answer to his help order
     */
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: "Resposta à sua pergunta",
      template: "helpOrder",
      context: {
        student: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });

    return res.json({ success: "Answer sent." });
  }
}

export default new AnswerOrderController();
