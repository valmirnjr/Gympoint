import * as Yup from "yup";

import Plan from "../models/Plan";

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ["id", "title", "duration", "price"],
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .round()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation failed" });
    }

    const { title, duration, price } = req.body;

    /*
     * Check if a plan with the same title already exists
     */
    const planExists = await Plan.findOne({
      where: {
        title,
      },
    });

    if (planExists) {
      return res
        .status(400)
        .json({ error: "A plan with this title already exists" });
    }

    const plan = await Plan.create({
      title,
      duration,
      price,
    });

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number()
        .positive()
        .round(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation failed" });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: "Plan not found" });
    }

    await plan.update(req.body);

    const { id, title, duration, price } = await Plan.findByPk(req.params.id);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const planId = req.params.id;

    const plan = await Plan.findByPk(planId);

    if (!plan) {
      return res.status(400).json({ error: "Plan not found" });
    }

    await Plan.destroy({
      where: {
        id: planId,
      },
    });

    return res.status(200).json({ success: "Deleted" });
  }
}

export default new PlanController();
