import { periodos } from "./periodosDeAula.mjs"
type THorario = {
    dataIdRow: number
    dataIdCol: number
    diaDaSemana: number
    periodo: object
    tipoPAT?: string
    ocupado: boolean
}
let gradeHorario: Array<THorario> = new Array<THorario>()

function generateTableCellList() {
    const gradeHorarioTableTbody = document.querySelector(
        ".horario.diario>tbody"
    ) as HTMLTableSectionElement
    const trNodeList = gradeHorarioTableTbody.querySelectorAll("tr")
    const trArrayList = Array.from(trNodeList)
    trArrayList.shift()
    let tdNodeArrayList: Array<HTMLTableCellElement> = new Array<
        HTMLTableCellElement
    >()
    trArrayList.forEach((element, indexTRArray) => {
        let diaDaSemana = 1
        let tdChildElements = Array.from(element.querySelectorAll("td"))
        tdChildElements.map((tableCell: HTMLTableCellElement, indexTDArray) => {
            diaDaSemana += indexTDArray
            let horario: THorario = {
                dataIdRow: indexTRArray,
                dataIdCol: indexTDArray,
                diaDaSemana,
                periodo: periodos[indexTRArray],
                ocupado: tableCell.hasChildNodes()
            }
            gradeHorario.push(horario)
        })
    })
}

function mapFreeTime(gradeHorario: Array<THorario>) {}

;(() => {
    generateTableCellList()
    console.log(gradeHorario)
})()
