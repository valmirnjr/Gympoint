import { subDays } from "date-fns";

import Student from "../models/Student";
import CheckIn from "../schemas/CheckIn";

class CheckInController {
  async index(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res
        .status(400)
        .json({ error: "No student was found for the id passed." });
    }

    const checkIns = await CheckIn.find({
      student_id: student.id,
    });

    return res.json(checkIns);
  }

  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res
        .status(400)
        .json({ error: "No student was found for the id passed." });
    }

    /**
     * Check how many times the student has checked in this week
     */
    const sevenDaysAgo = subDays(new Date(), 7);

    const weeklyCheckIns = await CheckIn.find({
      student_id: student.id,
      createdAt: {
        $gte: sevenDaysAgo,
      },
    });

    if (weeklyCheckIns.length >= 5) {
      return res.status(400).json({
        error: "You have already checked-in 5 times in the last 7 days",
      });
    }

    await CheckIn.create({
      student_id: student.id,
    });

    return res.json({ success: `Welcome ${student.name}` });
  }
}

export default new CheckInController();
