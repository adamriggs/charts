
/**
 * big time UI stuff here
 * 
 * two main screens: chart list, and chart edit
 */

/**
 * I need more UI elements to add code to before I can get farther with the code
 * just concentrate on the cart creation first
 * + better UI and flow
 * - + new chart button
 * - + delete chart option
 * - + CRUID complete
 * - + edit title
 * - + edit labels
 * - + New/Save chart is broken 
 * - + edit panel slide out
 * - multidimensional data
 * - + labels autogenerate based on data
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
	savedDataName = 'savedCharts';
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
		this.savedChartsElem = document.querySelector('.chart-plugin__saved-charts ul');
		this.selectChartList = document.querySelector('.chart-plugin__editor__type ul');
		this.dataInput = document.querySelector('.chart-plugin__editor__data__input');
		this.editor = document.querySelector('.chart-plugin__editor');
		this.newBtn = document.querySelector('.chart__new');
		this.saveBtn = document.querySelector('.chart-plugin__editor__controls--save');
		this.closeBtn = document.querySelector('.chart-plugin__editor__controls--close');
		this.openBtn = document.querySelector('.chart-plugin__editor__controls--open');

		this.previewTitle = document.querySelector('.chart-plugin__preview__title');
		this.previewCanvas = document.querySelector('.chart-plugin__preview canvas');

		this.titleInput = document.querySelector('.chart-plugin__editor__text__title input');
		this.labelInputContainer = document.querySelector('.chart-plugin__editor__text__labels ul');
	}

	initChartTypes() {
		chartTypes.forEach(chart => {
			const li = document.createElement('li');
			const btn = document.createElement('button');
			btn.classList.add('chart-plugin__editor__type');
			btn.classList.add('chart-plugin__editor__type__' + chart);
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
				this.setPreviewChartType(event.target.closest('.chart-plugin__editor__type').dataset.chartType);
			});
		})

		this.dataInput.addEventListener('input', event => {
			this.onDataInputUpdate(event.target.value);
		});

		this.newBtn.addEventListener('click', () => {
			console.log('savedCharts:', this.savedCharts);
			console.log('previewChartData:', this.previewChartData);
			this.previewChartData = { ...this.newChart() };
			console.log('previewChartData:', this.previewChartData);
			console.log('*****');
			this.drawPreviewChart();
		});

		this.saveBtn.addEventListener('click', () => {
			this.savePreviewChart();
		});

		this.closeBtn.addEventListener('click', () => {
			this.onToggleEditor();
		});

		this.openBtn.addEventListener('click', () => {
			this.onToggleEditor();
		});

		this.titleInput.addEventListener('input', event => {
			this.onTitleInputUpdate(event);
		});
	}

	newChart() {
		// console.log('newChart()');
		const newChart = {
			type: '',
			data: [],
			labels: [],
			id: crypto.randomUUID(),
			title: 'New Chart'
		};

		if (this.editor) {
			this.dataInput.value = '';
			this.editor.classList.remove('closed');

			this.chartButtons.forEach(btn => {
				btn.classList.remove('active');
			})

			this.titleInput.value = newChart.title;
			this.previewTitle.textContent = newChart.title;
		}

		return { ...newChart };
	}

	saveData(name, data) {
		localStorage.setItem(name, data);
	}

	loadSavedCharts() {
		// console.log('loadSavedCharts()');
		this.savedCharts = JSON.parse(localStorage.getItem(this.savedDataName)) || [];

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
		let returnChart = {};
		this.savedCharts.forEach(chart => {
			if (chart.id === id) {
				returnChart = { ...chart };
			}
		});
		return returnChart;
	}

	deleteSavedChart(id) {
		this.savedCharts.forEach((chart, i) => {
			if (chart.id === id) {
				this.savedCharts.splice(i, 1);
				this.saveData(this.savedDataName, JSON.stringify(this.savedCharts));
			}
		})
		this.loadSavedCharts();
	}

	savePreviewChart() {
		// remove chart from saved charts array if it exists
		this.savedCharts.forEach((chart, i) => {
			if (chart.id === this.previewChartData.id) {
				console.log('chart in array - splicing is going to occur');
				this.savedCharts.splice(i, 1);
			} else {
				console.log('chart not yet saved - no array splicing');
			}
		});

		// handle labels
		const newLabels = [];
		const newLabelInputs = Array.from(this.labelInputContainer.querySelectorAll('li input'));
		newLabelInputs.forEach(labelInput => {
			newLabels.push(labelInput.value);
		});
		this.previewChartData.labels = [...newLabels];

		// put the new/updated chart at the front of the array, save the array and reload, and close the editor
		this.savedCharts.unshift(this.previewChartData);
		this.saveData(this.savedDataName, JSON.stringify(this.savedCharts));
		this.loadSavedCharts();
		// this.onToggleEditor();
	}

	setPreviewChart(id) {
		// console.log('setPreviewChart()');
		this.previewChartData = { ...this.getSavedChart(id) };

		this.dataInput.value = this.previewChartData.data.join(', ');
		this.titleInput.value = this.previewChartData.title;
		this.previewTitle.textContent = this.previewChartData.title;
		this.setPreviewChartType(this.previewChartData.type);

		const labels = this.previewChartData.labels;
		const data = this.previewChartData.data;

		this.labelInputContainer.textContent = '';	// clear previous labels

		data.forEach((data, i) => {
			if (labels[i]) {
				this.labelInputContainer.appendChild(this.createLabel(labels[i], labels[i]));
			} else {
				this.labelInputContainer.appendChild(this.createLabel('No Label', data));
				this.previewChartData.labels.push(data);
			}
		});
	}

	createLabel(placeholder, value) {
		const li = document.createElement('li');

		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = placeholder;
		input.value = value;

		const addBtn = document.createElement('button');
		addBtn.textContent = '+';
		addBtn.classList.add('chart-plugin__editor--add-label');
		addBtn.addEventListener('click', (event) => { this.addLabel(event); });

		const removeBtn = document.createElement('button');
		removeBtn.textContent = '-';
		removeBtn.classList.add('chart-plugin__editor--remove-label');
		removeBtn.addEventListener('click', (event) => { this.removeLabel(event); });

		li.appendChild(input);
		li.appendChild(addBtn);
		li.appendChild(removeBtn);

		return li
	}

	addLabel(event) {
		const parentElem = event.target.closest('li');
		parentElem.after(this.createLabel('New Label', ''));
	}

	removeLabel(event) {
		console.log('remove label');
		console.log(event.target);

		const parentElem = event.target.closest('li');
		parentElem.remove();
	}

	setPreviewChartType(type) {
		this.chartButtons.forEach(btn => {
			btn.classList.remove('active');

			if (type === btn.dataset.chartType) {
				btn.classList.add('active');
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
		console.log('drawPreviewChart()');
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
						label: 'All Data',
						data: this.previewChartData.data,
					}]
				},
			}
		);

		// console.log(this.previewChart);
		// console.log(this.previewChartData.data);
	}

	onDataInputUpdate() {
		this.previewChartData.data = Array.from(this.dataInput.value.split(',').map(n => parseInt(n.trim(), 10)));
		// this.previewChartData.data = JSON.parse(this.dataInput.value);
		// this.previewChartData.data = this.dataInput.value;

		if (this.previewChartData.type !== '') {
			this.drawPreviewChart();
		}
	}

	onTitleInputUpdate(event) {
		this.previewChartData.title = event.target.value;
		this.previewTitle.textContent = event.target.value;
	}

	onToggleEditor() {
		this.editor.classList.toggle('closed');
	}
}