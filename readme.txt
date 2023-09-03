

HOW TO ADD A NEW VOCABULARY CHAPTER
------------------------------------

1) Add the list in "vocabulary/chapters/js/{#new_chapter}.js"

	(I) The format of the list is as follows:

		a) hiragana _ kanji _ english _ category

			**separated by underscore(_)


		b) category is optional, rest are mandatory. 

			> hiragana _ kanji _ english         <VALID - no category>

			> hiragana _ kanji _ category        <INVALID - missing english>


			In case there is no Kanji, it has to be left blank. 

			> hiragana _ _ english _ category      <VALID - although no kanji, there is blank>

			> hiragana _ english _ category		   <INVALID - no blank for kanji>


		c) category values are - v1, v2, v3, i, na


	(II) Export it by "export const data". Refer previous js files.


2) Import in "vocabulary/vocabulary_importer.js".

	e.g. import { data as chapter_{#new_chapter} } from "./chapters/js/{#new_chapter}.js"


3) Check if successful.
	
	Step a) Hard refresh the app.

	Step b) Click "Show Filter". Set "Chapter From" and "To" to the chapter number just added.

	Step c) Click "Apply".

	Step d) Open Developer tools > "Console" tab. 

		If any error, then recheck the added js file - "vocabulary/chapters/js/{#new_chapter}.js" if it follows abovementioned format.
