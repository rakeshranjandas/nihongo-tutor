

let VerbForms = {

	_id: 0,

	_resetId: function() { this._id = 0; },

	_getId: function() { return ++this._id; },

	render: function() {
		$('#main_div').html(this.getTable());
	},

	_wrap: function(htmlTag, content, attr) {

		let attrStr = attr ? Object.entries(attr).map(([key, value]) => `${key}='${value}'`).join(' '): '';

		return '<' + htmlTag + ' ' + attrStr + '>' + content + '</' + htmlTag + '>';
	},

	getTable: function() {
		let table_html = '';

		table_html += this.getTableHeader();
		table_html += this.getTableBody();


		return this._wrap('table', table_html);
	},

	getTableHeader: function() { 
		return `<thead>
				    <tr>
				      <th>#</th>
				      <th>Chapter</th>
				      <th>Form</th>
				      <th colspan="4">Group 1</th>
				      <th>Group 2</th>
				      <th colspan="2">Group 3</th>
				    </tr>
				    <tr>
				      <th></th>
				      <th></th>
				      <th></th>
				      <th>い / ち / り</th>
				      <th>み / び</th>
				      <th>き / ぎ</th>
				      <th>-</th>
				      <th></th>
				     <th>きます</th>
				     <th>します</th>
				    </tr>
				 </thead>`;

	},

	getTableBody: function() {

		this._resetId();

		let tbody_html = '';

		all_verb_forms.forEach((formRule) => {

			tbody_html += this.getTableRow(formRule);

		});


		return this._wrap('tbody', tbody_html);
	},

	getTableRow: function(formRule) {

		let trow_html = '';

		trow_html += this.getTableColId();
		trow_html += this.getTableColChapter(formRule.chapter);
		trow_html += this.getTableColForm(formRule.form);
		trow_html += this.getTableColGroup1(formRule.group1);
		trow_html += this.getTableColGroup2(formRule.group2);
		trow_html += this.getTableColGroup3(formRule.group3);

		return this._wrap('tr', trow_html);

	},

	getTableColId: function() {
		return this._wrap('td', this._getId());
	},

	getTableColChapter: function(chapter) {
		return this._wrap('td', chapter);
	},

	getTableColForm: function(formLabel) {
		return this._wrap('td', formLabel);
	},

	getTableColGroup1: function(groupRule) {

		if (groupRule.rule) {
			return this._wrap('td', this._getSubGroupTd(groupRule), { 'colspan': 4 });
		}

		return this._wrap('td', this._getSubGroupTd(groupRule['i/chi/ri']))
			+ 	this._wrap('td', this._getSubGroupTd(groupRule['mi/bi']))
			+	this._wrap('td', this._getSubGroupTd(groupRule['ki/gi']))
			+	this._wrap('td', this._getSubGroupTd(groupRule['-']))
		;
	},

	getTableColGroup2: function(groupRule) {
		return this._wrap('td', this._getSubGroupTd(groupRule));
	},

	getTableColGroup3: function(groupRule) {
		return  this._wrap('td', this._getSubGroupTd(groupRule['kimasu']))
			+ 	this._wrap('td', this._getSubGroupTd(groupRule['shimasu']));
	},

	_getSubGroupTd: function(groupRule) {

		let rule = groupRule.rule;

		let examplesLi = '';

		groupRule.examples.forEach((example) => {
			examplesLi += this._wrap('li', this._getSubGroupExample(example));
		});

		return this._wrap('details', 

				this._wrap('summary', rule)
			+ 	this._wrap('ul', examplesLi)
		);
	},

	_getSubGroupExample: function(example) {
		if (typeof example === 'string') return example;

		return JSON.stringify(example);
	}

};


$(document).ready(function(){

	VerbForms.render();

});

