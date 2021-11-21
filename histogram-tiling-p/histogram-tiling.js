var HistogramTiling = function() {
    this.canvas         = document.getElementById("render-canvas");
    this.overlay        = document.getElementById("render-overlay");
    this.content        = document.getElementById("content");
    this.controls       = document.getElementById("controls");
    
    this.boundRenderLoop = this.renderLoop.bind(this);
    
    try {
        this.setupGL();
    } catch (e) {
        /* GL errors at this stage are to be expected to some degree,
           so display a nice error message and call it quits */
        this.fail(e.message + ". This demo won't run in your browser.");
        return;
    }
    try {
        this.setupUI();
    } catch (e) {
        /* Errors here are a bit more serious and shouldn't normally happen.
           Let's just dump what we have and hope the user can make sense of it */
        this.fail("Ooops! Something unexpected happened. The error message is listed below:<br/>" +
             "<pre>" + e.message + "</pre>");
        return;
    }
    
    /* Ok, all seems well. Time to show the controls */
    //this.controls.style.visibility = "visible";
    
    window.requestAnimationFrame(this.boundRenderLoop);
}

HistogramTiling.prototype.setupGL = function() {
    try {
        var gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
    } catch (e) {}
    if (!gl)
        throw new Error("Could not initialise WebGL");
    
    tgl.init(gl);
    
    this.gl = gl;
    this.quadVbo = this.createQuadVbo();
    
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    this.imageCanvas = document.createElement('canvas');
    this.imageContext = this.imageCanvas.getContext('2d');
    
    this.compositeProgram = new tgl.Shader("shader-vs", "shader-fs");
    
    this.randRes = 512;
    
    this.time = 0;
    this.speed = 0; // MODIF Default=1
    
    var texels = new Uint8Array(this.randRes*this.randRes*4);
    for (var i = 0; i < this.randRes*this.randRes*4; ++i)
        texels[i] = Math.random()*256.0;
    
    this.randTex = new tgl.Texture(this.randRes, this.randRes, 4, false, false, false, texels);

    this.rgbToYcbcrOff = [16, 128, 128];
    this.rgbToYcbcrMat = [
        [  65.5/255.0,  128.6/255.0,   25.0/255.0],
        [- 37.8/255.0, - 74.2/255.0,  112.0/255.0],
        [ 112.0/255.0, - 93.8/255.0, - 18.2/255.0]
    ];
}

HistogramTiling.prototype.setupUI = function() {
    let renderer = this;
    
    let patterns = document.getElementById("patterns").childNodes;
    let activePattern = null;
    for (let i = 0; i < patterns.length; ++i) {
        if (patterns[i] instanceof HTMLImageElement) {
            if (!activePattern)
                activePattern = patterns[i];
            
            patterns[i].addEventListener("click", (function(upload) {
                if (upload)
                    document.getElementById('file-input').click();
                else
                    renderer.preparePattern(this);
                addClass(this, "active");
                if (activePattern)
                    stripClass(activePattern, "active");
                activePattern = this;
            }).bind(patterns[i], i == patterns.length - 2));
        }
    }
    this.preparePattern(activePattern);
    
    document.getElementById('file-input').addEventListener('change', function() {
        if (!this.files)
            return;
        let img = document.getElementById('img-upload');
        img.src = URL.createObjectURL(this.files[0]);
        img.onload = function() {
            renderer.preparePattern(this);
        };
    });
    
    document.body.addEventListener('dragover', function(ev) {
        ev.preventDefault();
    });
    document.body.addEventListener('drop', function(ev) {
        ev.preventDefault();
        
        let file;
        
        if (ev.dataTransfer.items) {
            if (ev.dataTransfer.items[0].kind == 'file')
                file = ev.dataTransfer.items[0].getAsFile();
        } else if (ev.dataTransfer.files) {
            file = ev.dataTransfer.files[0];
        }
        
        let reader = new FileReader();
        let img = document.getElementById('img-upload');
        reader.readAsDataURL(file);
        reader.onload = function(f) {
            img.src = f.target.result;
            img.onload = function() {
                renderer.preparePattern(this);
            };
        };
    });
    
    /*var zoomSlider = new Slider("zoom", 0.25, 2, false, function(zoom) {
        renderer.setZoom(zoom);
    });
    var speedSlider = new Slider("scroll-speed", 0.0, 2.5, false, function(speed) {
        renderer.setSpeed(speed);
    });
    speedSlider.setPosition(0);*/
    renderer.setSpeed(0.0);
    renderer.setZoom(1);
    this.overlay.parentNode.removeChild(this.overlay);
}

HistogramTiling.prototype.fail = function(message) {
    var sorryP = document.createElement("p"); 
    sorryP.appendChild(document.createTextNode("Sorry! :("));
    sorryP.style.fontSize = "50px";

    var failureP = document.createElement("p");
    failureP.className = "warning-box";
    failureP.innerHTML = message;
    
    var errorImg = document.createElement("img"); 
    errorImg.title = errorImg.alt = "The Element of Failure";
    errorImg.src = "derp.gif";
    
    var failureDiv = document.createElement("div"); 
    failureDiv.className = "center";
    failureDiv.appendChild(sorryP);
    failureDiv.appendChild(errorImg);
    failureDiv.appendChild(failureP);
    
    document.getElementById("content").appendChild(failureDiv);
    this.overlay.style.display = this.canvas.style.display = 'none';
}

HistogramTiling.prototype.renderLoop = function(timestamp) {
    window.requestAnimationFrame(this.boundRenderLoop);
    
    this.render(timestamp);
}

function erf(x) {
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var p  =  0.3275911;
    
    var sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    
    var t = 1.0/(1.0 + p*x);
    var y = 1.0 - ((((a5*t + a4)*t + a3)*t + a2)*t + a1)*t*Math.exp(-x*x);
    
    return sign*y;
}
function derf(x) {
    return 2.0/Math.sqrt(Math.PI)*Math.exp(-x*x);
}
function erfInv(x) {
    var y = 0.0, err;
    do {
        err = erf(y) - x;
        y -= err/derf(y);
    } while (Math.abs(err) > 1e-8);
    return y;
}
function C(sigma) {
    return 1.0/erf(0.5/(sigma*Math.sqrt(2.0)));
}
function truncGaussian(x, sigma) {
    return C(sigma)/(sigma*Math.sqrt(2*Math.PI))*Math.exp(-(x - 0.5)*(x - 0.5)/(2.0*sigma*sigma));
}
function truncCdf(x, sigma) {
    return 0.5*(1.0 + C(sigma)*erf((x - 0.5)/(sigma*Math.sqrt(2.0))));
}
function truncCdfInv(x, sigma) {
    return 0.5 + Math.sqrt(2)*sigma*erfInv((2.0*x - 1.0)/C(sigma));
}

HistogramTiling.prototype.preparePattern = function(pattern) {
    // NOTE the image is cropped to be fitted into a (Power of two?) specific resolution
    let minSize = Math.min(pattern.naturalWidth, pattern.naturalHeight);
    let size = 1;
    while (2*size <= minSize)
        size *= 2;
    let w = size;
    let h = size;
    this.imageCanvas.width = w;
    this.imageCanvas.height = h;
    this.imageContext.drawImage(pattern, 0, 0);
    let data = this.imageContext.getImageData(0, 0, w, h);
    // TEMP to show the original image
    showImageWithCanvas(data, w, h, this.content, "original-image-squared");
    
    let histo = new Uint32Array(256);
    for (let i = 0; i < 256; ++i)
        histo[i] = 0;
    
    for (let i = 0; i < w*h; ++i) {
        let o = this.rgbToYcbcrOff;
        let M = this.rgbToYcbcrMat;
        let r = data.data[i*4 + 0];
        let g = data.data[i*4 + 1];
        let b = data.data[i*4 + 2];
        let Y  = o[0] + M[0][0]*r + M[0][1]*g + M[0][2]*b;
        let Cb = o[1] + M[1][0]*r + M[1][1]*g + M[1][2]*b;
        let Cr = o[2] + M[2][0]*r + M[2][1]*g + M[2][2]*b;
        data.data[i*4 + 0] = Math.max(0, Math.min(255, Math.floor(Y )));
        data.data[i*4 + 1] = Math.max(0, Math.min(255, Math.floor(Cb)));
        data.data[i*4 + 2] = Math.max(0, Math.min(255, Math.floor(Cr)));
        
        histo[data.data[i*4]]++;
    }
    
    for (let i = 1; i < 256; ++i)
        histo[i] += histo[i - 1];
    
    let lutF = new Float32Array(256);
    let lut = new Uint8Array(256);
    for (let i = 0; i < 256; ++i) {
        lutF[i] = truncCdfInv(histo[i]/histo[255], 1.0/6.0);
        lut[i] = Math.max(0, Math.min(255, Math.floor(255*lutF[i])));
    }
    
    for (let i = 0; i < w*h; ++i)
        data.data[i*4] = lut[data.data[i*4]];
        
    let ilutRes = 1024;
    let ilut = new Uint8Array(ilutRes);
    for (let i = 0; i < ilutRes; ++i) {
        let f = (i + 0.5)/ilutRes;
        ilut[i] = 255;
        for (let j = 0; j < 256; ++j) {
            if (f < lutF[j]) {
                ilut[i] = j;
                break;
            }
        }
    }
    
    this.ilut = new tgl.Texture(ilutRes, 1, 1, false, true, true, ilut);
    this.pattern = new tgl.Texture(w, h, 4, false, true, false, data.data);
    this.patternScale = 512/w;

    // TEMP Show the state of the image before passing it to tgl.texture
    showImageWithCanvas(data, w, h, this.content)
}

HistogramTiling.prototype.createQuadVbo = function() {
    var vbo = new tgl.VertexBuffer();
    vbo.addAttribute("Position", 3, this.gl.FLOAT, false);
    vbo.addAttribute("TexCoord", 2, this.gl.FLOAT, false);
    vbo.init(4);
    vbo.copy(new Float32Array([
         1.0,  1.0, 0.0, 1.0, 1.0,
        -1.0,  1.0, 0.0, 0.0, 1.0,
        -1.0, -1.0, 0.0, 0.0, 0.0,
         1.0, -1.0, 0.0, 1.0, 0.0
    ]));
    
    return vbo;
}

HistogramTiling.prototype.setZoom = function(zoom) {
    this.zoom = zoom;
}
HistogramTiling.prototype.setSpeed = function(speed) {
    this.speed = speed;
}

HistogramTiling.prototype.render = function(timestamp) {
    var gl = this.gl;
    
    var windowW =  (window.innerWidth > 0) ? window.innerWidth : screen.width;
    this.canvas.width = Math.min(windowW, 512); // Default: 820
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var TriangleSize = 0.25;
    var a = TriangleSize*Math.cos(Math.PI/3.0), b = TriangleSize;
    var c = TriangleSize*Math.sin(Math.PI/3.0), d = 0.0;
    var det = a*d - c*b;
    
    this.time += this.speed/60;
    
    var size = this.zoom
    var pan = this.time;
    var aspect = this.width/this.height;
    
    this.quadVbo.bind();
    this.randTex.bind(0);
    this.pattern.bind(1);
    this.ilut.bind(2);
    this.compositeProgram.bind();
    this.compositeProgram.uniform2F("Scale", size*aspect, -size);
    this.compositeProgram.uniform2F("Offset", pan, pan*0.5);
    this.compositeProgram.uniformI("RandRes", this.randRes);
    this.compositeProgram.uniformTexture("Rand", this.randTex);
    this.compositeProgram.uniformTexture("Pattern", this.pattern);
    this.compositeProgram.uniformTexture("InvLUT", this.ilut);
    this.compositeProgram.uniformF("Exposure", 0);
    this.compositeProgram.uniformMatrix2F("LatticeToWorld", a, b, c, d);
    this.compositeProgram.uniformMatrix2F("WorldToLattice", d/det, -b/det, -c/det, a/det);
    this.quadVbo.draw(this.compositeProgram, this.gl.TRIANGLE_FAN);
}