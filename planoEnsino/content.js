const url = document.URL
const idPlanoEnsino = url.split("/")[9]
const idDiario = url.split("/")[6]
const tableIdentificacao = document.querySelector("#PlanoEnsinoDiarioForm table")
const trCargaHoraria = tableIdentificacao.querySelector("tr:nth-child(5)")
const tdCargaHoraria = trCargaHoraria.querySelector("td:first-child")
const qtdeAulasUC = `
    <br>
    <b>Nº de aulas UC: </b><br>${getNumeroAulasUC()}
`
tdCargaHoraria.innerHTML += qtdeAulasUC


const divAdicionarProposta = document.querySelector('.adicionar_proposta')
const btnGerarProposta = document.createElement('button')
btnGerarProposta.setAttribute('type','button')
btnGerarProposta.setAttribute('id','btn_gerar_proposta')
btnGerarProposta.textContent = "Gerar Calendário da Proposta"
btnGerarProposta.classList.add('btn')
btnGerarProposta.classList.add('btn-mini')
btnGerarProposta.classList.add('btn-warning')
getNumeroAulasProposta().then((numeroAulas)=>{
    if(numeroAulas===0){
    divAdicionarProposta.appendChild(btnGerarProposta)
    }
})

btnGerarProposta.addEventListener('click',async ()=>{
    showModal("Gerando Calendário da Proposta")
    gerarProposta().then(()=>{
        document.location.reload()
    })

    
})


Date.prototype.getWeek = function(weekStart) {
    var januaryFirst = new Date(this.getFullYear(), 0, 1);
    if(weekStart !== undefined && (typeof weekStart !== 'number' || weekStart % 1 !== 0 || weekStart < 0 || weekStart > 6)) {
      throw new Error('Wrong argument. Must be an integer between 0 and 6.');
    }
    weekStart = weekStart || 0;
    return Math.floor((((this - januaryFirst) / 86400000) + januaryFirst.getDay() - weekStart) / 7);
};
// modal aguarde 

function showModal(message){

    const modal = document.createElement('div')
    modal.classList.add('modal-wrapper')
    modal.innerHTML = `<div class="modal-proposta">
                        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                        <h3>${message}</h3><h4>aguarde um momento</h4>
                       </div>`
        document.body.appendChild(modal)
}
function hideModal(){
    document.body.removeChild(document.body.querySelector('.modal-wrapper'))
}

async function gerarProposta(){
        const aulas = await criarListaDatasDeAula()
        let promisesGravarProposta = await prepararFormProposta(aulas)
        return Promise.all(promisesGravarProposta)
}

async function criarListaDatasDeAula() {
    const response = await getConteudoDiario()
    /*PARSEANDO RESPOSTA DE TEXTO DA REQUISIÇÃO PARA ARVORE DE ELEMENTOS */  
    const parser = new DOMParser()
    let docHTML = parser.parseFromString(response, "text/html")
    let tableConteudoDoDiario = docHTML.querySelectorAll("table.diario")[1]
    let trListaDeAulas = Array.from(tableConteudoDoDiario.querySelectorAll("tbody > tr"))

    /* MAPEANDO ELEMENTO PARA STRING DE DATA E CONVERTENDO PARA OBJETO DATE */
    let listaDatasDeAula = trListaDeAulas.map((tr) => {
        let dataAula = tr.querySelector("td:nth-child(2)").textContent.trim()
        return  parseStringToDate(dataAula)
    })
    // FILTRANDO AS DATAS E AGRUPANDO POR SEMANA

    let filtroPorSemana = []
    let aulasAgrupadasPorSemana = new Map()
    listaDatasDeAula.forEach((dataAula,index,array)=>{
       filtroPorSemana =  array.filter((dataAulaFilter)=>{
           return dataAulaFilter.getWeek() === dataAula.getWeek()
       })
       aulasAgrupadasPorSemana.set(dataAula.getWeek(),filtroPorSemana)

    })
    
    /* MAPEANDO PARA OBJETO MODELO PARA CADASTRAR A PROPOSTA*/
    let aulasModelProposta = Array.from(aulasAgrupadasPorSemana).map((aulasSemana)=>{
        let listaDataDasAulas = aulasSemana[1]
        return {
            dataInicial:Intl.DateTimeFormat('pt-BR').format(listaDataDasAulas[0]),
            dataFinal:Intl.DateTimeFormat('pt-BR').format(listaDataDasAulas[listaDataDasAulas.length-1]),
            qtde:listaDataDasAulas.length,
            sabadoLetivo:listaDataDasAulas[listaDataDasAulas.length-1].getDay()===6
        }
    })
    return aulasModelProposta
}
function getNumeroAulasUC() {
    const diarioTR = document.querySelector("table.diario tr:nth-child(2)")
    const diarioQtdeAulas = diarioTR.querySelector("td:last-child")
    const diarioQtdeAulasText = diarioQtdeAulas.textContent
    return Number(diarioQtdeAulasText.split("(")[0].trim())
}

async function getNumeroAulasProposta() {
    const dadosProposta = await getDadosPropostaTrabalho()
    
    const qtdeAulasProposta = dadosProposta.aaData.map((item) => {
        return item[2]
    }).reduce((acc, curr) => {
        return acc + curr
    }, 0)
    return qtdeAulasProposta
    
}
async function getDadosPropostaTrabalho() {
    const response = await fetch(`https://academico.ifms.edu.br/administrativo/professores/diario/${idDiario}/plano_ensino/json_proposta_trabalho/${idPlanoEnsino}?sEcho=1&iColumns=7&sColumns=%2C%2C%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=-1&mDataProp_0=0&sSearch_0=&bRegex_0=false&bSearchable_0=true&bSortable_0=true&mDataProp_1=1&sSearch_1=&bRegex_1=false&bSearchable_1=true&bSortable_1=true&mDataProp_2=2&sSearch_2=&bRegex_2=false&bSearchable_2=true&bSortable_2=true&mDataProp_3=3&sSearch_3=&bRegex_3=false&bSearchable_3=true&bSortable_3=true&mDataProp_4=4&sSearch_4=&bRegex_4=false&bSearchable_4=true&bSortable_4=true&mDataProp_5=5&sSearch_5=&bRegex_5=false&bSearchable_5=true&bSortable_5=true&mDataProp_6=6&sSearch_6=&bRegex_6=false&bSearchable_6=true&bSortable_6=true&sSearch=&bRegex=false&iSortCol_0=0&sSortDir_0=desc&iSortCol_1=1&sSortDir_1=desc&iSortingCols=2&_=1630278718236`)
    const json = await response.json()
    return json
}
async function getConteudoDiario() {
    const response = await fetch(`https://academico.ifms.edu.br/administrativo/professores/diario/${idDiario}/conteudo`)
    const data = await response.text()
    return data
}
async function getFormProposta() {
    const response = await fetch(`https://academico.ifms.edu.br/administrativo/professores/diario/${idDiario}/plano_ensino/adicionar_proposta_trabalho/${idPlanoEnsino}`)
    const data = await response.text()
    return data
} 
async function gravarProposta(form) {
    let formData = new FormData(form)
    return  fetch(`https://academico.ifms.edu.br/administrativo/professores/diario/${idDiario}/plano_ensino/salvar_form_proposta_trabalho`,
        {
            method: "POST",
            body: formData
        })
}
async function prepararFormProposta(aulas) {
    let response = await getFormProposta()
    const parser = new DOMParser()
    let docHTML = parser.parseFromString(response, "text/html")
    let formProposta = docHTML.querySelector("form#PlanoEnsinoPropostaTrabalhoDiarioForm")
    let selecOptionsMeses = Array.from(formProposta.querySelectorAll('select#PlanoEnsinoPropostaTrabalhoMes > option'))
    let mesesMap = new Map()
    selecOptionsMeses.forEach((option, index) => {
        index < 10 ? mesesMap.set(`0${index}`, option.value) : mesesMap.set(index, option.value)
    })
    let formPrincipal = document.querySelector('form')
    
    inputsProposta = Array.from(formProposta)
    let div = document.createElement('div')
    div.style.display = "none"
    inputsProposta.forEach(element => {
        div.appendChild(element)
    });
    formPrincipal.appendChild(div)
    let arrayPromises = []
    aulas.forEach(async (aula) => {
        formPrincipal.querySelector('input#PlanoEnsinoPropostaTrabalhoInicio').value = aula.dataInicial.split('/')[0]
        formPrincipal.querySelector('input#PlanoEnsinoPropostaTrabalhoFim').value = aula.dataFinal.split('/')[0]
        formPrincipal.querySelector('select#PlanoEnsinoPropostaTrabalhoMes').value = mesesMap.get(aula.dataInicial.split('/')[1])
        formPrincipal.querySelector('input#PlanoEnsinoPropostaTrabalhoQtAulas').value = aula.qtde
        formPrincipal.querySelector('textarea#PlanoEnsinoPropostaTrabalhoConteudo').value = "*" 
        if(aula.sabadoLetivo===true){
        formPrincipal.querySelector('input#PlanoEnsinoPropostaTrabalhoObservacoes').value =`${aula.dataFinal} - Sábado Letivo` 
        }else{
        formPrincipal.querySelector('input#PlanoEnsinoPropostaTrabalhoObservacoes').value =`` 
        }
        arrayPromises.push(gravarProposta(formPrincipal))
       
    })
    return arrayPromises
}

function parseStringToDate(string) {
    let stringFormat = string.replaceAll('/','-').split('-').reverse().join('-')
    let dateObject = new Date(`${stringFormat}T00:00:00`)
    return dateObject
    
}
