import * as tf from "@tensorflow/tfjs";

export const runPrediction = async (model) => {
  const predictionInputForm = document.getElementById("prediction_input");
  const clientPresentationCompletedInput = document.getElementById("client_presentation_completed");
  const revisitingLeadStatusInput = document.getElementById("revisiting_lead_status");
  const downloadTrainedModelInput = document.getElementById("download_trained_model");

  const submitForPrediction = (e) => {
    //get data from form and create tensor from that data
    const tensorData = tf.tensor([Object.values({
      client_presentation_completed: clientPresentationCompletedInput.value / 100,
      revisiting_lead_status: revisitingLeadStatusInput.value / 100,
    })]);

    //use a pretained model
    //import * as tfn from "@tensorflow/tfjs-node";
    //model = await tf.loadLayersModel(tfn.io.fileSystem("./models/my-ltsm-model.json"));
    
    //send data to the model for prediction
    const prediction = model.predict(tensorData);
    //return the outcome
    const outcome = prediction.argMax(-1).dataSync()[0];
    const outcomeElement = document.getElementById("outcome");
    outcomeElement.style.display = "block";
    outcomeElement.innerText = outcome === 0 ? "Prospective Customer" : "High-Potential Customer";
    outcomeElement.style.color = outcome === 0 ? "red" : "green";
  };
  const downloadTrainedModel = async () => {
    await model.save('downloads://my-ltsm-model');
  };
  predictionInputForm.addEventListener("click", submitForPrediction);
  downloadTrainedModelInput.addEventListener("click", downloadTrainedModel);
};
