const container_canvas = document.getElementById('canvas-container')
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const downlad_btn = document.getElementById('dwl-img-btn')
const image = new Image()

function loadimage(imageSource) {
    image.src = imageSource
    image.onload = () => {
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        ctx.drawImage(image,0,0)
        container_canvas.innerHTML = ""
        container_canvas.appendChild(canvas)
    }
}

function selectimage() {
    const reader = new FileReader()
    file_upload_elem = document.getElementById("foto-file")
    file_upload_elem.click()
    
    file_upload_elem.onchange = () => {
        reader.readAsDataURL(file_upload_elem.files[0])
        reader.onload = () => {
            loadimage(reader.result)
        }
    }
}

function clearcanvas(){
    container_canvas.innerHTML = ""
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function downloadImg() {
    // Download the image only if the canvas is not empty
    if(ctx.getImageData(0, 0, canvas.width, canvas.height).data
    .some(channel => channel !== 0)){
        let link = document.createElement('a');
        link.download = 'edited.png';
        link.href = canvas.toDataURL()
        link.click();
    }
    else{
        console.log("No image to download!");
        return
    }
}

loadimage("../imgs/TexturesCom_RockSharp0062_4_S.jpg")