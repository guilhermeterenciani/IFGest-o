import Swal from "sweetalert2"
import "./style.css"
import {
    MODAL_CONFIRM_OPTIONS,
    MODAL_LOADING_OPTIONS
} from "../utils/sweetAlert"
import {
    getDadosPropostaTrabalho,
    getConteudoDiario,
    getFormProposta,
    gravarProposta,
    getFormPropostaTrabalhoPlanoDeEnsino,
    gravarPropostaEditada
} from "../services/api"
import "../utils/datePrototypeGetWeek"
const url = document.URL
const idPlanoEnsino = url.split("/")[9]
const idDiario = url.split("/")[6]
const tableIdentificacao = document.querySelector(
    "#PlanoEnsinoDiarioForm table"
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
        text: `Este procedimento gera  o calendário da proposta do plano de ensino de forma automática, deseja continuar?`
    }).then(async (result) => {
        if (result.isConfirmed) {
            const numeroDeAulasDaProposta = await getNumeroAulasProposta()

            if (numeroDeAulasDaProposta > 0) {
                Swal.hideLoading()
                Swal.update({
                    showConfirmButton: true,
                    title: "Não foi possível gerar o calendário da proposta",
                    icon: "error",
                    html: `
                        <p>
                            Já existe uma proposta cadastrada para este plano de ensino!  
                        </p>
                    `
                })
            } else {
                await gerarProposta()
                document.location.reload()
            }
        }
    })
})

async function gerarProposta() {
    Swal.fire({
        title: "Gerando Calendário da Proposta",
        text: "aguarde...",
        ...MODAL_LOADING_OPTIONS
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
        tableConteudoDoDiario.querySelectorAll("tbody > tr")
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
                    listaDataDasAulas[0]
                ),
                dataFinal: Intl.DateTimeFormat("pt-BR").format(
                    listaDataDasAulas[listaDataDasAulas.length - 1]
                ),
                qtde: listaDataDasAulas.length,
                sabadoLetivo:
                    listaDataDasAulas[
                        listaDataDasAulas.length - 1
                    ]?.getDay() === 6 ?? false
            }
        }
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
        text: "Aguarde..."
    })
    const dadosProposta = await getDadosPropostaTrabalho(
        idDiario,
        idPlanoEnsino
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
        "form#PlanoEnsinoPropostaTrabalhoDiarioForm"
    )
    let selecOptionsMeses = Array.from(
        formProposta.querySelectorAll(
            "select#PlanoEnsinoPropostaTrabalhoMes > option"
        )
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
            "input#PlanoEnsinoPropostaTrabalhoInicio"
        ).value = aula.dataInicial.split("/")[0]
        formPrincipal.querySelector(
            "input#PlanoEnsinoPropostaTrabalhoFim"
        ).value = aula.dataFinal.split("/")[0]
        formPrincipal.querySelector(
            "select#PlanoEnsinoPropostaTrabalhoMes"
        ).value = mesesMap.get(aula.dataInicial.split("/")[1])
        formPrincipal.querySelector(
            "input#PlanoEnsinoPropostaTrabalhoQtAulas"
        ).value = aula.qtde
        formPrincipal.querySelector(
            "textarea#PlanoEnsinoPropostaTrabalhoConteudo"
        ).value = "*"
        if (aula.sabadoLetivo === true) {
            formPrincipal.querySelector(
                "input#PlanoEnsinoPropostaTrabalhoObservacoes"
            ).value = `${aula.dataFinal} - Sábado Letivo`
        } else {
            formPrincipal.querySelector(
                "input#PlanoEnsinoPropostaTrabalhoObservacoes"
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



/* Author: Guilherme Figueiredo Terenciani */
/* Date: 2023-02-06 */
/* Version: 1.0.0 */
/* Description: Script de adição de conteúdo no plano de ensino pela interface.*/

//TODO: Encontrar uma alternativa melhor no futuro
//Vai dar problema se o usuário tiver uma internet lenta e o script for executado antes do carregamento da página
setTimeout(() => {

    let tableBody = document.querySelectorAll("#proposta_trabalho > tbody > tr > td:nth-child(7)");
    tableBody.forEach((element) => {
        let link = document.createElement("a");
        link.innerHTML = "Editar";
        link.href = "#";
        element.appendChild(link);
        link.addEventListener("click", (event) => {
            event.preventDefault();
            //Pega o td do conteúdo a ser desenvolvido no detalhamento da proposta de trabalho
            let td = event.target.parentNode.previousSibling.previousSibling;
            //TODO: Tem que melhorar o textarea para ele não ficar com value undefined
            let idProposta = event.target.parentNode.childNodes[2].attributes[4].value;
            let result = propostaTrabalho.filter((item) => item.idProposta === idProposta);
            if(result.length === 0){
                propostaTrabalho.push({
                    idProposta: idProposta,
                    conteudo: td.innerText,
                    praticasEnsino: [],
                    recursoEnsino: []
                });
            }
            else{
                result[0].conteudo = td.innerText;
            }
            localStorage.setItem("propostaTrabalho", JSON.stringify(propostaTrabalho));
            

            if(!td.querySelector("textarea")){
                let previousText = td.innerText;
                td.innerHTML = `<textarea class='text-area-content' type='text' value='' placeholder='Digite o conteúdo'>${previousText}</textarea>`;
                td.querySelector("textarea").addEventListener("change", (event) => {
                    //console.log(event);
                    let value = event.target.parentElement.nextSibling.nextElementSibling.childNodes[2].attributes[4].value;
                    let result = propostaTrabalho.filter((item) => item.idProposta === value);
                    if(result.length === 0){
                        propostaTrabalho.push({
                            idProposta: value,
                            conteudo: event.target.value,
                            praticasEnsino: [],
                            recursoEnsino: []
                        });
                    }
                    else{
                        result[0].conteudo = event.target.value;
                    }
                    localStorage.setItem("propostaTrabalho", JSON.stringify(propostaTrabalho));
                    
                });
            }
            //Pega o td da metodologia a ser desenvolvida no detalhamento da proposta de trabalho
            let tableBodyMetodologia =  event.target.parentNode.previousSibling

            //Verified previous marked praticas de ensino and create a array with de marked_praticas_ensino
            //style of técnicas de ensino text that is in the table "Técnicas de Ensino: Aula prática / Estudo de caso / Júri simulado / Expositiva/dialogada"
            let patternTecnicasEnsino = /Técnicas de Ensino: ([\w\s\/áéíóú]+)/;
            let match = tableBodyMetodologia.innerHTML.match(patternTecnicasEnsino);
            let marked_praticas_ensino = [];
            if(match){
                marked_praticas_ensino = match[1].split(" / ");
            }

            
            let patternRecursoEnsino = /Recursos de Ensino: ([\w\s\/áéíóú]+)/;
            match = tableBodyMetodologia.innerHTML.match(patternRecursoEnsino);
            let marked_recursos_ensino = [];
            if(match){
                marked_recursos_ensino = match[1].split(" / ");
            }
            console.log(marked_praticas_ensino);
            tableBodyMetodologia.innerHTML="";
            tableBodyMetodologia.classList.add("praticas_ensino");
            let div = document.createElement("div");
            div.classList.add("title-checkbox");
            div.innerHTML="Práticas de Ensino:";
            tableBodyMetodologia.appendChild(div);
            tableBodyMetodologia.appendChild(createContentCheckboxTecnicasEnsino(idProposta,marked_praticas_ensino));

            let divRecursos = document.createElement("div");
            divRecursos.classList.add("title-checkbox");
            divRecursos.innerHTML="Recursos de Ensino:";
            tableBodyMetodologia.appendChild(divRecursos);
            tableBodyMetodologia.appendChild(createContentCheckboxRecursoEnsino(idProposta,marked_recursos_ensino));
        });

        //Criar um botão do tipo link para salvar as informações
        let linkSave = document.createElement("a");
        linkSave.innerHTML = "Salvar";
        linkSave.href = "#";
        element.appendChild(linkSave);
        linkSave.addEventListener("click", async (event) => {
            event.preventDefault();
            //console.log("clicouSalvar",event);
            let proposta_id = event.target.parentNode.childNodes[2].attributes[4].value;
            let storage = localStorage.getItem("propostaTrabalho");
            let propostaTrabalho = storage ? JSON.parse(storage) : []
            let propostaASerCadastrada = propostaTrabalho.filter((item) => item.idProposta == proposta_id)[0];
            console.log("propostaASerCadastrada",propostaASerCadastrada);
            // let formProposta = await getFormPropostaTrabalhoPlanoDeEnsino(idDiario,proposta_id);
            // console.log("Form proposta",formProposta)
            // const parser = new DOMParser()
            // let docHTML = parser.parseFromString(formProposta , "text/html");
            // console.log("docHTML",docHTML);
            // let form = docHTML.getElementById("PlanoEnsinoPropostaTrabalhoDiarioForm");
            // let inputConteudo = docHTML.getElementById("PlanoEnsinoPropostaTrabalhoConteudo");
            // //     console.log(inputConteudo)
            // inputConteudo.value = propostaASerCadastrada.conteudo;
            // console.log("propostaConteudo",propostaASerCadastrada.conteudo);
            // let button = document.getElementById("salvar_proposta_trabalho");
            // // button.type = "submit";
            // // button.style.display = "none";
            // // form.appendChild(button);
            // button.click();

            //console.log("form",form);
            //let formData = new FormData(form)
            //console.log(formData);

            //let algo 

        //     event.target.parentNode.childNodes[2].click();
        //     setTimeout(() => {
        //         let inputConteudo = document.getElementById("PlanoEnsinoPropostaTrabalhoConteudo");
        //         console.log(inputConteudo)
        //         inputConteudo.value = propostaASerCadastrada.conteudo;

        //         let selectPraticasEnsino = document.getElementById("select_adicionar_tecnica");
        //         for(let item of propostaASerCadastrada.praticasEnsino){
        //             selectPraticasEnsino.value = item;
        //             selectPraticasEnsino.dispatchEvent(new Event('change'));
        //         }
        //         let button = document.getElementById("salvar_proposta_trabalho");
        //         button.click();
        //         let buttonClose = document.getElementById("modal_editar_proposta");
        //         buttonClose.querySelector("button.close").click();
        //     }, 2000);

        // 
        let response = await getFormPropostaTrabalhoPlanoDeEnsino(idDiario,proposta_id);
            // console.log("Form proposta",formProposta)
        const parser = new DOMParser()
        let docHTML = parser.parseFromString(response , "text/html");
        let formProposta = docHTML.querySelector(
            "form#PlanoEnsinoPropostaTrabalhoDiarioForm"
        )
        let formPrincipal = document.querySelector("form");
        //console.log("formPrincipal",formPrincipal);
        const inputsProposta = Array.from(formProposta)
        
        let div = document.createElement("div")
        div.style.display = "none"
        inputsProposta.forEach((element) => {
            div.appendChild(element)
        })
        formPrincipal.appendChild(div)
        formPrincipal.querySelector(
            "textarea#PlanoEnsinoPropostaTrabalhoConteudo"
        ).value = propostaASerCadastrada.conteudo;
            
        
        let selectTecnicasEnsino = formPrincipal.querySelector("select#PlanoEnsinoPropostaTrabalhoTecnicasEnsino");
        let options = Array.from(selectTecnicasEnsino.querySelectorAll("option"));
        options.forEach((option) => {
            if (!propostaASerCadastrada.praticasEnsino.includes(option.value)) {
                option.remove();
            }
        });
        for (let item of propostaASerCadastrada.praticasEnsino) {
            let option = document.createElement("option");
            option.value = item;
            option.selected = true;
            selectTecnicasEnsino.appendChild(option);
        }

        let selectRecursoEnsino = formPrincipal.querySelector("select#PlanoEnsinoPropostaTrabalhoRecursosEnsino");
        options.forEach((option) => {
            if (!propostaASerCadastrada.recursoEnsino.includes(option.value)) {
                option.remove();
            }
        });
        for (let item of propostaASerCadastrada.recursoEnsino) {
            let option = document.createElement("option");
            option.value = item;
            option.selected = true;
            selectRecursoEnsino.appendChild(option);
        }

        let res = await gravarPropostaEditada(formPrincipal,idDiario);
        let tex = await res.text();
        console.log("Resposta send",tex);
        //TODO: conferir se realmente deu certo gravar a proposta editada.
        //if(tex.includes("Proposta de trabalho salva com sucesso!"){}
            //limpar o caompo de localstorage após salvar.
            let novaPropostaTrabalho = propostaTrabalho.filter((item) => item.idProposta != proposta_id);
            localStorage.setItem("propostaTrabalho",JSON.stringify(novaPropostaTrabalho));

        
        //Optional reload here
        //document.location.reload()

        //TODO: tirar daqui depois...
        //console.log("res",tex);
        //setTimeout(() => {
            document.location.reload();
        //}, 1000);
        });

    });
}, 1000);
let storage = localStorage.getItem("propostaTrabalho");
let propostaTrabalho = storage ? JSON.parse(storage) : []

function createContentCheckboxTecnicasEnsino(idProposta,marked_praticas_ensino){
    let div = document.createElement("div");
    div.classList.add("content-checkbox");
    let storage = localStorage.getItem("propostaTrabalho");
    let propostaTrabalho = storage ? JSON.parse(storage) : []
    let propostaASerEditada = propostaTrabalho.find((item) => item.idProposta == idProposta);
    if(!propostaASerEditada){
        propostaASerEditada = {
            idProposta,
            conteudo:"",
            praticasEnsino:marked_praticas_ensino
        }
        propostaTrabalho.push(propostaASerEditada);
    }
    else{
        propostaASerEditada.praticasEnsino = marked_praticas_ensino;
        
    }
    //console.log("propostaTrabalhoNova",propostaTrabalho);
    localStorage.setItem("propostaTrabalho",JSON.stringify(propostaTrabalho));
    for(let item of praticas_ensino){
        let a = document.createElement("a");
        if(marked_praticas_ensino.includes(item)){
            a.classList.add("item-checkbox","marked");
        }
        a.classList.add("item-checkbox");
        a.href = "javascript:void(0);"
        a.onclick=handlePraticasEnsino;
        a.innerText = item;
        div.appendChild(a);
    };
    return div;
}
function createContentCheckboxRecursoEnsino(idProposta,marked_recursos_ensino){
    let div = document.createElement("div");
    div.classList.add("content-checkbox");
    let storage = localStorage.getItem("propostaTrabalho");
    let propostaTrabalho = storage ? JSON.parse(storage) : []
    let propostaASerEditada = propostaTrabalho.find((item) => item.idProposta == idProposta);

    propostaASerEditada.recursoEnsino = marked_recursos_ensino;

    //console.log("propostaTrabalhoNova",propostaTrabalho);
    localStorage.setItem("propostaTrabalho",JSON.stringify(propostaTrabalho));
    for(let item of recursos_ensino){
        let a = document.createElement("a");
        if(marked_recursos_ensino.includes(item)){
            a.classList.add("item-checkbox","marked");
        }
        a.classList.add("item-checkbox");
        a.href = "javascript:void(0);"
        a.onclick=handleRecursoEnsino;
        a.innerText = item;
        div.appendChild(a);
    };
    return div;
}
const praticas_ensino = 
    ["Aula prática",
    "Debate",
    "Dramatização",
    "Estudo de caso",
    "Estudo dirigido",
    "Expositiva/dialogada",
    "Extensão",
    "Júri simulado",
    "Painel integrado",
    "Palestra",
    "Pesquisa",
    "Seminário",
    "Trabalho em grupo",
    "Visita técnica",
    "Outra (especificar)"]
    const recursos_ensino=
    ["Biblioteca",
    "Ficha avaliativa",
    "Filme",
    "Laboratório",
    "Livro didático",
    "Lousa Digital",
    "Material concreto específico",
    "Material impresso (apostila, textos)",
    "Projetor multimídia",
    "Quadro branco/canetão",
    "TV, DVD",
    "Outro (especificar)"]

function handlePraticasEnsino(event){
    let value = event.target.parentElement.parentNode.nextSibling.childNodes[2].attributes[4].value;
    let storage = localStorage.getItem("propostaTrabalho");
    let propostaTrabalho = storage ? JSON.parse(storage) : []
    let result = propostaTrabalho.filter((item) => item.idProposta === value);
    if(result.length === 0){
        propostaTrabalho.push({
            idProposta: value,
            praticasEnsino: [event.target.innerText]
        });
        localStorage.setItem("propostaTrabalho", JSON.stringify(propostaTrabalho));
        event.target.classList.add("marked");
        return;
    }
    if(result[0].praticasEnsino.includes(event.target.innerText)){
        result[0].praticasEnsino = result[0].praticasEnsino.filter((item) => item !== event.target.innerText);
        localStorage.setItem("propostaTrabalho", JSON.stringify(propostaTrabalho));
        event.target.classList.remove("marked");
        return;
    }
    propostaTrabalho.map((item) => {
        if(item.idProposta === value){
            item.praticasEnsino.push(event.target.innerText);
        }
    });
    localStorage.setItem("propostaTrabalho", JSON.stringify(propostaTrabalho));
    event.target.classList.add("marked");
}
function handleRecursoEnsino(event){
    let value = event.target.parentElement.parentNode.nextSibling.childNodes[2].attributes[4].value;
    let storage = localStorage.getItem("propostaTrabalho");
    let propostaTrabalho = storage ? JSON.parse(storage) : []
    let result = propostaTrabalho.filter((item) => item.idProposta === value);
    if(result[0].recursoEnsino.includes(event.target.innerText)){
        result[0].recursoEnsino = result[0].recursoEnsino.filter((item) => item !== event.target.innerText);
        localStorage.setItem("propostaTrabalho", JSON.stringify(propostaTrabalho));
        event.target.classList.remove("marked");
        return;
    }
    propostaTrabalho.map((item) => {
        if(item.idProposta === value){
            item.recursoEnsino.push(event.target.innerText);
        }
    });
    localStorage.setItem("propostaTrabalho", JSON.stringify(propostaTrabalho));
    event.target.classList.add("marked");
}