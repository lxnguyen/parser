jQuery(function ($) {
	'use strict';

	var parser = new CSSParser(),
		results = '',
		found = 0;

	$('a').click(function (e) {
		// Reset vars
		found = 0;
		results = '';

		var append_class = $('#append_item').val().length > 1 ? $('#append_item').val() : false;

		e.preventDefault();
		var sheet = parser.parse($('#column_1 textarea').val(), false, false);
		
		for (var i = 0; i < sheet.cssRules.length; i++) {
			// we has URL
			if (sheet.cssRules[i].parsedCssText.indexOf('url') !== -1) {
				var selector = sheet.cssRules[i].mSelectorText;
				if (!selector) continue;
				
				// We have the class we want to append in here already, break out
				if (selector.indexOf(append_class) !== -1) continue;

				// If selector is a multi-line selector, make sure we append correctly
				if (append_class) {
					if (selector.indexOf(',') !== -1) {
						var individual_elements = sheet.cssRules[i].mSelectorText.split(',');
						for (var k = 0; k < individual_elements.length; k++) {
							if (individual_elements[k].length > 0 && individual_elements[k].length !== '') {
								individual_elements[k] = append_class.trim() + ' ' + individual_elements[k].trim();
							}
						}
						selector = individual_elements.join(', ');
					} else {
						selector = append_class + ' ' + selector;
					}
				}
				

				var declaration = '';
				// Iterate over parsed declarations
				for (var j = 0; j < sheet.cssRules[i].declarations.length; j++) {
					if (sheet.cssRules[i].declarations[j].parsedCssText.indexOf('url') !== -1) {
						declaration = sheet.cssRules[i].declarations[j].parsedCssText;
						declaration = declaration.replace($('#replace_target').val(), $('#replace_new').val());
					}
				}

				// Things should be valid up to this point...
				if (declaration.length) {
					results += selector + ' { ' + declaration + ' } ' + "\n";
					found++;
				}
			}
		}

		$('#feedback').text('Processed ' + found + ' item(s)');
		$('#column_3 textarea').text(results);
	});

});