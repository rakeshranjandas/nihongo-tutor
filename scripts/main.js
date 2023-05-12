var randomCharList = [];

function showRandowWord() {

	generateRandomCharList();

	showRandomWordInView(constructWord());
	setSoundText(constructSoundText());
}

function generateRandomCharList() {

	var char_set = getCharSet();
	var word_length = Math.max(1, getRandomWithin(Math.min(5, char_set.length)));

	clearList(randomCharList);

	for (let i = 0; i < word_length; i++) {
		var randomIndex = getRandomWithin(char_set.length);
		randomCharList.push(char_set[randomIndex]);
	}

	console.log("-------");

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
		word += randomCharList[i].char;
	}

	return word;
}

function showRandomWordInView(word) {
	$("#view").text(word);
}

function constructSoundText() {
	var sound = "";

	for (let i = 0; i < randomCharList.length; i++) {
		sound += randomCharList[i].sound + "  ";
	}

	return sound.trim();
}

function setSoundText(voice) {
	$("#view").attr("title", voice);
}

$(document).ready(function() {
	showRandowWord();
})