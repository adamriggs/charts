
/**
 * the glue that holds it together
 * 
 * this manages interactions between the model and the view
 */

export class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
	}

	init() {
		// console.log('init()');
		this.model.init();
		this.view.init();
	}
}