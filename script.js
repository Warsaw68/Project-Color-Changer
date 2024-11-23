document.getElementById('upload-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const fileInput = document.getElementById('imageInput');
    const effect = document.getElementById('effectSelect').value;

    if (!fileInput.files || !fileInput.files[0]) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw image on canvas
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Apply selected effect
            if (effect === 'grayscale') applyGrayscale(data);
            if (effect === 'blur') applyBlur(canvas, data);

            // Update canvas with the modified image
            ctx.putImageData(imageData, 0, 0);

            // Store images and redirect
            sessionStorage.setItem('originalImage', img.src);
            sessionStorage.setItem('transformedImage', canvas.toDataURL());
            window.location.href = 'result.html';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
});

// Grayscale effect
function applyGrayscale(data) {
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = gray;
    }
}

// Blur effect
function applyBlur(canvas, data) {
    const ctx = canvas.getContext('2d');
    ctx.filter = 'blur(3px)'; // Use CSS blur filter for simplicity
    ctx.drawImage(canvas, 0, 0);
    const blurredImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data.set(blurredImageData.data); // Update original image data
}
