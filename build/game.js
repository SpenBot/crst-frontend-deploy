
/////////// DEPENDENCIES AND APPLICATION STATES ////////////////////
////////////////////////////////////////////////////////////////////

const url = 'https://gentle-peak-59883.herokuapp.com/'
let serverPings = 10

const socket = io.connect('https://gentle-peak-59883.herokuapp.com/')
let socketIsConfirmed = false

let gameRun = null




/////////// DOM ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

let canvas = document.getElementById('gameCanvas')
let canvasContext = canvas.getContext('2d')

let body = document.getElementsByTagName('body')[0]

let loadingScreen = document.getElementById('loadingScreen')

let playerInfo = document.createElement('h2')

let playerSelectDiv = document.getElementById('playerSelectDiv')
let redButton = document.getElementById('playerSelectRed')
let blueButton = document.getElementById('playerSelectBlue')


/////////// GAME STATES ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

let redX
let redY
let blueX
let blueY

let thisPlayer = null

const fps = 30





/////////// ON WINDOW LOAD /////////////////////////////////////////
////////////////////////////////////////////////////////////////////

window.onload = function() {

    canvas.style.display = "none"
    startLoading()

    wakeServer()




    window.addEventListener("keyup", keyPush)

    redButton.addEventListener('click', () => {
        socket.emit('playerSelected', {
          player: "red",
        })
        playerSelectDiv.style.display = "none"
    })

    blueButton.addEventListener('click', () => {
        socket.emit('playerSelected', {
          player: "blue",
        })
        playerSelectDiv.style.display = "none"
    })

}





/////////// WAKE SERVER /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

function wakeServer () {

    fetch(url)
      .then(res => res.json())
      .catch(err => console.log(err))
      .then(data => {
        // console.log(data)
        serverPings -= 1
        serverPings > 0 ? wakeServer() : confirmSocket()
      })


}





/////////// EMIT : CONFIRM SOCKET ///////////////////////////////////
/////////////////////////////////////////////////////////////////////

function confirmSocket () {

    socket.emit('confirmSocket', {
      socket: false,
    })

}





/////////// LISTEN : SOCKET CONFIRMED ///////////////////////////////
/////////////////////////////////////////////////////////////////////

socket.on('socketConfirm', function(data) {

    socketIsConfirmed = data.socket
    console.log(`Socket Conneciton Confirmed: ${socketIsConfirmed.toString().toUpperCase()}`)

    socketIsConfirmed ? runGame() : null

})






/////////// RUN GAME ////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

function runGame () {

    loadingScreen.style.display = "none"
    canvas.style.display = "block"

    gameRun = setInterval(() => {
      drawEverything()
    }, 1000/fps)

}





/////////// KEYPUSH ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function keyPush(e) {
  // console.log(e.keyCode)
    switch(e.keyCode) {
        case 37:
        case 65:
            thisPlayer ? movePlayer(thisPlayer, "-x") : null
            break;
        case 38:
        case 87:
            thisPlayer ? movePlayer(thisPlayer, "-y") : null
            break;
        case 39:
        case 68:
            thisPlayer ? movePlayer(thisPlayer, "+x") : null
            break;
        case 40:
        case 83:
            thisPlayer ? movePlayer(thisPlayer, "+y") : null
            break;
    }
}





/////////// EMIT : MOVE PLAYER /////////////////////////////////////
////////////////////////////////////////////////////////////////////

function movePlayer (player, direction) {
  // console.log(`${player} : ${direction}`)

    socket.emit('movePlayer', {
      player: player,
      direction: direction
  })

}




/////////// LISTEN : UPDATE PLAYER POSITIONS ////////////////////////
////////////////////////////////////////////////////////////////////

socket.on('playerPositions', function(data) {

    redX = data.redX
    redY = data.redY
    blueX = data.blueX
    blueY = data.blueY

})




/////////// LISTEN : SET PLAYER ////////////////////////////////////
////////////////////////////////////////////////////////////////////

socket.on('playerSet', function(data) {

    if (thisPlayer === null && data.player) {

      thisPlayer = data.player

      if (thisPlayer === "red") {
        playerInfo.setAttribute('class', 'plyrRed')
      }
      else if (thisPlayer === "blue") {
        playerInfo.setAttribute('class', 'plyrBlue')
      }

      playerInfo.innerHTML = `PLAYER ${thisPlayer.toUpperCase()}`
      body.prepend(playerInfo)

    }

})




/////////// LISTEN : PLAYER CHOSEN /////////////////////////////////
////////////////////////////////////////////////////////////////////

socket.on('playerChosen', function(data) {

    if (data.playerRed && data.playerBlue) {
      playerSelectDiv.style.display = "none"

      if (!thisPlayer) {
        playerInfo.setAttribute('class', 'plyrObs')
        playerInfo.innerHTML = "OBSERVER"
        body.prepend(playerInfo)
     }

    }
    else if (data.playerRed && !data.playerBlue) {
      redButton.style.display = "none"
    }
    else if (data.playerBlue && !data.playerRed) {
      blueButton.style.display = "none"
    }

})




/////////// LISTEN : RESET PLAYER ////////////////////////////////////
////////////////////////////////////////////////////////////////////

socket.on('playerReset', () => {
    thisPlayer = null
    body.removeChild(playerInfo)
    playerSelectDiv.style.display = "block"
    redButton.style.display = "flex"
    blueButton.style.display = "flex"
})






/////////// DRAW RECTANGLE FUNCTION ////////////////////////////////
////////////////////////////////////////////////////////////////////

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor
  canvasContext.fillRect(leftX, topY, width, height,)
}






/////////// DRAW EVERYTHING ////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function drawEverything() {

  /////////// draw background ///////////////////////////////
  colorRect(0, 0, canvas.width, canvas.height, 'black')

  /////////// draw red player //////////////////////////////
  colorRect(redX, redY, 20, 20, 'rgb(255,50,83)')

  /////////// draw blue player //////////////////////////////
  colorRect(blueX, blueY, 20, 20, 'rgb(51,180,232)')

  colorRect((canvas.width / 2) - 5, (canvas.height / 2) - 5, 10, 10, 'white')

}






/////////// END ////////////////////////////////////////////////////
