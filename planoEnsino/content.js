
async function getDadosPropostaTrabalho(){
    const url = document.URL
    const idPlanoEnsino = url.split("/")[9]
    const idDiario = url.split("/")[6]
    const response = await fetch(`https://academico.ifms.edu.br/administrativo/professores/diario/${idDiario}/plano_ensino/json_proposta_trabalho/${idPlanoEnsino}?sEcho=1&iColumns=7&sColumns=%2C%2C%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=-1&mDataProp_0=0&sSearch_0=&bRegex_0=false&bSearchable_0=true&bSortable_0=true&mDataProp_1=1&sSearch_1=&bRegex_1=false&bSearchable_1=true&bSortable_1=true&mDataProp_2=2&sSearch_2=&bRegex_2=false&bSearchable_2=true&bSortable_2=true&mDataProp_3=3&sSearch_3=&bRegex_3=false&bSearchable_3=true&bSortable_3=true&mDataProp_4=4&sSearch_4=&bRegex_4=false&bSearchable_4=true&bSortable_4=true&mDataProp_5=5&sSearch_5=&bRegex_5=false&bSearchable_5=true&bSortable_5=true&mDataProp_6=6&sSearch_6=&bRegex_6=false&bSearchable_6=true&bSortable_6=true&sSearch=&bRegex=false&iSortCol_0=0&sSortDir_0=desc&iSortCol_1=1&sSortDir_1=desc&iSortingCols=2&_=1630278718236`)
    const json = await response.json()
    return json
}
function getNumeroAulasUC() {
    const diarioTR = document.querySelector("table.diario tr:nth-child(2)")
    const diarioQtdeAulas = diarioTR.querySelector("td:last-child")
    const diarioQtdeAulasText = diarioQtdeAulas.textContent
    return Number(diarioQtdeAulasText.split("(")[0].trim())
}

async function getNumeroAulasProposta(){
    const dadosProposta = await getDadosPropostaTrabalho()
    
    const qtdeAulasProposta = dadosProposta.aaData.map( (item) => {
          return item[2]
    }).reduce( (acc, curr) => {
         return acc + curr
    }, 0) 
    return qtdeAulasProposta

}
function exibirMensagem(qtdeAulasUC, qtdeAulasProposta){
    const message = document.createElement("div")
    if(qtdeAulasUC !== qtdeAulasProposta){
        message.classList.add("alert", "alert-danger")
        message.innerHTML = `<strong>ATENÇÃO!!</strong> Divergência na quantidade de aulas da Proposta de Trabalho.
            <div><strong>Nº de aulas UC: </strong>${qtdeAulasUC} </div> 
            <div><strong>Nº de aulas da Proposta:</strong> ${qtdeAulasProposta}</div>`

        const PlanoEnsinoDiarioForm = document.querySelector("#PlanoEnsinoDiarioForm")
        PlanoEnsinoDiarioForm.prepend(message)
    }

}
getNumeroAulasProposta().then( (qtdeAulasLancadas) => {
    exibirMensagem(getNumeroAulasUC(), qtdeAulasLancadas)
})


const tableIdentificacao = document.querySelector("#PlanoEnsinoDiarioForm table")
const trCargaHoraria = tableIdentificacao.querySelector("tr:nth-child(5)")
const tdCargaHoraria = trCargaHoraria.querySelector("td:first-child")
const qtdeAulasUC = `
    <br>
    <b>Nº de aulas UC: </b><br>${getNumeroAulasUC()}
`  
tdCargaHoraria.innerHTML += qtdeAulasUC
   



