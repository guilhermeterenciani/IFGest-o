//PAT SIDE
//let regexpats = new RegExp(/https\:\/\/academico\.ifms\.edu\.br\/administrativo\/pats/i);
//https://academico.ifms.edu.br/administrativo/horario_docentes/editar/
//if(regexpats.test(urlAcademico)){
//alert("Estou na página de cadastro do PAT")

import { THorario } from "./types"
import Swal from "sweetalert2"
import { MODAL_CONFIRM_OPTIONS } from "../../utils/sweetAlert"
import { diaDaSemanaSelectOption } from "./periodos"
import "./adicionarPat.css"
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

const patId = document.querySelector("#PatId") as HTMLInputElement
filteredPAT.sort((a: THorario, b: THorario) => {
    if (a.diaDaSemana < b.diaDaSemana) return -1
    if (a.diaDaSemana > b.diaDaSemana) return 1
    return 0
})
if (filteredPAT.length != 0 && patId.value) {
    let horarios = filteredPAT.map((horario) => {
        return `<p>
            ${diaDaSemanaSelectOption.get(horario.diaDaSemana)} | ${
            horario.periodo.horaInicio
        } às ${horario.periodo.horaFim}
        
        </p>
        `
    })
    Swal.fire({
        ...MODAL_CONFIRM_OPTIONS,
        title: "Grade de Horário",

        html: `
            <div>
            <div>
               Você selecionou os horários abaixo na grade de horário do PIT:
               
            </div>
            <div class="horarios-msg">
               ${horarios.join("")}
            </div>
            Deseja adicioná-los na grade de horário deste PAT?
            </div>
        `
    }).then((result) => {
        if (result.isConfirmed) {
            incluirHorariosNaGrade()
            removerPATStorage()
        }
    })
} else {
    incluirHorariosNaGrade()
    removerPATStorage()
}

function removerPATStorage() {
    localStorage.setItem(
        "grade",
        JSON.stringify(grade.filter((item: THorario) => item.tipo !== "PAT"))
    )
}

function incluirHorariosNaGrade() {
    for (let horario of filteredPAT) {
        includePATOnInterface(
            horario.diaDaSemana,
            horario.periodo.horaInicio,
            horario.periodo.horaFim
        )
    }
}

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
