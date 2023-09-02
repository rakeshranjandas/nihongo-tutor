
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
	},

	ask: function() {
		let word = Container.getRandom();

		CardView.setWord(word);
		CardView.showQuestion();

		$('#get_random_button').hide();
		$('#verify_meaning_button').show();
	},

	answer: function() {
		CardView.showAnswer();

		$('#get_random_button').show();
		$('#verify_meaning_button').hide();
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


const CardView = {

	_word: {},
	_view: { 'ask_by_field': 'romaji' },

	setWord: function(word) {
		this._word = word;
	},

	setView: function(view) {
		this._view = view;
	},

	showQuestion: function() {
		$('#view_meaning').text('');
		$('#view_random').text(this._word[this._view.ask_by_field]);
	},

	showAnswer: function() {
		$('#view_meaning').text(JSON.stringify(this._word));
	}
}



$(document).ready(function() {
	App.init();

	App.ask();
})