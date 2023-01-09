let schedulePAT = JSON.parse(localStorage.getItem("PATKEY"))
let filteredSchedulePAT = schedulePAT.filter((item)=>item.tipo==="P")

const horaInicioNodeDom = document.getElementById("NovoInicio");
const horaFimNodeDom = document.getElementById("NovoFim");
const diaSemanaDom = document.getElementById("NovoDiaSemanaId");
const btnAddNodeDom = document.getElementById("adicionar");

for(item of filteredSchedulePAT){
    let {id, diaSemana, horaInicio, horaFim} = item

    includePEOnInterface(id, diaSemana, horaInicio, horaFim);
    resetButton()
}

localStorage.setItem("PATKEY",JSON.stringify(schedulePAT.filter((item)=>item.tipo!=="P")));

function includePEOnInterface(id, diaSemana, horaInicio, horaFim){
    horaInicioNodeDom.value = horaInicio;
    horaFimNodeDom.value = horaFim;
    diaSemanaDom.value = diaSemana;
    btnAddNodeDom.click()
}
function resetButton(){
    horaInicioNodeDom.value = "__:__";
    horaFimNodeDom.value = "__:__";
    diaSemanaDom.value = 2;
}