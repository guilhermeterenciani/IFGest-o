import Swal from "sweetalert2"

import {
    MODAL_CONFIRM_OPTIONS,
    MODAL_LOADING_OPTIONS,
} from "../utils/sweetAlert"
import {
    getDadosPropostaTrabalho,
    getConteudoDiario,
    getFormProposta,
    gravarProposta,
} from "../services/api"
import "../utils/datePrototypeGetWeek"
const url = document.URL
const idPlanoEnsino = url.split("/")[9]
const idDiario = url.split("/")[6]
const tableIdentificacao = document.querySelector(
    "#PlanoEnsinoDiarioForm table",
)
const trCargaHoraria = tableIdentificacao.querySelector("tr:nth-child(5)")
const tdCargaHoraria = trCargaHoraria.querySelector("td:first-child")
const qtdeAulasUC = `
    <br>
    <b>Nº de aulas UC: </b><br>${getNumeroAulasUC()}
`
tdCargaHoraria.innerHTML += qtdeAulasUC

const divAdicionarProposta = document.querySelector(".adicionar_proposta")
const btnGerarProposta = document.createElement("button")
btnGerarProposta.setAttribute("type", "button")
btnGerarProposta.setAttribute("id", "btn_gerar_proposta")
btnGerarProposta.textContent = "Gerar Calendário da Proposta"
btnGerarProposta.classList.add("btn")
btnGerarProposta.classList.add("btn-mini")
btnGerarProposta.classList.add("btn-warning")
divAdicionarProposta.appendChild(btnGerarProposta)

btnGerarProposta.addEventListener("click", async () => {
    Swal.fire({
        ...MODAL_CONFIRM_OPTIONS,
        title: "Gerar Calendário da Proposta",
        text: `Este procedimento gera  o calendário da proposta do plano de ensino de forma automática, deseja continuar?`,
    }).then(async (result) => {
        if (result.isConfirmed) {
            const numeroDeAulasDaProposta = await getNumeroAulasProposta()

            if (numeroDeAulasDaProposta > 0) {
                Swal.hideLoading()
                Swal.update({
                    title: "Não foi possível gerar o calendário da proposta",
                    icon: "error",
                    html: `
                        <p>
                            Já existe uma proposta cadastrada para este plano de ensino!  
                        </p>
                    `,
                })
            } else {
                await gerarProposta()
                document.location.reload()
            }
        }
    })
})

async function gerarProposta() {
    Swal.update({
        title: "Gerando Calendário da Proposta",
        text: "aguarde...",
    })
    const aulas = await criarListaDatasDeAula()
    if (!aulas) return false

    let promisesGravarProposta = await prepararFormProposta(aulas)
    return Promise.all(promisesGravarProposta)
}

async function criarListaDatasDeAula() {
    const response = await getConteudoDiario(idDiario)
    /*PARSEANDO RESPOSTA DE TEXTO DA REQUISIÇÃO PARA ARVORE DE ELEMENTOS */
    const parser = new DOMParser()
    let docHTML = parser.parseFromString(response, "text/html")
    let tableConteudoDoDiario =
        docHTML.querySelectorAll("table.diario")[1] ?? null

    if (!tableConteudoDoDiario) {
        return Promise.resolve(false)
    }

    let trListaDeAulas = Array.from(
        tableConteudoDoDiario.querySelectorAll("tbody > tr"),
    )

    /* MAPEANDO ELEMENTO PARA STRING DE DATA E CONVERTENDO PARA OBJETO DATE */
    let listaDatasDeAula = trListaDeAulas.map((tr) => {
        let dataAula = tr.querySelector("td:nth-child(2)").textContent.trim()
        return parseStringToDate(dataAula)
    })
    // FILTRANDO AS DATAS E AGRUPANDO POR SEMANA

    let filtroPorSemana = []
    let aulasAgrupadasPorSemana = new Map()
    listaDatasDeAula.forEach((dataAula, index, array) => {
        filtroPorSemana = array.filter((dataAulaFilter) => {
            return dataAulaFilter.getWeek() === dataAula.getWeek()
        })
        aulasAgrupadasPorSemana.set(dataAula.getWeek(), filtroPorSemana)
    })

    /* MAPEANDO PARA OBJETO MODELO PARA CADASTRAR A PROPOSTA*/
    let aulasModelProposta = Array.from(aulasAgrupadasPorSemana).map(
        (aulasSemana) => {
            let listaDataDasAulas = aulasSemana[1]
            return {
                dataInicial: Intl.DateTimeFormat("pt-BR").format(
                    listaDataDasAulas[0],
                ),
                dataFinal: Intl.DateTimeFormat("pt-BR").format(
                    listaDataDasAulas[listaDataDasAulas.length - 1],
                ),
                qtde: listaDataDasAulas.length,
                sabadoLetivo:
                    listaDataDasAulas[
                        listaDataDasAulas.length - 1
                    ]?.getDay() === 6 ?? false,
            }
        },
    )
    return aulasModelProposta
}
function getNumeroAulasUC() {
    const diarioTR = document.querySelector("table.diario tr:nth-child(2)")
    const diarioQtdeAulas = diarioTR.querySelector("td:last-child")
    const diarioQtdeAulasText = diarioQtdeAulas.textContent
    return Number(diarioQtdeAulasText.split("(")[0].trim())
}

async function getNumeroAulasProposta() {
    Swal.fire({
        ...MODAL_LOADING_OPTIONS,
        title: "Consultando aulas no Plano de Ensino",
        text: "Aguarde...",
    })
    const dadosProposta = await getDadosPropostaTrabalho(
        idDiario,
        idPlanoEnsino,
    )
    const qtdeAulasProposta = dadosProposta.aaData
        .map((item) => {
            return item[2]
        })
        .reduce((acc, curr) => {
            return acc + curr
        }, 0)
    return qtdeAulasProposta
}

async function prepararFormProposta(aulas) {
    let response = await getFormProposta(idDiario, idPlanoEnsino)
    const parser = new DOMParser()
    let docHTML = parser.parseFromString(response, "text/html")
    let formProposta = docHTML.querySelector(
        "form#PlanoEnsinoPropostaTrabalhoDiarioForm",
    )
    let selecOptionsMeses = Array.from(
        formProposta.querySelectorAll(
            "select#PlanoEnsinoPropostaTrabalhoMes > option",
        ),
    )
    let mesesMap = new Map()
    selecOptionsMeses.forEach((option, index) => {
        index < 10
            ? mesesMap.set(`0${index}`, option.value)
            : mesesMap.set(`${index}`, option.value)
    })
    let formPrincipal = document.querySelector("form")

    const inputsProposta = Array.from(formProposta)
    let div = document.createElement("div")
    div.style.display = "none"
    inputsProposta.forEach((element) => {
        div.appendChild(element)
    })
    formPrincipal.appendChild(div)
    let arrayPromises = []
    aulas.forEach(async (aula) => {
        formPrincipal.querySelector(
            "input#PlanoEnsinoPropostaTrabalhoInicio",
        ).value = aula.dataInicial.split("/")[0]
        formPrincipal.querySelector(
            "input#PlanoEnsinoPropostaTrabalhoFim",
        ).value = aula.dataFinal.split("/")[0]
        formPrincipal.querySelector(
            "select#PlanoEnsinoPropostaTrabalhoMes",
        ).value = mesesMap.get(aula.dataInicial.split("/")[1])
        formPrincipal.querySelector(
            "input#PlanoEnsinoPropostaTrabalhoQtAulas",
        ).value = aula.qtde
        formPrincipal.querySelector(
            "textarea#PlanoEnsinoPropostaTrabalhoConteudo",
        ).value = "*"
        if (aula.sabadoLetivo === true) {
            formPrincipal.querySelector(
                "input#PlanoEnsinoPropostaTrabalhoObservacoes",
            ).value = `${aula.dataFinal} - Sábado Letivo`
        } else {
            formPrincipal.querySelector(
                "input#PlanoEnsinoPropostaTrabalhoObservacoes",
            ).value = ``
        }
        arrayPromises.push(gravarProposta(formPrincipal, idDiario))
    })
    return arrayPromises
}

function parseStringToDate(string) {
    let stringFormat = string
        .replaceAll("/", "-")
        .split("-")
        .reverse()
        .join("-")
    let dateObject = new Date(`${stringFormat}T00:00:00`)
    return dateObject
}
