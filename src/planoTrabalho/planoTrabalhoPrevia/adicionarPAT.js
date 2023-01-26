//PAT SIDE
//let regexpats = new RegExp(/https\:\/\/academico\.ifms\.edu\.br\/administrativo\/pats/i);
//https://academico.ifms.edu.br/administrativo/horario_docentes/editar/
//if(regexpats.test(urlAcademico)){
//alert("Estou na página de cadastro do PAT")
//schedule.push({"idNodeFree":`id-node-free-${trI+1}`,"diaSemana":"segunda","tempo":trI/diasUteis, "node":trNodes[trI+1]})
let grade = JSON.parse(localStorage.getItem("grade"))
let filteredPAT = grade.filter((item) => item.tipo === "PAT")
const horaInicioNodeDom = document.getElementById("hora_inicio")
const horaFimNodeDom = document.getElementById("hora_fim")
const diaDaSemanaNodeDom = document.getElementById("dia_semana")
const btnAdcionar = document.getElementById("adicionar_horario")
if (filteredPAT.length !== 0) {
    const selectGradeHorario = document.querySelector("#grade_horaria")
    selectGradeHorario.innerHTML = ""
}

for (horario of filteredPAT) {
    includePATOnInterface(
        horario.diaDaSemana,
        horario.periodo.horaInicio,
        horario.periodo.horaFim
    )
    //if(opcao==="excluir"){
    //    excludePATOnInterface(console.log("Not Implemented yet"))
    //}
    //if(opcao==="create"){
    //}
    //schedulePAT.tipo="ocupado";
}
localStorage.setItem(
    "grade",
    JSON.stringify(grade.filter((item) => item.tipo !== "PAT"))
)
function includePATOnInterface(diaSemana, horaInicio, horaFim) {
    horaInicioNodeDom.value = horaInicio
    horaFimNodeDom.value = horaFim
    diaDaSemanaNodeDom.value = diaSemana
    btnAdcionar.click()
}
let botaoVoltar = document.querySelector(".form-actions a")
botaoVoltar.style.display = "none"
