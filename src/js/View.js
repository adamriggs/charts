
/**
 * big time UI stuff here
 * 
 * two main screens: chart list, and chart edit
 */

/**
 * I need more UI elements to add code to before I can get farther with the code
 * just concentrate on the cart creation first
 * - better UI and flow
 * - + new chart button
 * - + delete chart option
 * - + CRUID complete
 * - + edit title
 * - - edit labels
 * - multidimensional data
 * - try catch's around everthing to report errors to the user using dialog boxes
 * + save and list charts - save to local storage for now
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
	previewChartData = this.newChart();
	previewChart;
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
		this.dataInput = document.querySelector('.chart-editor__data__input');
		this.newBtn = document.querySelector('.chart-editor__new');
		this.saveBtn = document.querySelector('.chart-editor__controls__save');
		this.previewCanvas = document.querySelector('.chart-editor__preview canvas');

		this.titleInput = document.querySelector('.chart-editor__controls__title input');
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

	initListeners() {
		this.chartButtons.forEach(btn => {
			btn.addEventListener('click', event => {
				this.setPreviewChartType(event.target.closest('.chart-editor__select').dataset.chartType);
			});
		})

		this.dataInput.addEventListener('input', event => {
			this.onDataInputUpdate(event.target.value);
		});

		this.newBtn.addEventListener('click', () => {
			this.previewChartData = this.newChart();
			this.drawPreviewChart();
		});

		this.saveBtn.addEventListener('click', () => {
			this.savePreviewChart();
		});

		this.titleInput.addEventListener('input', event => {
			this.onTitleInputUpdate(event);
		});
	}

	newChart() {
		const newChart = {
			type: '',
			data: [],
			labels: [],
			id: crypto.randomUUID(),
		};

		if (this.dataInput) {
			this.dataInput.textContent = '';
		}

		if (this.chartButtons && this.chartButtons.length >= 0) {
			this.chartButtons.forEach(btn => {
				btn.classList.remove('selected');
			})
		}

		return newChart;
	}

	loadSavedCharts() {
		// console.log('loadSavedCharts()');
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
				title.textContent = chart.title;

				const type = document.createElement('span');
				type.classList.add('inner-button__type');
				type.textContent = chart.type;

				const preview = document.createElement('span');
				preview.classList.add('inner-button__preview');

				// render chart here
				// const canvas = document.createElement('canvas');

				const deleteBtn = document.createElement('button');
				deleteBtn.classList.add('inner-button__delete');
				deleteBtn.textContent = 'Delete';

				div.appendChild(title);
				div.appendChild(type);
				div.appendChild(preview);
				div.appendChild(deleteBtn);
				btn.appendChild(div);
				li.appendChild(btn);

				btn.addEventListener('click', (event) => {
					this.setPreviewChart(event.target.closest('.saved-chart').dataset.chartId);
				});

				deleteBtn.addEventListener('click', (event) => {
					event.preventDefault();
					event.stopPropagation();
					const deleteElem = event.target.closest('.saved-chart');
					this.deleteSavedChart(deleteElem.dataset.chartId);
				})

				this.savedChartsElem.appendChild(li);
			})
		}

		if (this.savedCharts.length > -1) {
			this.setPreviewChart(this.savedCharts[0].id);
		}
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

	deleteSavedChart(id) {
		// console.log('deleteSavedChart()');
		// console.log(id);

		this.savedCharts.forEach((chart, i) => {
			if (chart.id === id) {
				this.savedCharts.splice(i, 1);
				localStorage.setItem('savedCharts', JSON.stringify(this.savedCharts));
			}
		})
		this.loadSavedCharts();

	}

	savePreviewChart() {
		// console.log('savePreviewChart()');
		const savedChart = this.getSavedChart(this.previewChartData.id);
		// console.log('savedChart', savedChart);
		if (savedChart === null) {
			this.savedCharts.push(this.previewChartData);
		} else {
			let spliceNumber = -1;
			this.savedCharts.forEach((chart, i) => {
				if (chart.id === this.previewChartData.id) {
					// console.log('saving chart...');
					chart = { ...this.previewChartData };
					// console.log('chart:', chart);
					// console.log('this.previewChartData:', this.previewChartData);

					spliceNumber = i;
				}
			})

			this.savedCharts.splice(spliceNumber, 1);
			this.savedCharts.push(this.previewChartData);
		}

		// console.log(this.savedCharts);
		// console.log('*****');

		localStorage.setItem('savedCharts', JSON.stringify(this.savedCharts));

		this.loadSavedCharts();
	}

	setPreviewChart(id) {
		// console.log('setPreviewChart()');
		// console.log(id);
		// console.log('*****');
		const previewChartData = this.getSavedChart(id);
		this.previewChartData = { ...previewChartData };

		this.dataInput.textContent = previewChartData.data.join(', ');
		this.setPreviewChartType(previewChartData.type);

		this.titleInput.value = previewChartData.title;
	}

	setPreviewChartType(type) {
		this.chartButtons.forEach(btn => {
			btn.classList.remove('selected');

			if (type === btn.dataset.chartType) {
				btn.classList.add('selected');
			}
		})
		
		this.previewChartData.type = type;

		if (this.dataInput.value !== '') {
			this.onDataInputUpdate();
		}

		if (this.previewChartData.data !== null || this.previewChartData.data.length !== -1) {
			this.drawPreviewChart();
		}
	}

	drawPreviewChart() {
		// console.log('drawPreviewChart()');

		if (!this.previewChartData || 
			this.previewChartData.data === null ||
			this.previewChartData.type === '' ||
			this.previewChartData.data.length <=0
		) {
			if (this.previewChart) {
				this.previewChart.destroy();
			}
			
			return;
		}

		if (this.previewChart) { this.previewChart.destroy(); }

		this.previewChart = new Chart(
			this.previewCanvas,
			{
				type: this.previewChartData.type,
				data: {
					labels: this.previewChartData.labels,
					datasets: [{
						// label: '# of Votes',
						data: this.previewChartData.data,
					}]
				},
			});

	}

	onDataInputUpdate() {
		this.previewChartData.data = Array.from(this.dataInput.value.split(',').map(n => parseInt(n.trim(), 10)));
		this.previewChartData.labels = this.previewChartData.data;

		if (this.previewChartData.type !== '') {
			this.drawPreviewChart();
		}
	}

	onTitleInputUpdate(event) {
		this.previewChartData.title = event.target.value;
	}
}