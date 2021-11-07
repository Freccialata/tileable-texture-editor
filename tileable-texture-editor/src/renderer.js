const container_canvas = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const downlad_btn = document.getElementById('dwl-img-btn')
const image = new Image();
let original_pixelData = null;

function loadimage(imageSource) {
    image.src = imageSource
    image.onload = () => {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.drawImage(image, 0, 0);
        container_canvas.innerHTML = "";
        container_canvas.appendChild(canvas);
        original_pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
}

function selectimage() {
    const reader = new FileReader()
    file_upload_elem = document.getElementById("foto-file");
    file_upload_elem.click();

    file_upload_elem.onchange = () => {
        reader.readAsDataURL(file_upload_elem.files[0])
        reader.onload = () => {
            loadimage(reader.result);
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

function downloadImg(img_name = 'edited') {
    // Download the image only if the canvas is not empty
    if (ctx.getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0)) {
        let link = document.createElement('a');
        link.download = img_name + '.png';
        link.href = canvas.toDataURL()
        link.click();
    }
    else {
        console.log("No image to download!");
        return;
    }
}

function downloadImg_(img_name, img_in) {
    let link = document.createElement('a');
    link.download = img_name + '.png';
    let t_img = new Image(img_in)
    link.href = t_img.toDataURL();
    link.click();
}


// TODO Figure out how to take a raw image data buffer and display it on canvas
loadimage("../imgs/TexturesCom_RockSharp0062_4_S.jpg");

const sharp = require('sharp');
(async function () {
    let img_path = "../imgs/TexturesCom_RockSharp0062_4_S.jpg";
    try {
        const img = await sharp(img_path);
        img.blur(3)
        let img_data = await img.raw().toBuffer();
        // aa
        loadimage(imag_url)
        // downloadImg_('test', temp_image);
        // console.log( info );
    }
    catch (er) {
        console.log(er);
    }
})();