
const App = {

	init: function() {
		Container.init();
	},

	setFilter: function() {

		let criteria = {
			'chapter': ['1', '2', '3'],
			'category': ['V1', 'V2', 'Na-adj']
		};

		FilterCriteria.set(criteria);
		
		Container.applyFilter();
	}

};


const Container = {
	
	_container_all: [],
	_container_filtered: [],

	init: function() {
		this._container = structuredClone(all_vocabulary);
		this._container_filtered = structuredClone(all_vocabulary);
	},

	getAll: function() {
		return this._container;
	},

	getFiltered: function() {
		return this._container_filtered; 
	},

	applyFilter: function() {
		this._container_filtered = [];

		for (let i = 0; i < this._container.length; i++) {
			if (FilterCriteria.pass(this._container[i])) {
				this._container_filtered.push(this._container[i]);
			}
		}
	},

	getRandom: function() {
		let random_index = Math.floor(Math.random() * this._container_filtered.length);
		return this._container_filtered[random_index];
	}

};


const FilterCriteria = {

	_criteria: {},

	set: function(criteria) {
		this._criteria = criteria;
	},

	pass: function(item) {
		return this._criteria.chapter.includes(item.chapter) && this._criteria.category.includes(item.category); 
	}
}



$(document).ready(function() {
	App.init();
})