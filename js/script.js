const generateForm = document.getElementById('generate-form');
const customizeForm = document.getElementById('customize-form');
const qr = document.getElementById('qrcode');
const qart = document.getElementById('qart');

let currentValue;
let currentSize;
let currentImage;

const onGenerateSubmit = async (e) => {
    e.preventDefault();
    clearUI();

    const url = document.getElementById('url').value;
    currentValue = url;

    const size = document.getElementById('size').value;
    currentSize = size;

    if (!url) {
        alert('Please enter a valid URL')
    } else {
        showSpinner('generated');

        setTimeout(() => {

            hideSpinner('generated');

            generateQRCode(url, size);
            const generatedCanvas = document.getElementsByTagName('canvas')[0];
            const saveUrl = generatedCanvas.toDataURL('image/png');
            convertCanvasToImage(generatedCanvas, currentSize, 'generated-qr-code');
            qr.style.display = 'block';

            setTimeout(() => {
                createSaveBtn(saveUrl, 'generated');
                createcustomizeFormBtn(saveUrl);

                setTimeout(() => {
                    const customizeFormBtn = document.querySelector("#customize-form-btn");
                    customizeFormBtn.addEventListener('click', showCustomizeForm);


                    const imageUpload = document.getElementById('image-upload');
                    imageUpload.addEventListener('change', async (e) => {
                        await uploadPhoto();
                    });
                }, 50);
            }, 50);

        }, 1000);
    }

}

const onCustomizeSubmit = (e) => {
    e.preventDefault();

    const imageUpload = document.getElementById('image-upload').value;

    if (!imageUpload) {
        alert('Please upload an image to proceed');
    } else {
        showSpinner('customized');
        customizeQRCode();

        setTimeout(() => {
            hideSpinner('customized');

            const customizedCanvas = document.getElementsByTagName('canvas')[0];
            const saveUrl = customizedCanvas.toDataURL('image/png');

            convertCanvasToImage(customizedCanvas, currentSize, 'customized-qr-code');
            qart.style.display = 'block';

            createSaveBtn(saveUrl, 'customized');
        }, 1000);

    }

}

const generateQRCode = (url, size) => {
    const qrCode = new QRCode('qrcode', {
        text: url,
        width: size,
        height: size,
    });

}

const showSpinner = (type) => {
    document.querySelector(`#${type} #spinner`).style.display = 'block'
}

const hideSpinner = (type) => {
    document.querySelector(`#${type} #spinner`).style.display = 'none'
}

const clearUI = () => {
    qr.innerHTML = '';
    const saveLinkGenerated = document.getElementById('save-link-generated');
    const saveLinkCustomized = document.getElementById('save-link-customized');
    const customizeFormBtn = document.getElementById('customize-form-btn');
    const customizedImage = document.getElementById('customized-qr-code');
    const filesUploaded = document.getElementById('image-upload');
    const imageUploaded = document.getElementById('image-uploaded');

    if (saveLinkGenerated) {
        saveLinkGenerated.remove();
    }
    if (saveLinkCustomized) {
        saveLinkCustomized.remove();
    }
    if (customizeFormBtn) {
        customizeFormBtn.remove();
    }
    if (customizedImage) {
        customizedImage.remove();
    }
    if (filesUploaded) {
        filesUploaded.value = '';
        imageUploaded.src = '';
    }

    document.getElementById('customize-form').style.display = 'none';

}

const createSaveBtn = (saveUrl, type) => {
    const link = document.createElement('a');
    link.id = 'save-link-' + type;
    link.classList = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded w-1/3 m-auto my-5';
    link.href = saveUrl;
    link.download = 'qrcode';
    link.innerHTML = 'Save Image';
    document.getElementById(type).appendChild(link);
}

const createcustomizeFormBtn = (qrCodeUrl, imageUrl) => {
    const btn = document.createElement('button');
    btn.id = 'customize-form-btn';
    btn.classList = 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded w-1/3 m-auto my-5';
    btn.innerHTML = 'Customize Image';
    document.getElementById('generated').appendChild(btn);
}

const showCustomizeForm = () => {
    document.getElementById('customize-form').style.display = 'block';
}

const readAsDataURL = async (file) => {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onerror = reject;
        fr.onload = () => {
            resolve(fr.result);
        }
        fr.readAsDataURL(file);
    });
}

const uploadPhoto = async () => {
    const file = document.getElementById('image-upload').files[0];
    const result = await readAsDataURL(file);
    const uploadedImage = document.getElementById('image-uploaded');
    uploadedImage.src = result;
}

const customizeQRCode = () => {
    const uploadedImage = document.getElementById('image-uploaded').src;
    const filter = document.querySelector('input[name="inline-radio-group"]:checked').value;

    new QArt({
        value: currentValue,
        imagePath: uploadedImage,
        filter: filter,
        size: currentSize,
        version: 10
    }).make(document.getElementById('qart'));
}

const convertCanvasToImage = (canvasElement, dimensions, imageId) => {
    const base64Image = canvasElement.toDataURL('image/png');
    const parent = canvasElement.parentElement;

    const finalImage = document.createElement('img');
    finalImage.id = imageId;
    finalImage.src = base64Image;
    finalImage.classList = 'p-10'
    finalImage.height = dimensions;
    finalImage.width = dimensions;

    parent.innerHTML = '';
    parent.appendChild(finalImage);

} 



generateForm.addEventListener('submit', onGenerateSubmit);
customizeForm.addEventListener('submit', onCustomizeSubmit);


