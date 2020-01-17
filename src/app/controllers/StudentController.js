import { Op } from "sequelize";
import * as Yup from "yup";
import { parseISO } from "date-fns";
import differenceInYears from "date-fns/differenceInYears";

import Student from "../models/Student";

class StudentController {
  async index(req, res) {
    const nameFilter = req.query.q;
    const idFilter = req.query.id;

    /**
     * If a query name was passed, then we look for it in the database
     */
    /* const queryOptions = nameFilter
      ? {
          name: { [Op.iLike]: `%${nameFilter}%` },
        }
      : true; */

    const queryOptions = {
      name: nameFilter ? { [Op.iLike]: `%${nameFilter}%` } : { [Op.ne]: null },
      id: idFilter || { [Op.ne]: null },
    };

    const students = await Student.findAll({
      where: queryOptions,
    });

    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      date_of_birth: Yup.date()
        .min(parseISO("1900-01-01"))
        .max(new Date())
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation failed" });
    }

    /*
     * Check if email is already registered for another student
     */
    const studentExists = await Student.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (studentExists) {
      return res.status(400).json({ error: "Student already exists" });
    }

    const {
      id,
      name,
      email,
      date_of_birth,
      weight,
      height,
    } = await Student.create(req.body);

    const age = differenceInYears(new Date(), date_of_birth);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      date_of_birth: Yup.date()
        .min(parseISO("1900-01-01"))
        .max(new Date()),
      weight: Yup.number().positive(),
      height: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation failed" });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: "Student not found" });
    }

    await student.update(req.body);

    const {
      id,
      name,
      email,
      date_of_birth,
      weight,
      height,
    } = await Student.findByPk(req.params.id);

    const age = differenceInYears(new Date(), date_of_birth);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentController();
