import { hiragana } from "./hiragana.js"
import { katakana } from "./katakana.js"


export const kana_importer = {

	hiragana: function() {
		return extractAndPack(hiragana);
	},

	katakana: function() {
		return extractAndPack(katakana);
	}
}

function extractAndPack(str) {

	var packet = [];
	var list = str.split("\n");

	for (let i = 0; i < list.length; i++) {
		var data = list[i].split(",");

		packet.push({
			char: data[0],
			desc: data[1],
			sound: data[2]
		});
	}

	return packet;
}