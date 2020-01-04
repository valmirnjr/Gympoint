import Mail from "../../lib/Mail";

class AnswerMail {
  get key() {
    return "AnswerMail";
  }

  async handle({ data }) {
    const { student, helpOrder } = data;

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
  }
}

export default new AnswerMail();
