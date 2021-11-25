// TODO check exactly how the image should be uploaded

class SeamlessTiling {
    constructor() {
        this.container_canvas = document.getElementById('canvas-container');
        this.canvas = document.createElement('canvas');
        this.canvas.id = "render-result";
        this.original_pixelData = null;
        this.img_name = "pattern-rock.png"; // Starting default name
        this.applyOnClickFunctions();

        try {
            this.setupGL();
        } catch (e) {
            console.error(e.message + ". This app won't run properly.");
        }

        try {
            this.startRenderPipeline();
        } catch (e) {
            console.error(e);
        }
    }

    applyOnClickFunctions() {
        document.getElementById("select-img-btn").addEventListener("click", () =>{this.selectimage()});
        document.getElementById("dwl-img-btn").addEventListener("click", ()=>{this.downloadImg()});
        document.getElementById("clear-canvas-btn").addEventListener("click", ()=>{this.clearcanvas()});
        // document.getElementById("revert-btn").addEventListener("click", ()=>{this.revertToOriginalImage()});
    }

    setupGL() {
        let gl;
        try {
            gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
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

    startRenderPipeline() {
        this.loadImage(this.img_name);
        this.container_canvas.appendChild(this.canvas)
        /*let renderer = this;
        
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
        });*/
    }

    createQuadVbo() {
        const vbo = new tgl.VertexBuffer();
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

    preparePattern(pattern) {
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

        // Show the uploaded image after cropping and before the histogram algorithm
        HelperFunc.showImageWithCanvas(data, w, h, this.container_canvas);
        
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
            lutF[i] = MathFunc.truncCdfInv(histo[i]/histo[255], 1.0/6.0);
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

        this.renderOnScreen();
    }

    loadImage(img_path) {
        if (img_path.length > 1) {
            const image = new Image();
            image.src = img_path;
            image.onload = () => {
                this.preparePattern(image);
                /*this.canvas.width = image.naturalWidth;
                this.canvas.height = image.naturalHeight;
                this.ctx.drawImage(image, 0, 0);
                this.container_canvas.innerHTML = "";
                this.container_canvas.appendChild(this.canvas);
                this.original_pixelData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);*/
            }
        }
        else {
            throw new Error("Image path not set or not valid: " + img_path);
        }
    }

    selectimage() {
        const reader = new FileReader()
        const file_upload_elem = document.getElementById("foto-file");
        
        file_upload_elem.click();
    
        file_upload_elem.onchange = () => {
            this.img_name = file_upload_elem.files.item(0).name;
            console.log(this.img_name);
            reader.readAsDataURL(file_upload_elem.files[0])
            reader.onload = () => {
                this.loadImage(reader.result);
            }
        }
    }

    renderOnScreen() {
        const gl = this.gl;
        
        let windowW =  (window.innerWidth > 0) ? window.innerWidth : screen.width;
        this.canvas.width = Math.min(windowW, 512); // Default: 820
        
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        let TriangleSize = 0.25;
        let a = TriangleSize*Math.cos(Math.PI/3.0), b = TriangleSize;
        let c = TriangleSize*Math.sin(Math.PI/3.0), d = 0.0;
        let det = a*d - c*b;
        
        this.time += this.speed/60;
        
        let size = 1;
        let pan = 0;
        let aspect = this.width/this.height;
        
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

    clearcanvas() {
        this.container_canvas.innerHTML = "";
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.original_pixelData = null;
        this.img_name = "";
    }

    revertToOriginalImage() {
        this.ctx.putImageData(this.original_pixelData, 0, 0);
    }

    downloadImg() {
        // Download the image only if the canvas is not empty
        /*if (this.gl.getImageData(0, 0, this.canvas.width, this.canvas.height).data
            .some(channel => channel !== 0)) {
            let link = document.createElement('a');
            link.download = this.img_name + '-edited.png';
            link.href = this.canvas.toDataURL();
            link.click();
        }
        else {
            throw new Error("No image to download");
        }*/
        const tempcanvas = document.createElement("canvas")
        const tctx = tempcanvas.getContext('2d');
        tctx.drawImage(this.canvas, 0, 0);
        const capturedImage = tempcanvas.toDataURL();

        let link = document.createElement('a');
        link.download = this.img_name + '-edited.png';
        link.href = capturedImage;
        link.click();
    }
}


window.onload = () => {
    // MAIN
    const Evironment = new SeamlessTiling()
    // Evironment.loadImage("./pattern-rock.png")
}