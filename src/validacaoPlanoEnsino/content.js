
//import Swal from 'sweetalert2'
const tempoAula = 45;

const btnEnviar = document.getElementById('btn_encaminhar_aprovacao')

const btnSalvar = document.querySelector("#PlanoEnsinoDiarioForm > div.control-group > div > button.btn.btn-success")
//Criate a button to validade and put it in the same place as the btnEnviar
if(await validaPlanoEnsino()){
    btnEnviar.style.display = 'visible'
}
else{
    btnEnviar.style.display = 'none'
    const btnValidar = document.createElement('button')
    btnValidar.innerHTML = '<i class="icon-exclamation-sign icon-white"></i> Validar'
    btnValidar.classList.add('btn')
    btnValidar.classList.add('btn-primary')
    btnValidar.style.margin = '10px'
    btnValidar.addEventListener('click', async (event)=>{
        event.preventDefault()
        const result = await validaPlanoEnsino()
        if(result){
            btnSalvar.click()
        }
        else{
            window.scrollTo(0,0)
            await mostraValidacoes()
            alert("Existem erros no Plano de Ensino. Corrija os erros e tente novamente")
        }
    
    })
    btnEnviar.parentNode.insertBefore(btnValidar, btnEnviar)
    
}
async function validaPlanoEnsino(){
    return  validaNumeroAulas() && 
            isValidoObjetivoGeralUnidadeCurricular() && 
            isValidoObjetivoEspecificoUnidadeCurricular() && 
            isValidoAvaliacoes() && 
            isValidoRecuperacaoDaAprendizagem() && 
            isValidoReferencias() && 
            await validaNumeroAulasDetalhamentoProposta()
}
    

function pegarNumeroDeAulasEsperado(){
    const numeroHorasTotal = parseFloat(document.getElementById('ClasseDisciplinaElementoCurricularCargaHoraria').value)
    const numeroDeAulasEsperado = (numeroHorasTotal*60)/tempoAula
    return numeroDeAulasEsperado
}

function validaNumeroAulas(){

    const numeroAulasTeoricas = parseFloat(document.getElementById('PlanoEnsinoQtAulasTeoricas').value)
    const numeroAulasPraticas = parseFloat(document.getElementById('PlanoEnsinoQtAulasPraticas').value)
    //const numeroAulasExtensao = document.getElementById('PlanoEnsinoCargaHorariaExtensao').value===''?0:parseFloat(document.getElementById('PlanoEnsinoCargaHorariaExtensao').value)

    const numeroAulasTotal = numeroAulasTeoricas + numeroAulasPraticas //+ numeroAulasExtensao
    return numeroAulasTotal === pegarNumeroDeAulasEsperado()
}

async function mostraValidacoes(){
    const divValidacoes = document.querySelector("body > div.container-fluid.meio div:nth-child(2) > div")
    const divNovaValidacao = document.createElement("div")
    divNovaValidacao.classList.add("row-fluid")
    divNovaValidacao.classList.add("validacao")
    divValidacoes.insertBefore(divNovaValidacao, divValidacoes.firstChild)

    if(!validaNumeroAulas()){
        //Confere se já existe uma div de validação de número de aulas
        if(document.querySelector(".alert-danger-item01")==null){
            const divValidacaoNumeroAulas = document.createElement("div")
            divValidacaoNumeroAulas.classList.add("alert")
            divValidacaoNumeroAulas.classList.add("alert-danger")
            divValidacaoNumeroAulas.classList.add("alert-danger-item01")
            divValidacaoNumeroAulas.innerHTML = "Item 01 - Somatória do <b>Nº total de aulas teóricas</b> e <b>Nº total de aulas práticas</b> não batem com o número de aulas da Unidade Curricular."
            
            divNovaValidacao.appendChild(divValidacaoNumeroAulas)
            const botaoAulasTeoricas = document.getElementById('PlanoEnsinoQtAulasTeoricas')
            botaoAulasTeoricas.style.borderColor = "#b94a48"
            const botaoAulasPraticas = document.getElementById('PlanoEnsinoQtAulasPraticas')
            botaoAulasPraticas.style.borderColor = "#b94a48"
        }
    }
    if(!isValidoObjetivoGeralUnidadeCurricular()){
        if(document.querySelector(".alert-danger-item03")==null){
            const divValidacaoObjetivoGeral = document.createElement("div")
            divValidacaoObjetivoGeral.classList.add("alert")
            divValidacaoObjetivoGeral.classList.add("alert-danger")
            divValidacaoObjetivoGeral.classList.add("alert-danger-item03")
            divValidacaoObjetivoGeral.innerHTML = "Item 03 - O <b>OBJETIVO GERAL DA UNIDADE CURRICULAR</b> não pode ser vazio."
            divNovaValidacao.appendChild(divValidacaoObjetivoGeral)
        }
    }

    if(!isValidoObjetivoEspecificoUnidadeCurricular()){
        if(document.querySelector(".alert-danger-item04")==null){
            const divValidacaoObjetivoEspecifico = document.createElement("div")
            divValidacaoObjetivoEspecifico.classList.add("alert")
            divValidacaoObjetivoEspecifico.classList.add("alert-danger")
            divValidacaoObjetivoEspecifico.classList.add("alert-danger-item04")
            divValidacaoObjetivoEspecifico.innerHTML = "Item 04 - O <b>OBJETIVO ESPECÍFICO DA UNIDADE CURRICULAR</b> não pode ser vazio."
            divNovaValidacao.appendChild(divValidacaoObjetivoEspecifico)
        }
    }
    if(!isValidoAvaliacoes()){
        if(document.querySelector(".alert-danger-item05")==null){
            const divValidacaoAvaliacoes = document.createElement("div")
            divValidacaoAvaliacoes.classList.add("alert")
            divValidacaoAvaliacoes.classList.add("alert-danger")
            divValidacaoAvaliacoes.classList.add("alert-danger-item05")
            divValidacaoAvaliacoes.innerHTML = "Item 05 - As <b>AVALIAÇÕES</b> não podem ser vazias."
            divNovaValidacao.appendChild(divValidacaoAvaliacoes)
        }
    }
    if(!isValidoRecuperacaoDaAprendizagem()){
        if(document.querySelector(".alert-danger-item06")==null){    
            const divValidacaoRecuperacaoDeAprendizagem = document.createElement("div")
            divValidacaoRecuperacaoDeAprendizagem.classList.add("alert")
            divValidacaoRecuperacaoDeAprendizagem.classList.add("alert-danger")
            divValidacaoRecuperacaoDeAprendizagem.classList.add("alert-danger-item06")
            divValidacaoRecuperacaoDeAprendizagem.innerHTML = "Item 06 - A <b>RECUPERAÇÃO DA APRENDIZAGEM</b> não pode ser vazia."
            divNovaValidacao.appendChild(divValidacaoRecuperacaoDeAprendizagem)
        }
    }
    if(!isValidoReferencias()){
        if(document.querySelector(".alert-danger-item07")==null){
            const divValidacaoReferencias = document.createElement("div")
            divValidacaoReferencias.classList.add("alert")
            divValidacaoReferencias.classList.add("alert-danger")
            divValidacaoReferencias.classList.add("alert-danger-item07")
            divValidacaoReferencias.innerHTML = "Item 07 - As <b>REFERÊNCIAS</b> não podem ser vazias."
            divNovaValidacao.appendChild(divValidacaoReferencias)
        }
    
    }
    if(!await validaNumeroAulasDetalhamentoProposta()){
        if(document.querySelector(".alert-danger-item08")==null){
            const divValidacaoNumeroAulasDetalhamentoProposta = document.createElement("div")
            divValidacaoNumeroAulasDetalhamentoProposta.classList.add("alert")
            divValidacaoNumeroAulasDetalhamentoProposta.classList.add("alert-danger")
            divValidacaoNumeroAulasDetalhamentoProposta.classList.add("alert-danger-item08")
            divValidacaoNumeroAulasDetalhamentoProposta.innerHTML = "Item 08 - Número de aulas cadastradas no <b>DETALHAMENTO DA PROPOSTA DE TRABALHO</b> não batem com o número de aulas da Unidade Curricular."
            divNovaValidacao.appendChild(divValidacaoNumeroAulasDetalhamentoProposta)
        }
    }
}


function validaNumeroAulasDetalhamentoProposta(){
    return new Promise((resolve, reject)=>{
        function f(){
            setTimeout(()=>{
                let aulas = document.getElementById("proposta_trabalho").querySelectorAll("tbody>tr>td:nth-child(3)")
                if (aulas.length===0){
                    return f();
                }
                let numeroAulas = 0
                for(let aula of aulas){
                    numeroAulas += parseFloat(aula.innerText)
                }
                console.log('numeroAulas', numeroAulas)
                
                const numeroDeAulasEsperado = pegarNumeroDeAulasEsperado()
                console.log('numeroDeAulasEsperado', numeroDeAulasEsperado)
                return resolve(numeroAulas===numeroDeAulasEsperado)
            },500)
        }
        f()
    })
}

function isValidoObjetivoGeralUnidadeCurricular(){
    const objetivoGeral = document.getElementById('PlanoEnsinoObjetivoGeral').value
    return objetivoGeral !== '.'
}
function isValidoObjetivoEspecificoUnidadeCurricular(){
    const objetivoEspecifico = document.getElementById('PlanoEnsinoObjetivosEspecificos').value
    return objetivoEspecifico !== ''
}

function isValidoAvaliacoes(){
    const avaliacoestag = document.querySelector("#PlanoEnsinoDiarioForm > table:nth-child(7) > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > center")
    return avaliacoestag === null

}

function isValidoRecuperacaoDaAprendizagem(){
    const recuperacao = document.getElementById('PlanoEnsinoRecuperacao').value
    return recuperacao !== ''
}

function isValidoReferencias(){
    const referencias = document.getElementById('PlanoEnsinoReferencias').value
    return referencias !== ''
}

