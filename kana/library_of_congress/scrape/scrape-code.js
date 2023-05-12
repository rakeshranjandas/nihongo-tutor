

/* 
	Scrape chararacters from site - https://loc.gov/marc/specifications/specchareacc/JapaneseHiraganaKatakana.html

	Script - paste-run in the console


		var table = document.getElementsByTagName("table")[0]

		var rows = table.getElementsByTagName("tr")

		var output = "";

		for (let i = 0; i < rows.length; i++) {
		    var row = rows[i];
		    var cols = row.getElementsByTagName("td");
		    if (!cols[3]) continue;
		    
		    var jchar = cols[3].innerText;
		    var jdesc = cols[4].innerText;
		    var jsound = jdesc.split(" ").slice(-1)[0];

		    output += jchar + "," + jsound + "," + jdesc + "\n";
		}

		console.log(output);

*/