import { Model } from "./Model";
import { View } from "./View";
import { Controller } from "./Controller";

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

window.addEventListener('load', (event) => {
	controller.init();
})
