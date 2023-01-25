import { diaDaSemana, periodos } from "./periodosDeAula.mjs"
type THorario = {
    dataRowId: number
    dataColId: number
    diaDaSemana: number
    periodo: {
        horaInicio: string
        horaFim: string
    }
    tipoPAT?: string
    ocupado: boolean
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
                    ocupado: tableCell.hasChildNodes()
                }
                return horario
            }
        )
        gradeDeHorario.push(...horariosTR)
    })
    return gradeDeHorario
}

function gerarAcoesNaGradeDeHorario(gradeDeHorarioModel: Array<THorario>) {}

function criarBotaoDeAcao(gradeDeHorarioModel: Array<THorario>) {
    gradeDeHorarioModel.forEach((horario) => {
        if (!horario.ocupado) {
            horario.element.innerHTML = /*html*/ `
            <select>
                <option selected disabled>...</option>
                <optgroup label="${diaDaSemana[horario.dataColId]} ${
                horario.periodo.horaInicio
            } - ${horario.periodo.horaFim}">
                <option>PAT</option>
                <option>P</option>
                <option>PE</option>
                <optgroup>
            </select>
        `
        }
    })
}

;(() => {
    gradeDeHorarioModel.push(...gerarGradeDeHorarioModel())
    criarBotaoDeAcao(gradeDeHorarioModel)
    console.log(gradeDeHorarioModel)
})()
