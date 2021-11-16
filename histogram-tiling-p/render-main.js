function stripClass(node, className) {
    node.className = node.className.replace(new RegExp('(?:^|\\s)' + className + '(?!\\S)'), '');
}
function addClass(node, className) {
    if (node.className.indexOf(className) == -1)
        node.className += " " + className;
}

window.onload = () => {
    console.log("window loaded, launching HistogramTiling()");
    const i = new HistogramTiling()
}