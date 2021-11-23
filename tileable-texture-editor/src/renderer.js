// TODO check exactly how the image should be uploaded

class SeamlessTiling {
    constructor() {
        this.container_canvas = document.getElementById('canvas-container');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.original_pixelData = null;
        this.img_name = "pattern-rock.png"; // Starting default name
        this.applyOnClickFunctions();

        try {
            this.setupGL();
        } catch (e) {
            console.error(e.message + ". This app won't run properly.");
            return;
        }
    }

    applyOnClickFunctions() {
        document.getElementById("select-img-btn").addEventListener("click", () =>{this.selectimage()});
        document.getElementById("dwl-img-btn").addEventListener("click", ()=>{this.downloadImg()});
        document.getElementById("clear-canvas-btn").addEventListener("click", ()=>{this.clearcanvas()});
        document.getElementById("revert-btn").addEventListener("click", ()=>{this.revertToOriginalImage()});
    }

    loadImage(img_path) {
        if (img_path.length > 1) {
            const image = new Image();
            image.src = img_path;
            image.onload = () => {
                this.canvas.width = image.naturalWidth;
                this.canvas.height = image.naturalHeight;
                this.ctx.drawImage(image, 0, 0);
                this.container_canvas.innerHTML = "";
                this.container_canvas.appendChild(this.canvas);
                this.original_pixelData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
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

    clearcanvas() {
        this.container_canvas.innerHTML = "";
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.original_pixelData = null;
        this.img_name = "";
    }

    revertToOriginalImage() {
        this.ctx.putImageData(this.original_pixelData, 0, 0);
    }

    downloadImg() {
        // Download the image only if the canvas is not empty
        if (this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data
            .some(channel => channel !== 0)) {
            let link = document.createElement('a');
            link.download = this.img_name + '-edited.png';
            link.href = this.canvas.toDataURL();
            link.click();
        }
        else {
            throw new Error("No image to download");
        }
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
}


window.onload = () => {
    // MAIN
    const Evironment = new SeamlessTiling()
    Evironment.loadImage("./pattern-rock.png")
}

/*
DEBUG on console:
ca = document.getElementsByTagName("canvas")[0]
ca.getContext("webgl")
*/