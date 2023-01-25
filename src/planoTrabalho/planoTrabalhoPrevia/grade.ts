import { diaDaSemana, periodos } from "./periodosDeAula.mjs"
localStorage.setItem("grade", "[]")
enum TipoHorario {
    NONE = "NONE",
    PAT = "PAT",
    PE = "PE",
    P = "P"
}
enum StatusHorario {
    OCUPADO = "OCUPADO",
    LIVRE = "LIVRE",
    PENDENTE = "PENDENTE"
}
type THorario = {
    dataRowId: number
    dataColId: number
    diaDaSemana: number
    periodo: {
        horaInicio: string
        horaFim: string
    }
    tipo?: TipoHorario
    status: StatusHorario
    element: HTMLTableCellElement
}

const gradeDeHorarioModel: Array<THorario> = new Array<THorario>()

function gerarGradeDeHorarioModel() {
    const gradeDeHorario: Array<THorario> = []
    const gradeHorarioTableTbody = document.querySelector(
        ".horario.diario>tbody"
    ) as HTMLTableSectionElement
    const trNodeList = gradeHorarioTableTbody.querySelectorAll("tr")
    const trArrayList = Array.from(trNodeList)
    trArrayList.pop() //remove a TR com o total de horas por dia da semana
    trArrayList.forEach((element, indexTRArray) => {
        let diaDaSemana = 1
        let tdChildElements = Array.from(element.querySelectorAll("td"))
        tdChildElements.shift() // remove a TD com o rótulo : "1º tempo,2º tempo,..."
        tdChildElements.forEach(
            (tableCell: HTMLTableCellElement, indexTDArray) => {
                tableCell.setAttribute("data-rowId", `${indexTRArray}`)
                tableCell.setAttribute("data-colId", `${indexTDArray}`)
            }
        )
        let horariosTR = tdChildElements.map(
            (tableCell: HTMLTableCellElement, indexTDArray) => {
                diaDaSemana += indexTDArray
                let horario: THorario = {
                    element: tableCell,
                    dataRowId: indexTRArray,
                    dataColId: indexTDArray,
                    diaDaSemana,
                    periodo: periodos[indexTRArray],
                    status: tableCell.hasChildNodes()
                        ? StatusHorario.OCUPADO
                        : StatusHorario.LIVRE
                }
                return horario
            }
        )
        gradeDeHorario.push(...horariosTR)
    })
    return gradeDeHorario
}

function adicionarCaixaDeSelecaoTipoDeHorario(
    gradeDeHorarioModel: Array<THorario>
) {
    gradeDeHorarioModel.forEach((horario) => {
        if (horario.status === StatusHorario.LIVRE) {
            horario.element.appendChild(criarCaixaDeSelecao(horario))
        }
    })
}

function criarCaixaDeSelecao(horario: THorario) {
    const selectEl = document.createElement("select")
    const optionGroupEl = document.createElement("optgroup")
    optionGroupEl.setAttribute(
        "label",
        `${diaDaSemana[horario.dataColId]} ${horario.periodo.horaInicio} - ${
            horario.periodo.horaFim
        }`
    )
    const optionNone = document.createElement("option")
    optionNone.setAttribute("selected", "selected")
    optionNone.value = TipoHorario.NONE
    const optionPAT = document.createElement("option")
    optionPAT.value = TipoHorario.PAT
    optionPAT.textContent = TipoHorario.PAT
    const optionP = document.createElement("option")
    optionP.value = TipoHorario.P
    optionP.textContent = TipoHorario.P
    const optionPE = document.createElement("option")
    optionPE.value = TipoHorario.PE
    optionPE.textContent = TipoHorario.PE

    optionGroupEl.appendChild(optionNone)
    optionGroupEl.appendChild(optionPAT)
    optionGroupEl.appendChild(optionP)
    optionGroupEl.appendChild(optionPE)
    selectEl.appendChild(optionGroupEl)
    selectEl.addEventListener("change", () => {
        criarBlocoDeHorario(selectEl, horario)
    })
    return selectEl
}
function criarBlocoDeHorario(selectEl: HTMLSelectElement, horario: THorario) {
    let tipoHorario = selectEl.value
    switch (tipoHorario) {
        case TipoHorario.P:
            horario.tipo = TipoHorario.P
            criarBlocoP(horario)
            break
        case TipoHorario.PE:
            horario.tipo = TipoHorario.PE
            criarBlocoPE(horario)
            break
        case TipoHorario.PAT:
            horario.tipo = TipoHorario.PAT
            criarBlocoPAT(horario)
            break
        default:
            break
    }
}
function criarBlocoP(horario: THorario) {
    horario.element.innerHTML = /*html*/ `
    <div class="caixa_horario caixa_horario_p pendente">
        <span class="badge badge-important" title="Prévia: Clique em Adicionar Atividade (Preparação)"><i class="icon-exclamation-sign icon-white"></i>Prévia</span>
        <div class="rotulo-intervalo">
            <div><strong>Preparação</strong></div>
            <div> ${horario.periodo.horaInicio} - ${horario.periodo.horaFim}</div>
        </div>
        <button type="button" class="btn btn-link btn-mini" title="Editar"><i class="icon-edit"></i></button>
    </div>
    `
    gravarLocaStorage(horario)
}
function criarBlocoPE(horario: THorario) {
    horario.element.innerHTML = /*html*/ `
    <div class="hovered  caixa_horario caixa_horario_pe pendente">
        <span class="badge badge-important" title="Prévia: Clique em Adicionar Atividade (Permanência)"><i class="icon-exclamation-sign icon-white"></i>Prévia</span>
        <div class="rotulo-intervalo">
            <div><strong>Permanência</strong></div>
            <div> ${horario.periodo.horaInicio} - ${horario.periodo.horaFim}</div>
        </div>
        <button type="button" class="btn btn-link btn-mini" title="Editar"><i class="icon-edit"></i></button>
</div>
    `
    gravarLocaStorage(horario)
}
function criarBlocoPAT(horario: THorario) {
    horario.element.innerHTML = /*html*/ `
    <div class="hovered  caixa_horario caixa_horario_pat pendente">
        <span class="badge badge-important" title="Prévia: Clique em Adicionar Atividade (PAT)"><i class="icon-exclamation-sign icon-white"></i>Prévia</span>
        <div class="rotulo-intervalo">
            <div><strong>PAT</strong></div>
            <div> ${horario.periodo.horaInicio} - ${horario.periodo.horaFim}</div>
        </div>
        <button type="button" class="btn btn-link btn-mini" title="Editar"><i class="icon-edit"></i></button>
</div>
    `
    gravarLocaStorage(horario)
}
function gravarLocaStorage(horario: THorario) {
    let gradeHorarioStorage = localStorage.getItem("grade")

    let gradeHorario = gradeHorarioStorage
        ? JSON.parse(gradeHorarioStorage)
        : []
    gradeHorario.push(horario)
    localStorage.setItem("grade", JSON.stringify(gradeHorario))
}
function consultarLocalStorage() {}

;(() => {
    gradeDeHorarioModel.push(...gerarGradeDeHorarioModel())
    adicionarCaixaDeSelecaoTipoDeHorario(gradeDeHorarioModel)
    console.log(gradeDeHorarioModel)
})()
