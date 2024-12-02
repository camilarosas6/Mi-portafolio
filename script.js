// The link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/eNHcdtOaU/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // Load the model and metadata
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Setup webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // Append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  labelContainer.innerHTML = ""; // Clear any previous labels
}

// Webcam loop
async function loop() {
  webcam.update(); // Update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// Run the webcam image through the image model
async function predict() {
  const prediction = await model.predict(webcam.canvas);
  const outputSection = document.querySelector(".output-section");

  // Clear current outputs
  outputSection.innerHTML = `<h3>Predictions</h3>`;

  prediction.forEach(({ className, probability }) => {
    const probabilityPercent = (probability * 100).toFixed(2);
    const progressBar = `
      <div class="output-item">
        <span class="label">${className}</span>
        <div class="progress-bar" style="--progress: ${probabilityPercent};"></div>
      </div>
    `;
    outputSection.innerHTML += progressBar;
  });
}
