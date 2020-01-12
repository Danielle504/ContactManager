document.addEventListener(`DOMContentLoaded`, () => {
	const contactHover = event => {
		console.log(`hover`);
	};

	const contactExit = event => {
		console.log(`exit`);
	};

	const contactFocus = event => {
		console.log(`focus`);
	};

	const contactBlur = event => {
		console.log(`blur`);
	};

	const contacts = document.getElementsByClassName(`contact`);

	for (let i=0;i<contacts.length;i++) {
		contacts.item(i).onmouseenter = contactHover;
		contacts.item(i).onmouseleave = contactExit;

		contacts.item(i).onfocus = contactFocus;
		contacts.item(i).onblur = contactBlur;
	}
});
