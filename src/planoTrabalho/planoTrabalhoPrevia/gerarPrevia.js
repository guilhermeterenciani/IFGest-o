/**
author: Guilherme Figueiredo Terenciani
email: guilherme.terenciani@ifms.edu.br
*/

const schedule = []
let diasUteis = 7
//let urlAcademico = document.URL

let debug = false
//help function for debug
function print(x, information) {
    if (debug) {
        if (information) {
            console.log(information, x)
        } else {
            console.log(x)
        }
    }
}

//let regexhorariodocente = new RegExp(/https\:\/\/academico\.ifms\.edu\.br\/administrativo\/horario_docentes\/editar/i);
//if(regexhorariodocente.test(urlAcademico)){
//if(debug)alert("Estou na página de cadastro do Horário")

//Clean localStorage
// localStorage.setItem("PATKEY",JSON.stringify(patDTO))
//localStorage.removeItem("PATKEY")

const horaRelogio = [
    { horaInicio: "07:00", horaFim: "07:45" },
    { horaInicio: "07:45", horaFim: "08:30" },
    { horaInicio: "08:30", horaFim: "09:15" },
    { horaInicio: "09:30", horaFim: "10:15" },
    { horaInicio: "10:15", horaFim: "11:00" },
    { horaInicio: "11:00", horaFim: "11:45" },
    { horaInicio: "11:45", horaFim: "12:30" },
    { horaInicio: "13:00", horaFim: "13:45" },
    { horaInicio: "13:45", horaFim: "14:30" },
    { horaInicio: "14:30", horaFim: "15:15" },
    { horaInicio: "15:30", horaFim: "16:15" },
    { horaInicio: "16:15", horaFim: "17:00" },
    { horaInicio: "17:00", horaFim: "17:45" },
    { horaInicio: "17:45", horaFim: "18:30" },
    { horaInicio: "18:50", horaFim: "19:35" },
    { horaInicio: "19:35", horaFim: "20:20" },
    { horaInicio: "20:20", horaFim: "21:05" },
    { horaInicio: "21:15", horaFim: "22:00" },
    { horaInicio: "22:00", horaFim: "22:45" },
]

//Get all partition times on diario
let trNodes = document
    .getElementsByClassName(
        "table table-bordered table-condensed horario diario",
    )[0]
    .querySelectorAll("tbody>tr>td")
for (let trI = 0; trI < trNodes.length - diasUteis - 1; trI++) {
    if (trI % diasUteis !== 0) {
        id = `id-node-free-${trI}`
        trNodes[trI].id = id
        print(Math.floor((trI - 1) / diasUteis), "HoraRelógio")
        schedule.push({
            idNodeFree: id,
            diaSemana: trI % diasUteis,
            tempo: horaRelogio[Math.floor((trI - 1) / diasUteis)],
            node: trNodes[trI],
            status: "ocupado",
        })
    }
}
print(schedule, "Schedule inicial")

//Pega as frações de tempo que não tem nada marcado.
let result = schedule.filter(
    (freeTime) => freeTime.node.childNodes.length === 0,
) //|| freeTime.node.childNodes[0].className.includes("free-time"))
//console.log(result[0])

// Add buttons on Free Time with action buttons
if (debug) {
    console.log(result), "Printando o result"
}
addClickedButtonToAListOfFreeTime(result)
if (debug) {
    console.log(result)
}
function addClickedButtonToAListOfFreeTime(listOfFreeTime) {
    //adicionando dias livres a interface
    for (let i = 0; i < listOfFreeTime.length; i++) {
        if (debug) {
            console.log(listOfFreeTime[i].idNodeFree)
        }
        //listOfFreeTime[i].node.id = listOfFreeTime[i].idNodeFree
        listOfFreeTime[i].status = "livre"
        listOfFreeTime[i].node.innerHTML = `
        <div class="btn-group">
                <button class="btn btn-success btn-small dropdown-toggle" data-toggle="dropdown">
                    <i class="icon-plus icon-white"></i><span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                    <li><a href="#">PAT</a></li>
                    <li><a href="#">PE</a></li>
                    <li><a href="#">P</a></li>
                </ul>
            </div>
        `
        let a = listOfFreeTime[i].node.querySelectorAll("a")
        a[0].style.minWidth = "150px"
        a[1].style.minWidth = "150px"
        a[2].style.minWidth = "150px"
        a[0].onclick = clickOnFreeTime
        a[1].onclick = clickOnFreeTime
        a[2].onclick = clickOnFreeTime

        if (debug) {
            console.log(a)
        }
        if (debug) {
            break
        }
    }
}

//Tratando um clique de um usuário em um campo de tempo livre
function clickOnFreeTime(event) {
    event.preventDefault()
    if (debug) {
        console.log(event)
    }
    let idFather = event.path[4].id
    if (debug) {
        console.log(idFather)
    }
    switch (event.target.innerText) {
        case "PE":
            addPEOnFreeTime(idFather)
            break
        case "PAT":
            addPATOnFreeTime(idFather)
            break
        case "P":
            addPOnFreeTime(idFather)
            break
        default:
            break
    }
}

function remakeAMarkedFreeTime(event) {
    print(event, "Event de remake")
    nodeFatherID = event.path[1].id
    //nodeFather = document.getElementById(nodeFatherID)
    nodeFather = schedule.find((element) => element.idNodeFree === nodeFatherID)
    print(nodeFather, "NodeFather clicked to RemakeFreeTime")
    nodeFather.status = "livre"
    nodeFather.node.innerHTML = `
    <div class="btn-group">
            <button class="btn btn-success btn-small btn dropdown-toggle" data-toggle="dropdown">
                <i class="icon-plus icon-white"></i><span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <li><a href="#">PAT</a></li>
                <li><a href="#">PE</a></li>
                <li><a href="#">P</a></li>
            </ul>
        </div>
    `
    let a = nodeFather.node.querySelectorAll("a")
    a[0].style.minWidth = "150px"
    a[1].style.minWidth = "150px"
    a[2].style.minWidth = "150px"
    a[0].onclick = clickOnFreeTime
    a[1].onclick = clickOnFreeTime
    a[2].onclick = clickOnFreeTime
}

function addPEOnFreeTime(idFather) {
    let clickedFreeTime = schedule.find(
        (freeTime) => freeTime.idNodeFree === idFather,
    )
    clickedFreeTime.status = "PE"
    print(clickedFreeTime)
    clickedFreeTime.node.innerHTML = `<div class="hovered preparacao-7182 caixa_horario caixa_horario_p" referer="preparacao-7182">
                                            <span class="no-print label" title="Aguardando Aprovação">
                                                <i class="icon-exclamation-sign icon-white"></i>
                                            </span>
                                            <p style="">
                                                <strong>Prévia PE</strong>
                                                <br>${clickedFreeTime.tempo.horaInicio}- ${clickedFreeTime.tempo.horaFim}
                                                </p>
                                            </div>     
                                            <a class='btn btn-danger btn-sm'  href='javascript:void(0)'><i style="pointer-events: none;" class="icon-trash icon-white"></i></a>
                                    `
    nodesToExcludeMarkdown = clickedFreeTime.node.querySelectorAll("a")[0]
    nodesToExcludeMarkdown.onclick = remakeAMarkedFreeTime
}
function addPATOnFreeTime(idFather) {
    let clickedFreeTime = schedule.find(
        (freeTime) => freeTime.idNodeFree === idFather,
    )
    console.log(idFather)
    clickedFreeTime.status = "PAT"
    print(clickedFreeTime, "Adicionando PAT no schedule")
    clickedFreeTime.node.innerHTML = `<div class="hovered preparacao-7182 caixa_horario caixa_horario_p" referer="preparacao-7182">
                                            <span class="no-print label" title="Aguardando Aprovação">
                                                <i class="icon-exclamation-sign icon-white"></i>
                                            </span>
                                            <p style="">
                                                <strong>Prévia PAT</strong>
                                                <br>${clickedFreeTime.tempo.horaInicio}- ${clickedFreeTime.tempo.horaFim}
                                                </p>
                                            </div>     
                                           <a class='btn btn-danger btn-sm'  href='javascript:void(0)'><i style="pointer-events: none;" class="icon-trash icon-white"></i></a>
                                    `
    nodesToExcludeMarkdown = clickedFreeTime.node.querySelectorAll("a")[0]
    nodesToExcludeMarkdown.onclick = remakeAMarkedFreeTime
}
function addPOnFreeTime(idFather) {
    let clickedFreeTime = schedule.find(
        (freeTime) => freeTime.idNodeFree === idFather,
    )
    clickedFreeTime.status = "P"
    print(clickedFreeTime)
    clickedFreeTime.node.innerHTML = `<div class="hovered preparacao-7182 caixa_horario caixa_horario_p" referer="preparacao-7182">
                                            <span class="no-print label" title="Aguardando Aprovação">
                                                <i class="icon-exclamation-sign icon-white"></i>
                                            </span>
                                            <p style="">
                                                <strong>Prévia P</strong>
                                                <br>${clickedFreeTime.tempo.horaInicio}- ${clickedFreeTime.tempo.horaFim}
                                                </p>
                                            </div>     
                                           <a class='btn btn-danger btn-sm'  href='javascript:void(0)'><i style="pointer-events: none;" class="icon-trash icon-white"></i></a>
                                    `
    nodesToExcludeMarkdown = clickedFreeTime.node.querySelectorAll("a")[0]
    nodesToExcludeMarkdown.onclick = remakeAMarkedFreeTime
}

//schedule.push({"idNodeFree":`id-node-free-${trI+1}`,"diaSemana":1,"tempo":horaRelogio[trI/diasUteis], "node":trNodes[trI+1]})
function savePATInLocalStorage() {
    print(
        schedule.filter((item) => item.status === "PAT"),
        "Schedule that will be save"
    )
    let patDTO = schedule
        .map((item) => {
            return {
                id: item.idNodeFree,
                diaSemana: item.diaSemana+1,
                horaInicio: item.tempo.horaInicio,
                horaFim: item.tempo.horaFim,
                tipo: item.status
            }
        })
    localStorage.setItem("PATKEY", JSON.stringify(patDTO))
}

let button = document.querySelector(
    "#HorarioDocenteEditarForm > div.btn-group > a",
)
button.onclick = savePATInLocalStorage


function carregarDoLocalStorage(){
    const localStorageHistory = JSON.parse(localStorage.getItem("PATKEY"));
    for( item of localStorageHistory){
        switch (item.tipo) {
            case "PE":
                addPEOnFreeTime(item.id);
                break;
            case "PAT":
                addPATOnFreeTime(item.id);
                break
            case "P":
                addPOnFreeTime(item.id);
                break;
            default:
                break;
        }
    }
}

carregarDoLocalStorage();