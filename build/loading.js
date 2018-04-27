let barFill = document.getElementById('barFill')

let barTimer = null
let loadingWidth = 0


function startLoading () {
  barFill.style.width = loadingWidth
  increaseLoading()
}


function increaseLoading () {
    barFill.style.width = `${loadingWidth}px`

    if (loadingWidth < 390) {
        loadingWidth += 5
        barTimer = setTimeout(increaseLoading, 200)
    }
    else { clearTimeout(barTimer) }
}
