import { periodos } from "./periodosDeAula.mjs"
type THorario = {
    dataId: number
    diaDaSemana: number
    periodo: object
    tipoPAT?: string
    disponivel: boolean
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
        let periodo = indexTRArray + 1
        let tdChildElements = Array.from(element.querySelectorAll("td"))
        tdChildElements.map(
            (tableCell: HTMLTableCellElement, indexTDArray) => {}
        )
    })
}

function mapFreeTime(gradeHorario: Array<THorario>) {}

;(() => {
    let list = generateTableCellList()
    console.log(list)
})()
