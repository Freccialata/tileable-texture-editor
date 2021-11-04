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