
//PAT SIDE
//let regexpats = new RegExp(/https\:\/\/academico\.ifms\.edu\.br\/administrativo\/pats/i);
//https://academico.ifms.edu.br/administrativo/horario_docentes/editar/
//if(regexpats.test(urlAcademico)){
//alert("Estou na página de cadastro do PAT")
//schedule.push({"idNodeFree":`id-node-free-${trI+1}`,"diaSemana":"segunda","tempo":trI/diasUteis, "node":trNodes[trI+1]})
let schedulePAT = JSON.parse(localStorage.getItem("PATKEY"))
//let filteredSchedulePAT = schedulePAT.filter((item)=>item.tipo==="PAT")
for(item of schedulePAT){
    let {id, diaSemana, horaInicio, horaFim} = item
    //if(opcao==="excluir"){
    //    excludePATOnInterface(console.log("Not Implemented yet"))
    //}
    //if(opcao==="create"){
    includePATOnInterface(id, diaSemana, horaInicio, horaFim)
    //}
    

}
function includePATOnInterface(id, diaSemana, horaInicio, horaFim){
    document.getElementById("hora_inicio").value = horaInicio;
    document.getElementById("hora_fim").value = horaFim;
    document.getElementById("dia_semana").value = diaSemana;
    document.getElementById("adicionar_horario").click()
}