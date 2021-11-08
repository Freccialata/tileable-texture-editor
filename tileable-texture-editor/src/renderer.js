const sharp = require('sharp');

const container_canvas = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let image_path = "./pattern-rock.png"
let original_pixelData = null;
let sharp_image = null;

function loadingimage(img_path) {
    image_path = img_path
    const image = new Image();
    image.src = img_path;
    image.onload = () => {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.drawImage(image, 0, 0);
        container_canvas.innerHTML = "";
        container_canvas.appendChild(canvas);
        original_pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    try {
        sharp_image = sharp(img_path);
    } catch (er) {
        console.log("Error loadingimage() using Sharp\n" + er);
    }
}

function selectimage() {
    const reader = new FileReader()
    file_upload_elem = document.getElementById("foto-file");
    file_upload_elem.click();

    file_upload_elem.onchange = () => {
        reader.readAsDataURL(file_upload_elem.files[0])
        reader.onload = () => {
            loadingimage(reader.result);
        }
    }
}

function clearcanvas() {
    container_canvas.innerHTML = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function makeBW() {
    let current_pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < current_pixelData.data.length; i += 4) {
        let r = current_pixelData.data[i];
        let g = current_pixelData.data[i + 1];
        let b = current_pixelData.data[i + 2];

        bw_p = 0.2627 * r + 0.6780 * g + 0.0593 * b;
        // bw_p = (r+g+b)/3;

        current_pixelData.data[i] = bw_p;
        current_pixelData.data[i + 1] = bw_p;
        current_pixelData.data[i + 2] = bw_p;
    }
    ctx.putImageData(current_pixelData, 0, 0);
}

function revertToOriginalImage() {
    ctx.putImageData(original_pixelData, 0, 0);
}

function downloadImg(img_name = '') {
    // Download the image only if the canvas is not empty
    if (ctx.getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0)) {
        let link = document.createElement('a');
        link.download = img_name + '-edited.png';
        link.href = canvas.toDataURL()
        link.click();
    }
    else {
        console.log("No image to download!");
        return;
    }
}

async function sharp_blur() {
    // TODO Figure out a better way to take a raw image data buffer and display it on canvas
    // TODO fix Error: Input file is missing
    try {
        sharp_image.blur(3);
        const working_imag_path = "working_test.png"
        let info = await sharp_image.png().toFile(working_imag_path);
        console.log(info);
        loadingimage("./" + working_imag_path);
    }
    catch (er) {
        console.log(er);
    }
};

async function toTile() {
    try {
        // Some elaboration
        // Implement histogram algorithm (check WebGL and demo code!)

        // Temporary save for preview on the app
        const working_imag_path = "./working_test.png"
        let info = await sharp_image.png().toFile(working_imag_path);
        console.log(info);
        loadingimage("." + working_imag_path);
    }
    catch (er) {
        console.log(er);
    }
};


loadingimage(image_path);