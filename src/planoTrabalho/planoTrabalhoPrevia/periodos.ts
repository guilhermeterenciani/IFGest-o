export const periodos = [
    { horaInicio: "07:00", horaFim: "07:45" },
    { horaInicio: "07:45", horaFim: "08:30" },
    { horaInicio: "08:30", horaFim: "09:15" },
    { horaInicio: "09:30", horaFim: "10:15" },
    { horaInicio: "10:15", horaFim: "11:00" },
    { horaInicio: "11:00", horaFim: "11:45" },
    { horaInicio: "11:45", horaFim: "12:30" },
    { horaInicio: "13:00", horaFim: "13:45" },
    { horaInicio: "13:45", horaFim: "14:30" },
    { horaInicio: "14:30", horaFim: "15:15" },
    { horaInicio: "15:30", horaFim: "16:15" },
    { horaInicio: "16:15", horaFim: "17:00" },
    { horaInicio: "17:00", horaFim: "17:45" },
    { horaInicio: "17:45", horaFim: "18:30" },
    { horaInicio: "18:50", horaFim: "19:35" },
    { horaInicio: "19:35", horaFim: "20:20" },
    { horaInicio: "20:20", horaFim: "21:05" },
    { horaInicio: "21:15", horaFim: "22:00" },
    { horaInicio: "22:00", horaFim: "22:45" }
]

export const diaDaSemana = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
]
const diaDaSemanaSelectOption = new Map<number, string>()
diaDaSemanaSelectOption.set(2, "Segunda-feira")
diaDaSemanaSelectOption.set(3, "Terça-feira")
diaDaSemanaSelectOption.set(4, "Quarta-feira")
diaDaSemanaSelectOption.set(5, "Quinta-feira")
diaDaSemanaSelectOption.set(6, "Sexta-feira")
diaDaSemanaSelectOption.set(7, "Sábado")

export { diaDaSemanaSelectOption }
