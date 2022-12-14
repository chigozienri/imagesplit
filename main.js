const result = document.querySelector('#result');
const splitButton = document.querySelector('#split');
const fileInput = document.querySelector('#file');
const canvas = document.querySelector('#canvas');
const size = document.querySelector('#size');
const download = document.querySelector('#download');
const columns = document.querySelector('#columns');
const rows = document.querySelector('#rows');

// Canvas 2D context
const ctx = canvas.getContext('2d');

var imageSrc = undefined;

function imagesplit (imageSrc) {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
        cutImageUp(img, numColsToCut=columns.value, numRowsToCut=rows.value)
    }
}

function cutImageUp(image, numColsToCut=2, numRowsToCut=2) {
    var imagePieces = [];
    var widthOfOnePiece = image.width / numColsToCut
    var heightOfOnePiece = image.height / numRowsToCut

    for(var y = 0; y < numRowsToCut; ++y) {
        for(var x = 0; x < numColsToCut; ++x) {
            var canvas = document.createElement('canvas');
            canvas.width = widthOfOnePiece;
            canvas.height = heightOfOnePiece;
            var context = canvas.getContext('2d');
            context.drawImage(image, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, canvas.width, canvas.height);
            imagePieces.push(canvas.toDataURL());
        }
    }

    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    removeAllChildNodes(result);
    let filename = fileInput.files[0].name;
    filename = filename.substring(0, filename.lastIndexOf('.'));
    let message = document.createElement('div');
    message.setAttribute('class', 'message');
    message.innerHTML = 'Click/tap image to download';
    result.append(message);
    for (let i=0; i<imagePieces.length; ++i) {
        let imageElement = document.createElement('img');
        imageElement.src = imagePieces[i];
        let link = document.createElement('a');
        link.setAttribute('download', filename +'_' + i + '.png');
        link.setAttribute('href', '#');
        link.setAttribute('id', 'download');
        link.append(imageElement);
        link.addEventListener('click', () => {dlCanvas(imageElement, link)}, false);
        result.append(link);
    }
}


function readAndImagesplit () {
    var file = fileInput.files[0];
    if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener("load", function () {
            imageSrc = this.result;
            imagesplit(imageSrc);
        });
    } else {
        return
    }
    result.style.display = "block";
}

splitButton.addEventListener('click', () => {readAndImagesplit()});
columns.addEventListener('change', () => {readAndImagesplit()});
rows.addEventListener('change', () => {readAndImagesplit()});
fileInput.addEventListener('change', () => {
    readAndImagesplit();
});

function dlCanvas(img, a) {
    // https://stackoverflow.com/a/12796748
    var dt = img.src;
    /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
    dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
  
    a.setAttribute('href', dt);
  };