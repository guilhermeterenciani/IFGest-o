/**
author: Alisson G. Chiquitto
email: alisson.chiquitto@ifms.edu.br
@TODO: Testar jornada de no máximo 6hrs
@TODO: Testar descanso de pelo menos 1h por dia
@version 2021031201
*/

(function(input) {

    const TRABALHO_P_CARGA = input.TRABALHO_P_CARGA
    const TRABALHO_PE_CARGA = input.TRABALHO_PE_CARGA
    const MARGEM_ERRO = input.MARGEM_ERRO
    
    let dias = []
    let diasSemana = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sabado'
    ]
    let logBucket = "\n\n";
    
    const TRABALHO_P = 'TRABALHO_P'
    const TRABALHO_PE = 'TRABALHO_PE'
    const TRABALHO_AULA = 'TRABALHO_AULA'
    const TRABALHO_INTERVALO = 'TRABALHO_INTERVALO'
    const TRABALHO_PAT_PESQUISA = 'TRABALHO_PAT_PESQUISA'
    const TRABALHO_PAT_EXTENSAO = 'TRABALHO_PAT_EXTENSAO'
    const TRABALHO_PAT_ENSINO = 'TRABALHO_PAT_ENSINO'
    const TRABALHO_PAT_GESTAO = 'TRABALHO_PAT_GESTAO'
    const TRABALHO_PAT_CAP = 'TRABALHO_PAT_CAP'
    
    class Dia {
      constructor() {
        this._trabalhos = []
      }
      
      add(trabalho) {
        this._trabalhos.push(trabalho)
      }
      
      getTrabalho(i) {
        return this._trabalhos[i]
      }
      
      primeiroTrabalho() {
        return this._trabalhos[0]
      }
      
      ultimoTrabalho() {
        return this._trabalhos[this._trabalhos.length - 1]
      }
      
      somaTrabalhos() {
        const reducer = (accumulator, currentValue) => accumulator + currentValue.duracao
        return this._trabalhos.reduce(reducer, 0)
      }
      
      somaTrabalhosTipo(tipo) {
        const reducer = (accumulator, currentValue) => {
          if (currentValue.tipo == tipo) {
            return accumulator + currentValue.duracao
          }
          return accumulator
        }
        return this._trabalhos.reduce(reducer, 0)
      }
    }
  
    class Trabalho {
      
      constructor(tipo, inicio, fim) {
        this.tipo = tipo
        this.inicio = inicio
        this.fim = fim
        
        this.duracao = inicio.diff(fim)
      }
      
    }
  
    class Hora {
      
      constructor(hora, minuto) {
        this.hora = hora
        this.minuto = minuto
      }
      
      diff(hora2) { // retorna a diferenca em minutos
        let m1 = (this.hora * 60) + this.minuto
        let m2 = (hora2.hora * 60) + hora2.minuto
        
        return m2 - m1
      }
      
    }
    
    function log(text) {
      logBucket += text + "\n";
    }
    
    function inicializar() {
        inicializarDias()
        capturarCaixas()
      
        totalSemanal()
        totalDiario(8)
        // totalDiario(10)
      
        relatorioIntersticio()
      
        relatorioPreparacao(MARGEM_ERRO)
        relatorioPermanencia(MARGEM_ERRO)
        // relatorioPreparacaoPermanencia()
      
        console.log(logBucket)
        displayAll()
    }
    
    function inicializarDias() {
      // Inicializar dias
      for (let diasI = 0; diasI < 7; diasI++) {
        dias[diasI] = new Dia()
      }
    }
  
    function capturarCaixas() {
      // Capturas TR e separar nos dias
      let trNodes = document.querySelectorAll('.diario')[0].querySelectorAll('tbody>tr')
      for (let trI = 0; trI < trNodes.length; trI++) {
        let tdNodes = trNodes[trI].querySelectorAll('td')
        
        for (let tdI = 1; tdI < tdNodes.length; tdI++) {
          let caixaNodes = tdNodes[tdI].querySelectorAll('.caixa_horario p')
          
          for (let caixaI = 0; caixaI < caixaNodes.length; caixaI++) {
            dias[tdI].add(inicializarTrabalho(caixaNodes[caixaI]))
          }
          
        }
        
      }
    }
    
    function minutosToHorasString(minutos) {
      minutos = parseInt(minutos, 10)
      let h = Math.floor(minutos / 60)
      // let m = ('0' + new String(Math.ceil(((minutos / 60) % 1) * 60))).substr(-2, 2)
      let m = ('0' + (minutos - (h * 60))).substr(-2, 2)
      // log(`minutosToHorasString: ${minutos} minutos => ${h}:${m}`)
      return `${h}:${m}`
    }
    
    function inicializarTrabalho(caixaNode) {
      let groups = /(?<h1>[0-9]{2}):(?<m1>[0-9]{2}) - (?<h2>[0-9]{2}):(?<m2>[0-9]{2})/gm.exec(caixaNode.innerText).groups
      let h1 = parseInt(groups.h1, 10)
      let h2 = parseInt(groups.h2, 10)
      let m2 = parseInt(groups.m2, 10)
      let m1 = parseInt(groups.m1, 10)
      
      // Testar tipo de PAT
      let regexPat = [
        /Preparação/g,
        /Permanência/g,
        /Aula:/g,
        /Intervalo/g,
        /PAT Pesquisa/g,
        /PAT Extensão/g,
        /PAT Ensino/g,
        /PAT Gestão/g,
        /PAT Capacitação/g
      ]
      let tiposPat = [
        TRABALHO_P,
        TRABALHO_PE,
        TRABALHO_AULA,
        TRABALHO_INTERVALO,
        TRABALHO_PAT_PESQUISA,
        TRABALHO_PAT_EXTENSAO,
        TRABALHO_PAT_ENSINO,
        TRABALHO_PAT_GESTAO,
        TRABALHO_PAT_CAP
      ]
      let tipoPat = null
      for (let regexPatI in regexPat) {
        if(regexPat[regexPatI].exec(caixaNode.innerText)) {
          tipoPat = tiposPat[regexPatI]
          break
        }
      }
      if (!tipoPat) {
        console.error('Tipo de PAT não encontrado: ' + caixaNode.innerText)
      }
      
      return new Trabalho(tipoPat, new Hora(h1, m1), new Hora(h2, m2))
    }
    
    function relatorioIntersticio() {
      log('====> Testar instersticio')
      
      let teste = true
      for (let i = 0; i <= 5; i++) {
        teste = teste && relatorioIntersticioDia(i, i + 1)
      }
      teste = relatorioIntersticioDia(6, 0) && teste
      
      if (teste) {
        log('OK')
      }
    }
    
    function relatorioIntersticioDia(dia1, dia2) {
      
      let dia1UltimoTrabalho = dias[dia1].ultimoTrabalho()
      if (!(dia1UltimoTrabalho instanceof Trabalho)) return true
      
      let dia2PrimeiroTrabalho = dias[dia2].primeiroTrabalho()
      if (!(dia2PrimeiroTrabalho instanceof Trabalho)) return true
      
      let tempo1 = dia1UltimoTrabalho.fim.diff(new Hora(24, 0))
      let tempo2 = (new Hora(0, 0)).diff(dia2PrimeiroTrabalho.inicio)
      
      let tempoTotal = tempo1 + tempo2
      
      if (tempoTotal < 660) {
        log('De ' + diasSemana[dia1] + ' para ' + diasSemana[dia2] + ': Intervalo inferior a 11h entre jornadas de trabalho')
        return false
      }
      
      return true
      
    }
    
    function totalSemanal() {
      log(`====> Carga de 40 horas semanal`)
      
      let soma = 0
      for (let i = 0; i <= 6; i++) {
        soma += dias[i].somaTrabalhos()
      }
      
      if (soma != (40 * 60)) {
        log(`Carga semanal cadastrada: ${minutosToHorasString(soma)}`)
        return false
      }
      
      log(`OK`)
    }
    
    function totalDiario(max) {
      let maxMin = max * 60
      
      log(`====> Carga de ${minutosToHorasString(maxMin)} horas diario`)
      
      let teste = true
      for (let i = 1; i <= 5; i++) {
        teste = totalDiarioDia(i, maxMin) && teste
      }
      
      if (teste) {
        log('OK')
      }
    }
    
    function totalDiarioDia(dia, maxMin) {
      let soma = dias[dia].somaTrabalhos()
      
      if (soma != maxMin) {
        log(`${diasSemana[dia]} : Carga horária diferente (${minutosToHorasString(soma)} horas)`)
        return false
      }
      return true
    }
    
    function relatorioMargemAula(tipo, porcentagem, margemErro) {
      let cargaAula = 0;
      let carga = 0;
      
      for (let i = 1; i <= 5; i++) {
        cargaAula += dias[i].somaTrabalhosTipo(TRABALHO_AULA)
        carga += dias[i].somaTrabalhosTipo(tipo)
      }
      
      let cargaSugeridoReal = Math.floor(cargaAula * porcentagem)
      
      // Dividir por 4 para arredondar em fracoes de 4 (15 minutos)
      let parcelas = 4
      let cargaSugeridoM = Math.round(((cargaSugeridoReal / 60) % 1) * parcelas) * (60 / parcelas)
      
      let cargaSugeridoH = Math.floor(cargaSugeridoReal / 60)
      
      let cargaSugerido = (cargaSugeridoH * 60) + cargaSugeridoM
      let cargaSugeridoMargem1 = cargaSugerido * (1 - margemErro)
      let cargaSugeridoMargem2 = cargaSugerido * (1 + margemErro)
      
      if ((carga < cargaSugeridoMargem1) || (carga > cargaSugeridoMargem2)) {
        log(`Aulas: ${minutosToHorasString(cargaAula)} horas`)
        log(`Carga cadastrada: ${minutosToHorasString(carga)} horas`)
        log(`Carga sugerido: ${minutosToHorasString(cargaSugerido)} horas`)
        
        let margem = margemErro * 100
        log(`Margem (${margem}%) aceitavel sugerido: entre ${minutosToHorasString(cargaSugeridoMargem1)} e ${minutosToHorasString(cargaSugeridoMargem2)} horas`)
        return false
      }
      
      log('OK')
      return true
    }

    function relatorioMargemAulaEscrito(tipo, porcentagem, margemErro) {
      let cargaAula = 0;
      let carga = 0;
      
      for (let i = 1; i <= 5; i++) {
        cargaAula += dias[i].somaTrabalhosTipo(TRABALHO_AULA)
        carga += dias[i].somaTrabalhosTipo(tipo)
      }
      
      let cargaSugeridoReal = Math.floor(cargaAula * porcentagem)
      
      // Dividir por 4 para arredondar em fracoes de 4 (15 minutos)
      let parcelas = 4
      let cargaSugeridoM = Math.round(((cargaSugeridoReal / 60) % 1) * parcelas) * (60 / parcelas)
      
      let cargaSugeridoH = Math.floor(cargaSugeridoReal / 60)
      
      let cargaSugerido = (cargaSugeridoH * 60) + cargaSugeridoM
      let cargaSugeridoMargem1 = cargaSugerido * (1 - margemErro)
      let cargaSugeridoMargem2 = cargaSugerido * (1 + margemErro)

      let retorno = {status:"",mensagem:""};
      let margem = margemErro * 100
      if ((carga < cargaSugeridoMargem1) || (carga > cargaSugeridoMargem2)) {
        
        retorno.mensagem= `Aulas: ${minutosToHorasString(cargaAula)} horas <br/>Carga cadastrada: ${minutosToHorasString(carga)} horas <br/>Carga sugerido: ${minutosToHorasString(cargaSugerido)} horas <br/>Margem (${margem}%) aceitavel sugerido: entre ${minutosToHorasString(cargaSugeridoMargem1)} e ${minutosToHorasString(cargaSugeridoMargem2)} horas`;
        retorno.status="repovado";
        return retorno;
      }
      else{
        retorno.status="aprovado";
        retorno.mensagem=`Aulas: ${minutosToHorasString(cargaAula)} horas <br/>Carga cadastrada: 
        ${minutosToHorasString(carga)} horas <br/> 
        horas <br/>Margem (${margem}%) aceitavel: entre ${minutosToHorasString(cargaSugeridoMargem1)} e 
        ${minutosToHorasString(cargaSugeridoMargem2)} horas`;
        return retorno;
      }
    }

    
    function relatorioPreparacao(margemErro) {
      log(`====> Carga de preparação`)
      relatorioMargemAula(TRABALHO_P, TRABALHO_P_CARGA, margemErro)
    }
    
    function relatorioPermanencia(margemErro) {
      log(`====> Carga de permanencia`)
      relatorioMargemAula(TRABALHO_PE, TRABALHO_PE_CARGA, margemErro)
    }
    
    function relatorioPreparacaoPermanencia() {
      log(`====> Carga de (permanencia + preparacao = aula)`)
      
      let cargaAula = 0;
      let cargaP = 0;
      let cargaPE = 0;
      
      for (let i = 1; i <= 5; i++) {
        cargaAula += dias[i].somaTrabalhosTipo(TRABALHO_AULA)
        cargaP += dias[i].somaTrabalhosTipo(TRABALHO_P)
        cargaPE += dias[i].somaTrabalhosTipo(TRABALHO_PE)
      }
  
      let cargaPCorreto = TRABALHO_P_CARGA * cargaAula
      let cargaPECorreto = TRABALHO_PE_CARGA * cargaAula
      
      if ((cargaPCorreto != cargaP) || (cargaPECorreto != cargaPE)) {
        log(`Aulas: ${minutosToHorasString(cargaAula)} horas`)
        log(`Preparação cadastrada: ${minutosToHorasString(cargaP)}/${minutosToHorasString(cargaPCorreto)} horas`)
        log(`Permanencia cadastrada: ${minutosToHorasString(cargaPE)}/${minutosToHorasString(cargaPECorreto)} horas`)
        
        return false
      }
      
      log('OK')
      return true
    }
    function displayAll(){
      let table = document.querySelectorAll('.diario')[0]
      let numOfRows = table.rows.length;
      let newRow = table.insertRow(numOfRows);
      let numOfCols = table.rows[numOfRows-1].cells.length;
      // Faz um loop para criar as colunas
      newCell = newRow.insertCell(0);
      newCell.innerHTML = "Tempo por dia";
     
      newCell = newRow.insertCell(1);
      newCell.innerHTML = "tempo";
      let j;
      for ( j= 2; j < numOfCols; j++) {
        let soma = dias[j-1].somaTrabalhos()
        // Insere uma coluna na nova linha 
        newCell = newRow.insertCell(j);
        // Insere um conteúdo na coluna
        
        if(soma!=8*60){
          newCell.innerHTML = `<div class="hovered preparacao-4620 caixa_horario caixa_horario_p" referer="preparacao-4620">
          <span class="no-print label label-warning" title="Aguardando Aprovação">
          <i class="icon-wrench icon-white"></i>
          </span>
          <p style="">
          <strong>Diminuir ou aumentar carga horária do dia</strong>
          <br>${minutosToHorasString(soma)}</p>
          </div>`
        }
        else{
          newCell.innerHTML = `<div class="hovered pat-22713 caixa_horario caixa_horario_pat" referer="pat-22713">
          <span class="no-print label label-success" title="Aprovado">
          <i class="icon-ok-sign icon-white"></i></span>
          <p style=""><strong>Horário correto</strong><br>${minutosToHorasString(soma)}</p></div>`
        }
      }
      newCell = newRow.insertCell(j);
      newCell.innerHTML = "";


      let trNodes = document.querySelectorAll('.diario')[3];
      let rows = trNodes.rows;
      // rows[5].style.backgroundColor="red";

      // let numOfCols = table.rows[numOfRows-1].cells.length;
      var x = document.createElement("td");
      x.innerHTML= (relatorioMargemAulaEscrito(TRABALHO_P, TRABALHO_P_CARGA,MARGEM_ERRO)).mensagem;
      rows[5].appendChild(x);

      x = document.createElement("td");
      x.innerHTML = (relatorioMargemAulaEscrito(TRABALHO_PE, TRABALHO_PE_CARGA, MARGEM_ERRO)).mensagem;
      rows[4].appendChild(x);
    }
    
    inicializar()
  
  })({
    TRABALHO_P_CARGA: 1,
    TRABALHO_PE_CARGA: 0.25,
    MARGEM_ERRO: 0.05
  })