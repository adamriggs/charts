
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
 * - + new chart button
 * - - delete chart option
 * - - CRUID complete
 * - - edit labels and add title
 * - - improve the chart list too
 * - edit chart labels
 * - multidimensional data
 * - try catch's around everthing to report errors to the user using dialog boxes
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
	displayChartData = this.newChart();
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
		this.newBtn = document.querySelector('.chart-editor__new');
		this.saveBtn = document.querySelector('.chart-editor__controls__save');
		this.exitBtn = document.querySelector('.chart-editor__controls__exit');
		this.previewCanvas = document.querySelector('.chart-editor__preview canvas');
	}

	initChartTypes() {
		chartTypes.forEach(chart => {
			const li = document.createElement('li');
			const btn = document.createElement('button');
			btn.classList.add('chart-editor__select');
			btn.classList.add('chart-editor__select__' + chart);
			btn.dataset.chartType = chart;

			const div = document.createElement('div');
			div.classList.add('inner-button');
			div.textContent = chart;

			btn.appendChild(div);
			li.appendChild(btn);
			this.selectChartList.appendChild(li);
			this.chartButtons.push(btn);
		});
	}

	setChartType(type) {
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
				console.log(event.target);
				this.setChartType(event.target.closest('.chart-editor__select').dataset.chartType);
			});
		})

		this.data.addEventListener('input', (event) => {
			this.dataUpdate(event.target.value);
		});

		this.newBtn.addEventListener('click', (() => {
			this.displayChartData = this.newChart();
			// console.log('this.displayChartData:', this.displayChartData);

			this.drawChart();
		}));

		this.saveBtn.addEventListener('click', (() => {
			this.saveChart();
		}));
	}

	newChart() {
		const newChart = {
			type: '',
			data: [],
			labels: [],
			id: crypto.randomUUID(),
		};

		if (this.data) {
			this.data.textContent = '';
		}

		if (this.chartButtons && this.chartButtons.length >= 0) {
			this.chartButtons.forEach(btn => {
				btn.classList.remove('selected');
			})
		}

		return newChart;
	}

	saveChart() {
		const savedChart = this.getSavedChart(this.displayChartData.id);
		if (savedChart === null) {
			this.savedCharts.push(this.displayChartData);
		} else {
			this.savedCharts.forEach(chart => {
				if (chart.id === this.displayChartData.id) {
					chart = this.displayChartData;
				}
			})
		}
		
		localStorage.setItem('savedCharts', JSON.stringify(this.savedCharts));

		this.loadSavedCharts();
	}

	loadSavedCharts() {
		console.log('loadSavedCharts()');
		this.savedCharts = JSON.parse(localStorage.getItem('savedCharts')) || [];

		if (this.savedCharts.length > -1) {
			this.savedChartsElem.textContent = '';

			this.savedCharts.forEach((chart, i)=> {
				const li = document.createElement('li');

				const btn = document.createElement('button');
				btn.classList.add('saved-chart');
				btn.dataset.chartId = chart.id;

				const div = document.createElement('div');
				div.classList.add('inner-button');

				const title = document.createElement('span');
				title.classList.add('inner-button__title');
				title.textContent = chart.type;

				const preview = document.createElement('span');
				preview.classList.add('inner-button__preview');

				const deleteBtn = document.createElement('button');
				deleteBtn.classList.add('inner-button__delete');
				deleteBtn.textContent = 'Delete';

				div.appendChild(title);
				div.appendChild(preview);
				div.appendChild(deleteBtn);
				btn.appendChild(div);
				li.appendChild(btn);

				btn.addEventListener('click', (event) => {
					this.loadChart(event.target.closest('.saved-chart').dataset.chartId);
				});

				deleteBtn.addEventListener('click', (event) => {
					event.preventDefault();
					event.stopPropagation();
					this.deleteChart(event);
				})

				this.savedChartsElem.appendChild(li);
			})
		}
	}

	loadChart(id) {
		const displayChartData = this.getSavedChart(id);
		// console.log(displayChartData);
		this.displayChartData = displayChartData;

		this.data.textContent = displayChartData.data.join(', ');
		this.setChartType(displayChartData.type);
	}

	deleteChart(event) {
		console.log('deleteChart()');
		const deleteElem = event.target.closest('.saved-chart');
		const deleteId = deleteElem.dataset.chartId;
		console.log(deleteId);

		this.savedCharts.forEach((chart, i) => {
			let found = -1;

			console.log('deleteId:', deleteId);
			console.log('chart.id:', chart.id);
			console.log('*****');
			if (chart.id === deleteId) {
				found = i;
			}

			if (found !== -1) {
				this.savedCharts.splice(found, 1);
				localStorage.setItem('savedCharts', JSON.stringify(this.savedCharts));
			}
		})
		this.loadSavedCharts();

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
		// console.log('drawChart()');

		if (!this.displayChartData || 
			this.displayChartData.data === null ||
			this.displayChartData.type === '' ||
			this.displayChartData.data.length <=0
		) {
			console.log('no chart data');
			if (this.displayChartObject) {
				console.log('no display chart object');
				this.displayChartObject.destroy();
			}
			
			console.log(this.previewCanvas);

			if (this.previewCanvas) {
				console.log('display preview canvas exists');
				console.log('this.previewCanvas:', this.previewCanvas);
				// this.previewCanvas.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
			}
			console.log('*****');

			return;
		}

		if (this.displayChartObject) { this.displayChartObject.destroy(); }

		console.log('this.displayChartData:', this.displayChartData);
		console.log(this.previewCanvas);
		console.log('*****');

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