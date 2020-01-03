import { format, parseISO } from "date-fns";
import pt from "date-fns/locale/pt-BR";

import Mail from "../../lib/Mail";

class RegistryMail {
  get key() {
    return "RegistryMail";
  }

  async handle({ data }) {
    const { student, plan, registry } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: "Welcome to Gympoint",
      template: "registration",
      context: {
        student: student.name,
        planTitle: plan.title,
        startDate: format(parseISO(registry.start_date), "dd/MM/yyyy", {
          locale: pt,
        }),
        endDate: format(parseISO(registry.end_date), "dd/MM/yyyy", {
          locale: pt,
        }),
        price: `R$ ${registry.price},00`,
      },
    });
  }
}

export default new RegistryMail();
