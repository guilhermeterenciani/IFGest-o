
//PAT SIDE
//let regexpats = new RegExp(/https\:\/\/academico\.ifms\.edu\.br\/administrativo\/pats/i);
//https://academico.ifms.edu.br/administrativo/horario_docentes/editar/
//if(regexpats.test(urlAcademico)){
//alert("Estou na página de cadastro do PAT")
//schedule.push({"idNodeFree":`id-node-free-${trI+1}`,"diaSemana":"segunda","tempo":trI/diasUteis, "node":trNodes[trI+1]})
let schedulePAT = JSON.parse(localStorage.getItem("PATKEY"));
let filteredSchedulePAT = schedulePAT.filter((item)=>item.tipo==="PAT");
const horaInicioNodeDom = document.getElementById("hora_inicio");
const horaFimNodeDom = document.getElementById("hora_fim");
const diaDaSemanaNodeDom = document.getElementById("dia_semana");
const btnAdcionar =document.getElementById("adicionar_horario");
for(item of filteredSchedulePAT){
    let {id, diaSemana, horaInicio, horaFim} = item
    //if(opcao==="excluir"){
    //    excludePATOnInterface(console.log("Not Implemented yet"))
    //}
    //if(opcao==="create"){
    includePATOnInterface(id, diaSemana, horaInicio, horaFim)
    //}
    //schedulePAT.tipo="ocupado";
    

}
localStorage.setItem("PATKEY",JSON.stringify(schedulePAT.filter((item)=>item.tipo!=="PAT")));
function includePATOnInterface(id, diaSemana, horaInicio, horaFim){
    horaInicioNodeDom.value = horaInicio;
    horaFimNodeDom.value = horaFim;
    diaDaSemanaNodeDom.value = diaSemana;
    btnAdcionar.click()
}