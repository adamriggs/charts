
/**
 * CRUD operations for charts
 * 
 * new chart
 * save chart
 * updated chart
 * delete chart
 * 
 * source of truth for all charts
 */

export class Model {
	savedCharts = [];
	workingChart = {};

	constructor() {

	}

	init() {
		// console.log('init()');
	}

	addChart() {
		this.workingChart = new Chart();
	}

	editType(type) {
		this.woriingChart.type = type;
	}

	editData(data) {
		this.workingChart.data = data;
	}
};

// class Chart {
// 	type = '';
// 	data = {};

// 	constructor() {}
// }