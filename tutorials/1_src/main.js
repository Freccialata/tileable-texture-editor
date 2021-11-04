var foto;
window.onload = () => {
    foto = new Foto();
}

function selectimage() {
    document.getElementById("foto-file").click()
}

function makeGrayscale() {
    foto.grayscale()
}

function makeBrighter(){
    foto.makeBright()
}

function makeDarker() {
    foto.makeDark()
}

function makeBlur() {
    foto.applyBlurFilter()
}

function makeEmboss() {
    foto.applyEmbossFilter()
}

function makeSharp() {
    foto.applySharpFilter();
}

function download() {
    foto.export()
}

function openColorpicker() {
    document.getElementById("color-picker").click()
}

function makeColorize(elem) {
    let color = elem.value
    foto.colorize(color)
}

function openColorFilterPicker() {
    document.getElementById("colorize-color-picker").click()
}

function applyColorFilter(elem) {
    let color = elem.value
    foto.applyColorFilter(color)
}

function makeTransparent() {
    foto.makeTransparent()
}

function crop() {
    foto.cropSelected()
}

function flipVertically() {
    foto.flipVertically()
}

function rotate(elem) {
    foto.rotate(elem.value)
}