
import { data as chapter_1 } from "./chapters/js/1.js"
import { data as chapter_2 } from "./chapters/js/2.js"
import { data as chapter_3 } from "./chapters/js/3.js"
import { data as chapter_4 } from "./chapters/js/4.js"
import { data as chapter_5 } from "./chapters/js/5.js"
import { data as chapter_6 } from "./chapters/js/6.js"
import { data as chapter_7 } from "./chapters/js/7.js"
import { data as chapter_8 } from "./chapters/js/8.js"
import { data as chapter_9 } from "./chapters/js/9.js"
import { data as chapter_10 } from "./chapters/js/10.js"
import { data as chapter_11 } from "./chapters/js/11.js"
import { data as chapter_12 } from "./chapters/js/12.js"
import { data as chapter_13 } from "./chapters/js/13.js"
import { data as chapter_14 } from "./chapters/js/14.js"

export const kanji_importer = {

	get: function() {

		const total_chapters = 1000;
		let all_words = [];

		for (let i = 1; i <= total_chapters; i++) {

			let chapter = 'chapter_' + i;

			let chapterWords = eval("typeof("+chapter+")") === 'undefined' ? false : eval(chapter);

			if (!chapterWords) continue;

			let chapter_words = extractAndPack(chapterWords, i);

			for (let j = 0; j < chapter_words.length; j++) {
				all_words.push(chapter_words[j]);
			}
		}

		return all_words;
	}

}

function extractAndPack(str, chapter) {

	var packet = [];
	var list = str.split("\n");

	for (let i = 0; i < list.length; i++) {
		var data = list[i].split(":");
		var jap = data[1].split("_");

		packet.push({
			eng: data[0].trim(),
			kanji: jap[0].trim(),
			hiragana: jap[1].trim(),
			chapter: chapter,
		});
	}

	return packet;
}