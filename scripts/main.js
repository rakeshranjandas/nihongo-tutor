const max_word_len = 5;

var randomCharList = [];

function showRandowWord() {

	generateRandomCharList();

	showRandomWordInView(constructWord());
	populateChart();

	hideSoundText();
	hideGetRandomButton();
	showVerifySoundButton();
}

function generateRandomCharList() {

	var char_set = getCharSet();
	var word_length = getRandomWithin(Math.min(max_word_len, char_set.length)) + 1;

	clearList(randomCharList);

	for (let i = 0; i < word_length; i++) {
		var randomIndex = getRandomWithin(char_set.length);
		randomCharList.push(char_set[randomIndex]);
	}
}

function clearList(arr) {
	while(arr.length > 0) arr.pop();
}

function getRandomWithin(max_len) {
	return Math.floor(Math.random() * max_len);
}

function getCharSet() {
	return kana_set;
	// return dummySet();
}

function dummySet() {

	return [
		{
			'char': "a",
			'desc': "aa",
			'sound': 'a sound'
		},

		{
			'char': "b",
			'desc': "bb",
			'sound': 'b sound'
		},

		{
			'char': "c",
			'desc': "c",
			'sound': 'c sound'
		},

		{
			'char': "d",
			'desc': "dd",
			'sound': 'd sound'
		}
	]
}

function constructWord() {
	var word = "";

	for (let i = 0; i < randomCharList.length; i++) {
		word += randomCharList[i].char + " ";
	}

	return word.trim();
}

function showRandomWordInView(word) {
	$("#view_random").text(word);
}

function hideSoundText() {
	$("#view_sound").text(" ");
}

function showGetRandomButton() {
	$("#get_random_button").show();
}

function hideGetRandomButton() {
	$("#get_random_button").hide();
}

function showVerifySoundButton() {
	$("#verify_sound_button").show();
}

function hideVerifySoundButton() {
	$("#verify_sound_button").hide();
}

function verifySound() {
	showSoundText();

	hideVerifySoundButton();
	showGetRandomButton();
}
	

function showSoundText() {
	setSoundTextInView(constructSoundText());
}

function constructSoundText() {
	var sound = "";

	for (let i = 0; i < randomCharList.length; i++) {
		sound += randomCharList[i].sound + "  ";
	}

	return sound.trim();
}

function setSoundTextInView(voice) {
	$("#view_sound").text(voice);
}

function populateChart() {
	setChartContent(constructChartContent());
}

function constructChartContent() {
	var char_set = getCharSet();
	var html_content = "";

	for (let i = 0; i < char_set.length; i++) {
		html_content += `<p><span><b>${char_set[i].char}</b>&nbsp;&nbsp;&nbsp;<i>${char_set[i].sound}</i></span></p>`;
	}

	return html_content;
}

function setChartContent(html_content) {
	$("#kana_chart").html(html_content);
}

function toggleChart() {
	$("#kana_chart").toggle();
	$("#show_kana").text($("#kana_chart").is(":visible") ? "Hide Kana": "Show Kana");
}

$(document).ready(function() {
	showRandowWord();
})