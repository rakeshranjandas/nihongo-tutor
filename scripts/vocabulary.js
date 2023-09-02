
const App = {

	init: function() {
		Container.init();
	},

	filter: function() {
		FilterCriteria.set(this.getFilterCriteria());
		Container.applyFilter();

		$('#filter_results_size').text(Container.getFiltered().length + " words");

		this.ask();
	},

	getFilterCriteria: function() {
		return {
			chapter: this.getChapterFilterCriteria(),
			category: this.getCategoryFilterCriteria(),
		}
	},

	getChapterFilterCriteria: function() {

		let allowed = []

		let input_low = parseInt($('#filter_chapter_from').val());
		let input_high = parseInt($('#filter_chapter_to').val());

		let low = Math.max(0, isNaN(input_low) ? 0: input_low);
		let high = Math.min(1000, isNaN(input_high) ? 1000: input_high);

		for (let i = low; i <= high; i++) allowed.push(""+i);

		return allowed;
	},

	getCategoryFilterCriteria: function() {
		
		let allowed = [];

		$('.filterCategoryCheckbox:checked').each(function() {
			allowed.push($(this).data('value'));
		})

		if ($('.filterCategoryAllCheckbox').is(':checked')) {
			allowed.push("");
		}

		return allowed;
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
	},

	showFilter: function() {
		$('#filter_div').show();
		$('#show_filter_button').hide();
		$('#hide_filter_button').show();
	},

	hideFilter: function() {
		$('#filter_div').hide();
		$('#show_filter_button').show();
		$('#hide_filter_button').hide();
	},

	categoryAllAction: function(tis) {
		if (tis.checked) {
			$('.filterCategoryCheckbox').prop('checked', true);
		
		} else {
			$('.filterCategoryCheckbox').prop('checked', false);
		}
	},

	categoryAction: function(tis) {
		
		if (!tis.checked) {
			$('.filterCategoryAllCheckbox').prop('checked', false);
			return;
		}

		this.allCheckboxCheck();
	},

	allCheckboxCheck: function() {

		if ($('.filterCategoryCheckbox:checked').length === $('.filterCategoryCheckbox').length) {
			$('.filterCategoryAllCheckbox').prop('checked', true);
		}
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

		if (!item.category) item.category = "";

		return this._criteria.chapter.includes(item.chapter.toString().toLowerCase()) 
			&& this._criteria.category.includes(item.category.toLowerCase()); 
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
		$('#view_meaning, #view_chapter, #view_category').html('');
		$('#view_random').text(this._word[this._view.ask_by_field]);
	},

	showAnswer: function() {
		$('#view_meaning').html("meaning: <b>" + this._word.meaning + "</b>");
		$('#view_chapter').html("chapter: <b>" + this._word.chapter + "</b>");
		$('#view_category').html("category: <b>" + (this._word.category ?? "" )+ "</b>");
	}
}



$(document).ready(function() {
	App.init();

	App.ask();
})