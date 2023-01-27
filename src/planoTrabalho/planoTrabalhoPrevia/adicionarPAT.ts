//PAT SIDE
//let regexpats = new RegExp(/https\:\/\/academico\.ifms\.edu\.br\/administrativo\/pats/i);
//https://academico.ifms.edu.br/administrativo/horario_docentes/editar/
//if(regexpats.test(urlAcademico)){
//alert("Estou na página de cadastro do PAT")

import { THorario } from "./types"

//schedule.push({"idNodeFree":`id-node-free-${trI+1}`,"diaSemana":"segunda","tempo":trI/diasUteis, "node":trNodes[trI+1]})
let storage = localStorage.getItem("grade")
let grade = storage ? JSON.parse(storage) : []
let filteredPAT: Array<THorario> = grade.filter(
    (item: THorario) => item.tipo === "PAT"
)
const horaInicioNodeDom = document.querySelector(
    "input#hora_inicio"
) as HTMLInputElement
const horaFimNodeDom = document.querySelector("#hora_fim") as HTMLInputElement
const diaDaSemanaNodeDom = document.querySelector(
    "#dia_semana"
) as HTMLSelectElement
const btnAdcionar = document.querySelector(
    "#adicionar_horario"
) as HTMLButtonElement

for (let horario of filteredPAT) {
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
    JSON.stringify(grade.filter((item: THorario) => item.tipo !== "PAT"))
)
function includePATOnInterface(
    diaSemana: number,
    horaInicio: string,
    horaFim: string
) {
    horaInicioNodeDom.value = horaInicio
    horaFimNodeDom.value = horaFim
    diaDaSemanaNodeDom.value = String(diaSemana)
    btnAdcionar.click()
}
