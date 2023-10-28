	
const App = {

	init: function() {
		Container.init();
		this._renderToggleLangButton();
	},

	filter: function() {
		FilterCriteria.set(this.getFilterCriteria());
		Container.applyFilter();

		let countFiltered = Container.getFiltered().length;

		$('#filter_results_size').text(countFiltered + " words");
		
		if (countFiltered === 0) {
			alert('0 words');
			return;
		}

		this.ask();
		this.hideFilter();
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

		this.asked = true;
	},

	answer: function() {
		CardView.showAnswer();

		$('#get_random_button').show();
		$('#verify_meaning_button').hide();

		this.asked = false;
	},

	askOrAnswer: function() {
		if (this.asked) this.answer();
		else this.ask();
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
	},

	showChart: function() {
		$('#show_chart_button').hide();
		$('#hide_chart_button').show();

		Chart.show();
	},

	hideChart: function() {
		$('#show_chart_button').show();
		$('#hide_chart_button').hide();

		Chart.hide();
	},

	_renderToggleLangButton: function() {
		$('#toggle_lang_button').text(AppView.get().desc);
	},

	toggleView: function() {
		AppView.toggle();

		this.ask();

		Chart.update();

		this._renderToggleLangButton();
	}

};

const AppView = {

	_view_list: [

		// English to Japanese
		{
			'desc': 'Eng -> Jap',
			'ask_by_field': 'meaning',
			'show_field_1': { 
				'label': 'japanese',
				'key': 'romaji'
			}
		},

		// Japanese to English
		{
			'desc': 'Jap -> Eng',
			'ask_by_field': 'romaji',
			'show_field_1': {
				'label': 'english',
				'key': 'meaning'
			}
		}

	],

	_view_index: 0,

	toggle: function() {
		this._view_index = (this._view_index + 1) % 2;
	},

	get: function() {
		return this._view_list[this._view_index];
	}
}


const Container = {
	
	_container_all: [],
	_container_filtered: [],
	_position_randomizer: null,

	init: function() {
		this._container_all = structuredClone(all_vocabulary);
		this._container_filtered = structuredClone(all_vocabulary);

		this._initPositionRandomizer();
		this._initChart();
	},

	getAll: function() {
		return this._container_all;
	},

	getFiltered: function() {
		return this._container_filtered; 
	},

	applyFilter: function() {
		this._container_filtered = [];

		for (let i = 0; i < this._container_all.length; i++) {
			if (FilterCriteria.pass(this._container_all[i])) {
				this._container_filtered.push(this._container_all[i]);
			}
		}

		this._initPositionRandomizer();
		this._initChart();
	},

	_initPositionRandomizer: function() {
		// this._position_randomizer = new BasicRandomizer(this._container_filtered);
		this._position_randomizer = new WeightedRandomizer(this._container_filtered);
	},

	_initChart: function() {
		Chart.init(this._container_filtered);
	},

	getRandom: function() {

		if (this._container_filtered.length === 0)
			return false;

		let random_item = this._position_randomizer.randomize();
		random_item.seen = true;

		Chart.update();

		return random_item;
	}

};


class BasicRandomizer {
	constructor(items) {
		this.items = items;
	}

	randomize() {
		let random_index = Math.floor(Math.random() * this.items.length);
		return this.items[random_index];
	}
};


class WeightedRandomizer {

	DECAY_RATE = 0.8;

  	constructor(items) {
	    this.items = items;
	    this.probabilities = new Array(items.length).fill(1);
  	}

  	randomize() {
	    const totalProbability = this.probabilities.reduce((a, b) => a + b, 0);
	    const weightedProbabilities = this.probabilities.map(p => p / totalProbability);
	    
	    const randomValue = Math.random();
	    let cumulativeProbability = 0;
	    
	    for (let i = 0; i < weightedProbabilities.length; i++) {
		      cumulativeProbability += weightedProbabilities[i];
		      if (randomValue < cumulativeProbability) {
		        this.decreaseProbability(i);
		        return this.items[i];
		      }
	    }
	    
	    // Fallback to the last item in case of rounding errors
	    const lastIndex = this.items.length - 1;
	    this.decreaseProbability(lastIndex);
	    return this.items[lastIndex];
	  }

	  decreaseProbability(index) {
		// Decrease the probability of the chosen index
		this.probabilities[index] *= this.DECAY_RATE; // You can adjust this factor as needed
	  }
};


const Chart = {
	_chart_div_id_selector: '#chart',
	_items: [],

	init: function(items) {
		this._items = items;
		this._render();
	},

	show: function() {
		$(this._chart_div_id_selector).show();
	},

	hide: function() {
		$(this._chart_div_id_selector).hide();
	},

	update: function() {
		this._render();
	},

	_render: function() {

		let html = '';

		let total = this._items.length;
		let seen = this._items.filter((item) => item.seen === true ).length;

		html += '<header> Total: ' + total + '</header>'; 
		html += '<header> Seen: ' + seen + '</header>'; 

		this._items.forEach(function(item) {
			html += '<p class="'+ (item.seen?"chartItemSeen":"") 
				+ '" title="' + item[AppView.get().show_field_1.key] +'">' 
				+ item[AppView.get().ask_by_field] + '<p>';
		});

		$(this._chart_div_id_selector).html(html);

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
};


const CardView = {

	_word: {},
	
	setWord: function(word) {
		this._word = word;
	},

	showQuestion: function() {
		$('#view_meaning, #view_chapter, #view_category, #view_kanji').html('');
		$('#view_random').text(this._word[AppView.get().ask_by_field]);
	},

	showAnswer: function() {
		
		this._showFirstField();

		$('#view_kanji').html("kanji: <span class=\"viewAnswerKanji\">" + this._word.kanji + "</span>");
		$('#view_chapter').html("chapter: <span class=\"viewAnswer\">" + this._word.chapter + "</span>");
		$('#view_category').html("category: <span class=\"viewAnswer\">" + (this._word.category ?? "" )+ "</span>");
	},

	_showFirstField: function() {
		$('#view_meaning').html(
			AppView.get().show_field_1.label
			+ ": <span class=\"viewAnswer\">" 
			+ this._word[AppView.get().show_field_1.key] 
			+ "</span>"
		);
	}
};


function bindAskOrAnswerOnSpace() {

	$(document).on('keydown', function() {

		if (event.code !== "Space") return;

		event.preventDefault();

		App.askOrAnswer();

	})
}


$(document).ready(function() {
	App.init();

	App.ask();

	bindAskOrAnswerOnSpace();
})