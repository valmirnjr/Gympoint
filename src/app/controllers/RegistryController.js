import * as Yup from "yup";
import { addMonths, parseISO, isBefore } from "date-fns";

import Registry from "../models/Registry";
import Student from "../models/Student";
import Plan from "../models/Plan";

import Mail from "../../lib/Mail";

class RegistryController {
  async index(req, res) {
    const registries = await Registry.findAll({
      attributes: ["student_id", "plan_id", "start_date", "end_date", "price"],
      order: ["student_id"],
    });

    return res.json(registries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .positive()
        .required(),
      plan_id: Yup.number()
        .integer()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation failed" });
    }
    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    /*
     * Check if student exists
     */
    if (!student) {
      return res.status(400).json({ error: "Student not found" });
    }

    /*
     * Check if student already has a plan
     */
    const studentHasPlan = await Registry.findOne({
      where: {
        student_id,
      },
    });

    if (studentHasPlan) {
      return res.status(400).json({
        error:
          "This student already has a plan. Please update the current one.",
      });
    }

    /*
     * Check if plan exists
     */
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: "Plan not found" });
    }

    /*
     * Check if start_date is not in the past
     */
    const parsedStartDate = parseISO(start_date);

    if (isBefore(parsedStartDate, new Date())) {
      return res
        .status(400)
        .json({ error: "The starting date can not be in the past" });
    }

    const end_date = addMonths(parsedStartDate, plan.duration);

    const price = plan.duration * plan.price;

    await Registry.create({
      student_id,
      plan_id,
      start_date: parsedStartDate,
      end_date,
      price,
    });

    /**
     * Send e-mail to student with his registry details
     */
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: "Welcome to Gympoint",
      text: "Have a great time with your new plan.",
    });

    return res.json({
      student_id,
      plan_id,
      parsedStartDate,
      end_date,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number()
        .integer()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation failed" });
    }

    const { plan_id, start_date } = req.body;

    const student = await Student.findByPk(req.params.id);

    /*
     * Check if student exists
     */
    if (!student) {
      return res.status(400).json({ error: "Student not found" });
    }

    /*
     * Check if plan exists
     */
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: "Plan not found" });
    }

    /*
     * Check if start_date is not in the past
     */
    const parsedStartDate = parseISO(start_date);

    if (isBefore(parsedStartDate, new Date())) {
      return res
        .status(400)
        .json({ error: "The starting date can not be in the past" });
    }

    /*
     * Check if student has an ongoing registry
     */
    const registry = await Registry.findOne({
      where: {
        student_id: student.id,
      },
    });

    if (!registry) {
      return res
        .status(400)
        .json({ error: "This student doesn't have an ongoing registry" });
    }

    const end_date = addMonths(parsedStartDate, plan.duration);

    const price = plan.duration * plan.price;

    await registry.update({
      plan_id,
      start_date: parsedStartDate,
      end_date,
      price,
    });

    return res.json(registry);
  }

  async delete(req, res) {
    const studentId = req.params.id;

    const registry = await Registry.findOne({
      where: {
        student_id: studentId,
      },
    });

    if (!registry) {
      return res
        .status(400)
        .json({ error: "No registry was found for this student." });
    }

    await Registry.destroy({
      where: {
        id: registry.id,
      },
    });

    return res.status(200).json({ success: "Deleted" });
  }
}

export default new RegistryController();
