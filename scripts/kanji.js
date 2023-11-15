	
const App = {

	_asked_word: null,

	init: function() {
		Container.init();
		
		this._renderToggleLangButton();

		SavedWords.init();
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

	ask: function() {

		this._setWordInView(Container.getRandom());

	},

	showWord: function(index) {

		this._setWordInView(Container.getWord(index));

	},

	_setWordInView: function(word) {
		
		this._asked_word = word;

		CardView.setWord(word);
		CardView.showQuestion();

		$('#get_random_button').hide();
		$('#verify_meaning_button').show();
		
		$('#save_button').show();

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
		$('#toggle_lang_button').text(AppView.get().desc).show();
	},

	toggleView: function() {
		AppView.toggle();

		this.ask();

		Chart.update();

		SavedWords.update();

		this._renderToggleLangButton();
	},

	saveWord: function() {
		SavedWords.save(this._asked_word);
		
		$('#save_button').hide();
	},

	showSaved: function() {
		SavedWords.show();

		$('#show_saved_button').hide();
		$('#hide_saved_button').show();
	},

	hideSaved: function() {
		SavedWords.hide();

		$('#show_saved_button').show();
		$('#hide_saved_button').hide();
	}

};

const AppView = {

	_view_list: [

		// English to Japanese
		{
			'desc': 'Eng -> Jap',
			'ask_by_field': 'eng',
			'show_field_1': { 
				'label': 'kanji',
				'key': 'kanji'
			}
		},

		// Japanese to English
		{
			'desc': 'Jap -> Eng',
			'ask_by_field': 'kanji',
			'show_field_1': {
				'label': 'english',
				'key': 'eng'
			}
		}

	],

	_view_index: 1, 	// Default view is Jap -> Eng

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
		this._container_all = structuredClone(all_kanji);
		this._container_filtered = structuredClone(all_kanji);

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
	},

	getWord: function(index) {

		return this._container_filtered[index];

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

	DECAY_RATE = 0.01;

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

		this._items.forEach(function(item,index) {
			html += '<p class="'+ (item.seen?"chartItemSeen":"") + '" ' 
				+ 'title="' + item[AppView.get().show_field_1.key] +'"'
				+'onclick="App.showWord('+ index +')">'
				+ item[AppView.get().ask_by_field] + '<p>';
		});

		$(this._chart_div_id_selector).html(html);

	}
};

const SavedWords = {

	_saved: [],
	_saved_div_selector: '#saved',

	init: function() {
		this._render();
	},

	_render: function() {

		let html = '';

		let total = this._saved.length;

		html += '<header> Total: ' + total + '</header>'; 
		html += '<header> &nbsp; </header>'; 

		for (let i = 0; i < this._saved.length; i++) {

			let item = this._saved[i];

			html += '<p title="' + item[AppView.get().show_field_1.key] +'">'
				+ '<span class="removeSavedSpan" onclick="SavedWords.delete(' + i + ')">x</span>'
				+ item[AppView.get().ask_by_field] + '<p>';

		}

		$(this._saved_div_selector).html(html);

	},

	update: function() {
		this._render();
	},

	save: function(wordObj) {
		for (let i = 0; i < this._saved.length; i++) {
			if (JSON.stringify(this._saved[i]) === JSON.stringify(wordObj))
				return;
		}

		this._saved.push(wordObj);
		this._render();
	},

	delete: function(index) {
		this._saved.splice(index, 1);
		this._render();
	},

	show: function() {
		$(this._saved_div_selector).show();
	},

	hide: function() {
		$(this._saved_div_selector).hide();
	}

}

const FilterCriteria = {

	_criteria: {},

	set: function(criteria) {
		this._criteria = criteria;
	},

	pass: function(item) {

		return this._criteria.chapter.includes(item.chapter.toString().toLowerCase()); 
	}
};


const CardView = {

	_word: {},
	
	setWord: function(word) {
		this._word = word;
	},

	showQuestion: function() {
		$('#view_meaning_1, #view_meaning_2, #view_chapter').html('');
		$('#view_random').text(this._word[AppView.get().ask_by_field]);
	},

	showAnswer: function() {
		
		this._showFirstField();

		$('#view_meaning_2').html("Hiragana: <span class=\"viewAnswer\" >" + this._word.hiragana + "</span>");
		$('#view_chapter').html("chapter: <span class=\"viewAnswer\">" + this._word.chapter + "</span>");
	},

	_showFirstField: function() {
		$('#view_meaning_1').html(
			AppView.get().show_field_1.label
			+ ": <span class=\"viewAnswerKanji\">" 
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