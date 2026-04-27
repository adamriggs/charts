
/**
 * big time UI stuff here
 * 
 * two main screens: chart list, and chart edit
 */

/**
 * I need more UI elements to add code to before I can get farther with the code
 * just concentrate on the cart creation first
 * - better UI and flow
 * - - better buttons
 * - - slide show of steps 
 * - - improve the chart list too
 * - edit chart labels
 * - multidimensional data
 * - save and list charts - save to local storage for now
 * - export as png/jpg
 * - work with saved datasets - load & manage data from an external file
 * - pull data from a live feed
 */

import Chart from 'chart.js/auto';

const chartTypes = [
	'bar',
	'pie',
	'doughnut',
	'bubble',
	'line',
	'polarArea',
	'radar',
	'scatter'
];

export class View {
	displayChartData = {
		type: '',
		data: [],
		labels: [],
		id: crypto.randomUUID(),
	};
	displayChartObject;
	savedCharts = [];
	chartButtons = [];

	constructor() {

	}

	init() {
		this.initDomElements();
		this.initChartTypes();
		this.initListeners();

		this.chartButtons[0].click();
		this.loadSavedCharts();
	}

	initDomElements() {
		this.savedChartsElem = document.querySelector('.chart-list__saved-charts');
		this.selectChartList = document.querySelector('.chart-editor__select ul');
		this.data = document.querySelector('.chart-editor__data__input');
		// this.drawBtn = document.querySelector('.chart-editor__controls__draw');
		this.saveBtn = document.querySelector('.chart-editor__controls__save');
		this.exitBtn = document.querySelector('.chart-editor__controls__exit');
		this.previewCanvas = document.querySelector('.chart-editor__preview canvas');
	}

	initChartTypes() {
		chartTypes.forEach(chart => {
			const li = document.createElement('li');
			const btn = document.createElement('button');
			btn.classList.add('chart-editor__select__' + chart);
			btn.textContent = chart;

			btn.dataset.chartType = chart;

			li.appendChild(btn);
			this.selectChartList.appendChild(li);
			this.chartButtons.push(btn);
		});
	}

	setChartTypeButtons(type) {
		this.chartButtons.forEach(btn => {
			btn.classList.remove('selected');

			if (type === btn.dataset.chartType) {
				btn.classList.add('selected');
			}
		})
		this.selectChart(type);
	}

	initListeners() {
		this.chartButtons.forEach(btn => {
			btn.addEventListener('click', (event) => {
				this.setChartTypeButtons(event.target.dataset.chartType);
			});
		})

		this.data.addEventListener('input', (event) => {
			this.dataUpdate(event.target.value);
		});

		// this.drawBtn.addEventListener('click', (() => {
		// 	this.drawChart();
		// }));

		this.saveBtn.addEventListener('click', (() => {
			console.log('save');
			this.saveChart();
		}));
	}

	saveChart() {
		const savedChart = this.getSavedChart(this.displayChartData.id);
		console.log('displayChartData:', this.displayChartData);
		console.log('savedChart:', savedChart);
		if (savedChart === null) {
			console.log('null');
			this.savedCharts.push(this.displayChartData);
		} else {
			console.log('else');
			this.savedCharts.forEach(chart => {
				// console.log(chart);
				console.log(chart.id);
				console.log(this.displayChartData.id);
				console.log('*****');
				if (chart.id === this.displayChartData.id) {
					console.log('yep');
					chart = this.displayChartData;
				}
			})
		}
		
		console.log(this.savedCharts);
		localStorage.setItem('savedCharts', JSON.stringify(this.savedCharts));
	}

	loadSavedCharts() {
		console.log('loadSavedCharts()');
		this.savedCharts = JSON.parse(localStorage.getItem('savedCharts')) || [];

		if (this.savedCharts.length > -1) {
			this.savedChartsElem.textContent = '';

			this.savedCharts.forEach((chart, i)=> {
				const li = document.createElement('li');
				const chartElem = document.createElement('button');
				chartElem.dataset.chartId = chart.id;
				chartElem.textContent = chart.type;

				chartElem.addEventListener('click', (event) => {
					this.loadChart(event.target.dataset.chartId);
				});

				li.appendChild(chartElem);
				this.savedChartsElem.appendChild(li);
			})
		}
	}

	loadChart(id) {
		const displayChartData = this.getSavedChart(id);
		// console.log(displayChartData);
		this.displayChartData = displayChartData;

		this.data.textContent = displayChartData.data.join(', ');
		this.setChartTypeButtons(displayChartData.type);
	}

	getSavedChart(id) {
		let returnChart = null;
		this.savedCharts.forEach(chart => {
			if (chart.id === id) {
				returnChart = chart;
			}
		});
		return returnChart;
	}

	selectChart(type) {
		this.displayChartData.type = type;

		if (this.data.value !== '') {
			this.dataUpdate();
		}

		if (this.displayChartData.data !== null || this.displayChartData.data.length !== -1) {
			this.drawChart();
		}
	}

	dataUpdate() {
		this.displayChartData.data = Array.from(this.data.value.split(',').map(n => parseInt(n.trim(), 10)));
		this.displayChartData.labels = this.displayChartData.data;

		if (this.displayChartData.type !== '') {
			this.drawChart();
		}
	}

	drawChart() {
		console.log('drawChart()');

		if (this.displayChartData.data === null || this.displayChartData.type === '') {
			return;
		}

		if (this.displayChartObject) { this.displayChartObject.destroy(); }

		this.displayChartObject = new Chart(
			this.previewCanvas,
			{
				type: this.displayChartData.type,
				data: {
					labels: this.displayChartData.labels,
					datasets: [{
						// label: '# of Votes',
						data: this.displayChartData.data,
						// borderWidth: 1
					}]
				},
				// options: {
				// 	scales: {
				// 		y: {
				// 			beginAtZero: true
				// 		}
				// 	}
				// }
			});

	}
}