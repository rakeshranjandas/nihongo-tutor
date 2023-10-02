
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
import { data as chapter_15 } from "./chapters/js/15.js"
import { data as chapter_16 } from "./chapters/js/16.js"
import { data as chapter_17 } from "./chapters/js/17.js"
import { data as chapter_18 } from "./chapters/js/18.js"
import { data as chapter_19 } from "./chapters/js/19.js"
import { data as chapter_20 } from "./chapters/js/20.js"
import { data as chapter_21 } from "./chapters/js/21.js"
import { data as chapter_22 } from "./chapters/js/22.js"
import { data as chapter_23 } from "./chapters/js/23.js"
import { data as chapter_24 } from "./chapters/js/24.js"
import { data as chapter_25 } from "./chapters/js/25.js"
import { data as chapter_26 } from "./chapters/js/26.js"
import { data as chapter_27 } from "./chapters/js/27.js"
import { data as chapter_28 } from "./chapters/js/28.js"
import { data as chapter_29 } from "./chapters/js/29.js"
import { data as chapter_30 } from "./chapters/js/30.js"
import { data as chapter_31 } from "./chapters/js/31.js"
import { data as chapter_32 } from "./chapters/js/32.js"
import { data as chapter_33 } from "./chapters/js/33.js"
import { data as chapter_34 } from "./chapters/js/34.js"
import { data as chapter_35 } from "./chapters/js/35.js"
import { data as chapter_36 } from "./chapters/js/36.js"
import { data as chapter_37 } from "./chapters/js/37.js"

export const vocabulary_importer = {

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
		var data = list[i].split("_");

		packet.push({
			romaji: data[0].trim(),
			kanji: data[1].trim(),
			meaning: data[2].trim(),
			chapter: chapter,
			category: data[3] ? data[3].trim() : '',
		});
	}

	return packet;
}