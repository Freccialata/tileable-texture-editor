function stripClass(node, className) {
    node.className = node.className.replace(new RegExp('(?:^|\\s)' + className + '(?!\\S)'), '');
}
function addClass(node, className) {
    if (node.className.indexOf(className) == -1)
        node.className += " " + className;
}

function showImageWithCanvas(imageData, w, h, parentElement, canvasId = 'my-canvas') {
    // TEMP Show the state of the image before passing it to tgl.texture
    let myCanvas = document.getElementById(canvasId)
    if (!myCanvas) {
        myCanvas = document.createElement('canvas')
        myCanvas.id = canvasId
    }
    myCanvas.width = w
    myCanvas.height = h
    const myCtx = myCanvas.getContext('2d')
    myCtx.putImageData(imageData, 0, 0)
    parentElement.appendChild(myCanvas)
    parentElement.replaceChild(myCanvas, myCanvas)
}

window.onload = () => {
    // MAIN
    const i = new HistogramTiling()
}