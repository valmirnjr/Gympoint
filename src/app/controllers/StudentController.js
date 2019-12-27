import User from "../models/User";
import Student from "../models/Student";

class StudentController {
  async store(req, res) {
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

    const { id, name, email, weight, height } = await Student.create(req.body);

    return res.json({
      id,
      name,
      email,
      weight,
      height,
    });
  }
}

export default new StudentController();
