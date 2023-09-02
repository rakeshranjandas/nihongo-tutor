
export const vocabulary_importer = {

	get: function() {

		const total_chapters = 1;
		let all_words = [];

		for (let i = 1; i <= total_chapters; i++) {
			all_words.push(extractAndPack(eval('chapter_' + i), i))
		}

		return all_words;
	}

}

function extractAndPack(str, chapter) {

	var packet = [];
	var list = str.split("\n");

	for (let i = 0; i < list.length; i++) {
		var data = list[i].split("_");

		packet.push({
			romaji: data[0].trim(),
			kanji: data[1].trim(),
			meaning: data[2].trim(),
			chapter: chapter,
			category: '',
		});
	}

	return packet;
}