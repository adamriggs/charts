// import './js/test.ts';
import './js/app';


/**
 * baby steps make a chart creation and edititing tool
 * 
 * Start
 * 1. If there are no saved charts then show a chart selection tool and begin the creation
 * 2. if there are saved charts then show the list
 * 
 * UI Stuff
 * 
 * Chart Creation Tool
 * 1. Grid of chart types - select one
 * 2. Enter in data
 * 3. See/Save chart
 * Implementation
 * 4. Make a web UI with type tiles, data entry, and chart view all on one page at first
 * 		a. This will make state management simpler
 * 		b. Save button
 * 		c. Exit editor to main list button
 * 5. Chart updates in real time as data is entered
 * 
 * Chart list
 * 1. Row view - name, type, etc..
 * 2. Sort by name or date
 * Implementation
 * 3. List rows of titles and types
 * 4. Clicking on a row enters the editor for that chart
 * 
 * Data Stuff
 * 1. Saved charts are a JSON object
 * 2. For now just type and data
 * 
 */