trArrayList.forEach((trElement, indexTr) => {
    let thElement = trElement.querySelector("th")
    if (thElement) trElement.removeChild(thElement)
    let tableCellElementList = Array.from(trElement.children)
    tableCellElementList.shift()
    tableCellElementList.forEach((tdElement, index) => {
        let horario: THorario = {
            diaDaSemana: index,
            horarioGrade: {
                tdElement: tdElement,
                intervalo: tempos[indexTr],
                isEmpty: tdElement.childElementCount === 0
            }
        }
        gradeHorario.push(horario)
    })
})
...tdChildElements.map((tdElement, indexTD) => {
    tdElement.setAttribute(
        "data-grade-position",
        `${indexTR}-${indexTD}`
    )
    return tdElement
})