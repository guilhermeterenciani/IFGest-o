let grade = JSON.parse(localStorage.getItem("grade"))
let filteredPE = grade.filter((item) => item.tipo === "PE")

const horaInicioNodeDom = document.getElementById("NovoInicio")
const horaFimNodeDom = document.getElementById("NovoFim")
const diaSemanaDom = document.getElementById("NovoDiaSemanaId")
const btnAddNodeDom = document.getElementById("adicionar")

for (let horario of filteredPE) {
    includePEOnInterface(
        horario.diaDaSemana,
        horario.periodo.horaInicio,
        horario.periodo.horaFim
    )
    resetButton()
}

localStorage.setItem(
    "grade",
    JSON.stringify(grade.filter((item) => item.tipo !== "PE"))
)

function includePEOnInterface(diaSemana, horaInicio, horaFim) {
    horaInicioNodeDom.value = horaInicio
    horaFimNodeDom.value = horaFim
    diaSemanaDom.value = diaSemana
    btnAddNodeDom.click()
}
function resetButton() {
    horaInicioNodeDom.value = "__:__"
    horaFimNodeDom.value = "__:__"
    diaSemanaDom.value = 2
}
