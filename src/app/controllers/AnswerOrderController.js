import * as Yup from "yup";

import HelpOrder from "../models/HelpOrder";

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

    return res.json({ success: "Answer sent." });
  }
}

export default new AnswerOrderController();
