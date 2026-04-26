
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
	// elements = {};
	newChart = {};
	chartButtons = [];

	constructor() {

	}

	init() {
		// console.log('init()');
		this.initDomElements();
		this.initChartTypes();
		this.initListeners();

		// this.drawChart();
	}

	initDomElements() {
		this.selectChartElem = document.querySelector('.chart-editor__select');
		this.data = document.querySelector('.chart-editor__data__input');
		this.drawBtn = document.querySelector('.chart-editor__preview__draw');
		this.previewCanvas = document.querySelector('.chart-editor__preview canvas');
	}

	initChartTypes() {
		chartTypes.forEach(chart => {
			// console.log(chart);
			const btn = document.createElement("button");
			btn.classList.add('chart-editor__select__' + chart);
			btn.textContent = chart;

			this.selectChartElem.appendChild(btn);

			this.chartButtons.push(btn);
		});
	}

	initListeners() {
		this.chartButtons.forEach(btn => {
			btn.addEventListener('click', (event) => {
				this.selectChart(event.target.textContent);
			})
		})

		this.data.addEventListener('input', (event) => {
			this.dataUpdate(event.target.value);
		});

		this.drawBtn.addEventListener('click', (() => {
			this.drawChart();
		}).bind(this))
	}

	selectChart(type) {
		// console.log('selectChart(' + type + ')');
		this.newChart.type = type;

		this.drawChart();
	}

	dataUpdate() {
		// console.log('dataUpdate(' + data + ')');
		console.log(this.data);
		this.newChart.data = Array.from(this.data.value.split(',').map(n => parseInt(n.trim(), 10)));
		this.newChart.labels = this.newChart.data;
		console.log(this.newChart);
	}

	drawChart() {
		console.log('drawChart()');
		console.log(this.newChart);
		this.dataUpdate();

		// const data = Array.from(this.newChart.data.split(',').map(n => parseInt(n.trim(), 10)));
		// const labels = data;

		console.log('data:', this.newChart.data);
		console.log('labels:', this.newChart.labels);

		if (this.newChart.chart) { this.newChart.chart.destroy(); }

		this.newChart.chart = new Chart(
			this.previewCanvas,
			{
				type: this.newChart.type,
				data: {
					labels: this.newChart.labels,
					datasets: [{
						// label: '# of Votes',
						data: this.newChart.data,
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