//console.log("Guilherme Terenciani");
//alert("Guilherme Terenciani");

const nomeTurma = [
    {"nomeDiario":"20231098105B","turma":"Turma 1021-B"},
    {"nomeDiario":"20231098105A","turma":"Turma 1021-A"}
]; 
const table = document.querySelectorAll(".table.table-striped.table-bordered.table-condensed")
const tdClasse = table[0].childNodes[3].querySelectorAll("td:nth-child(1)")
for(let td of tdClasse){
    let classe = (td.innerText).substring(0, 12);
    if(nomeTurma.find((item)=>item.nomeDiario==classe)!=undefined){
        td.innerHTML = nomeTurma.find((item)=>item.nomeDiario==classe).turma+": " + td.innerHTML;
    }
}