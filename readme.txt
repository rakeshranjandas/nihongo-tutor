

HOW TO ADD NEW VOCABULARY CHAPTER
----------------------------------

1) Add the list in "vocabulary/chapters/js/{chapter_number}.js"

	- The format of the list is as follows:

		a) hiragana_kanji_english_category

		b) category is optional, rest are mandatory

		c) category values are - v1, v2, v3, i, na


	- Export it as a const variable. Refer previous js files.


2) Import in "vocabulary/vocabulary_importer.js".

	e.g. import { data as chapter_{chapter_number} } from "./chapters/js/{chapter_number}.js"


3) Check if successful.
	
	Step a) Hard refresh the app.

	Step b) Click "Show Filter". Set "Chapter From" and "To" to the chapter number just added.

	Step c) Click "Apply".

	Step d) Open developer console > "Console". 

		If any error, then recheck the added js file - "vocabulary/chapters/js/{chapter_numer}.js" if it follows abovementioned format.
