"use strict"

//PRÁCTICA 4: Simón dice
// -no está permitido el uso de imágenes
// -ranking con nombre de usuario y el número de niveles que logró superar (debe aparecer en pantalla y actualizarse en tiempo real)
// -se debe guardar en localStorage
// -opcional: añadir más colores o más velocidades 

const powerBtn = document.getElementById('power-btn')
const powerIcon = document.getElementById('power-icon')
const mainForm = document.getElementById('main-form')
const rankContainer = document.getElementById('ranking-container')
const openRank = document.getElementById('open-rank')
const rankList = document.getElementById('ranking')
const playerName = document.getElementById('player-name')
const playerPoints = document.getElementById('points')
const simon = document.getElementById('circle')
const green = document.getElementById('green')
const red = document.getElementById('red')
const blue = document.getElementById('blue')
const yellow = document.getElementById('yellow')
const endSign = document.getElementById('end-sign')
const signText = document.getElementById('sign-text')
const reload = document.getElementById('reload')

const colors = ['green', 'red', 'blue', 'yellow']
let sequence = [""]
let playerSequence = []
let level = 10

const userValidationAndStorage =(a,e)=>{
    if (a === "") e.target[0].setAttribute('placeholder',"DEBE INGESAR SU NOMBRE")
    else {
        sessionStorage.clear()
        sessionStorage.setItem('player',`${JSON.stringify(a)}`)
        mainForm.reset()
        playerName.textContent = JSON.parse(sessionStorage.getItem('player'))
        mainForm.classList.add('hide-form')
    }
}

//Ranking actualizado en vivo con localStorage
const rankingUpdate =()=>{ 
    let rank = []
        for (let i = 0; i < localStorage.length; i++) {
            const element = localStorage.getItem(localStorage.key(i))
            rank.push(element)
        }
    rank.sort()
    rank.reverse()
    if (rank.length>10) rank.pop()
    
    const fragment = document.createDocumentFragment()
        for (let i = 0; i < rank.length; i++) {
            const listItem = document.createElement('LI')
            listItem.textContent = rank[i];
            fragment.appendChild(listItem)
        }
    rankList.appendChild(fragment)
}

const clearRanking =()=>{
    do {
        rankList.removeChild(rankList.firstChild)
    } while (rankList.childElementCount != 0)
}

//Comprobar color apretado por player 1 y/o cpu
const check =(a,t)=>{
    if (a == "green") {
        green.classList.add('cpu-color')
        const noteC = new Audio("sonidos/c5.mp3")
        noteC.play()
        setTimeout(() => {
            green.classList.remove('cpu-color')
        },t);
    }else if (a == "red") {
        red.classList.add('cpu-color')
        const noteD = new Audio("sonidos/d5.mp3")
        noteD.play()
        setTimeout(() => {
            red.classList.remove('cpu-color')
        },t);
    }else if (a == "blue") {
        blue.classList.add('cpu-color')
        const noteE = new Audio("sonidos/e5.mp3")
        noteE.play()
        setTimeout(() => {
            blue.classList.remove('cpu-color')
        },t);
    }else if (a == "yellow") {
        yellow.classList.add('cpu-color')
        const noteF = new Audio("sonidos/f5.mp3")
        noteF.play()
        setTimeout(() => {
            yellow.classList.remove('cpu-color')
        },t);
    }
}

//Creación y funcionamiento de la secuencia de colores del CPU
const cpuColorSequence =()=>{
    let color = colors[Math.round(Math.random()*3)]
    sequence.push(color)
    if (sequence.length < 21) {
        sequence.forEach((el,index) => {
            setTimeout(() => {    
                setTimeout(() => {
                    check(el,300)
                },index*600);
            },400);
        })     
    }else {
        sequence.forEach((el,index) => {
            setTimeout(() => {    
                setTimeout(() => {
                    check(el,300)
                },index*300);
            },400);
        })  
    }
}

//juego player 1
const playerPlay =()=>{
    simon.addEventListener('click',(e)=>{
        let play = e.target.title
        playerSequence.push(play)
        check(play,300)
        if (playerSequence.toString() == sequence.toString()) {
            level++
            playerPoints.textContent = level
            playerSequence = [""]
            localStorage.setItem(`${playerName.textContent}`,`Nivel: ${level}, Nombre: ${playerName.textContent}`)
            cpuColorSequence()
            if (rankList.childElementCount != 0) {
                clearRanking()
                rankingUpdate()
            }
            else {
                rankingUpdate()
            }
        }else if (sequence.length == playerSequence.length && playerSequence.toString() !== sequence.toString()) {
            //falta que detecte el error del jugador sin tener en cuenta el sequence.length
            signText.textContent = `${playerName.textContent} perdió en el "nivel ${level}"`
            endSign.classList.add('show-end-game')
            reload.addEventListener('click',()=>location.reload())
        }
    })
}

//Mostrar u ocultar el ranking en móviles
openRank.addEventListener('click',()=>{
    rankContainer.classList.toggle('ranking-container-show')
})

mainForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    let playerName = e.target[0].value
    userValidationAndStorage(playerName,e) 
    //Comenzar a jugar
    powerBtn.addEventListener('click',()=>{
        powerBtn.classList.add('power-on')
        rankingUpdate()
        cpuColorSequence()
        playerPlay()
    })
})