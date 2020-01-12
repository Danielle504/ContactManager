const CONT_HOVER = 0;
const CONT_INFO = 1;
const CONT_CTRL = 1;

document.addEventListener(`DOMContentLoaded`, () => {
	let editing = false;

	// show the edit and delte buttons
	const showContactCtrl = event => {
		const controls = event.target.children[CONT_HOVER].children[CONT_CTRL];

		if (controls == undefined || !controls.classList.contains(`contact-ctrl`)) {
			return;
		}

		controls.setAttribute(`aria-hidden`, `false`);
	};

	// hide the edit and delete buttons
	const hideContactCtrl = event => {
		const controls = event.target.children[CONT_HOVER].children[CONT_CTRL];

		if (controls == undefined || !controls.classList.contains(`contact-ctrl`)) {
			return;
		}

		controls.setAttribute(`aria-hidden`, `true`);
	};

	// click on the contact card
	// will show/hide details, unless editing
	const contactClick = event => {
		if (editing) {
			return;
		}

		const target = event.target;

		if (target.nodeName === `BUTTON` || target.parentNode.nodeName === `BUTTON`) {
			return;
		}

		if (target.nodeName === `H3` || target.nodeName === `IMG`) {
			contactClick({
				target: target.parentNode.parentNode.parentNode
			});
		}

		if (target.classList.contains(`contact-hover-box`)) {
			contactClick({
				target: target.parentNode
			});
		}

		const hover = target.children[CONT_HOVER];

		if (hover == undefined || hover.children[CONT_CTRL] == undefined || !hover.children[CONT_CTRL].classList.contains(`contact-ctrl`)) {
			return;
		}

		const controls = hover.children[CONT_CTRL];
		const info = target.children[CONT_INFO];

		if (info == undefined || !info.classList.contains(`contact-info`)) {
			return;
		}

		if (info.getAttribute(`aria-hidden`) === `true`) {
			info.setAttribute(`aria-hidden`, `false`);
			controls.setAttribute(`aria-hidden`, `false`);
		}
		else {
			info.setAttribute(`aria-hidden`, `true`);
		}
	};

	// deletes the main contact when the delete icon is pressed
	// @TODO
	// add confirmation
	const deleteClick = event => {
		event.target.parentNode.parentNode.parentNode.parentNode.remove();
	};

	// shows contact info if not already up
	// switches to editing the info
	const editClick = event => {
		let info = event.target.parentNode.parentNode.parentNode;

		if (!info.classList.contains(`contact`)) {
			info = info.parentNode;
		}

		const contact = info;
		info = info.children[CONT_INFO];

		if (editing) {
			if (event.target.children[0] != undefined && event.target.children[0].getAttribute(`src`) === `./img/check.svg`) {
				event.target.children[0].setAttribute(`src`, `./img/edit-icon.svg`);
			}
			else if (event.target.getAttribute(`src`) === `./img/check.svg`) {
				event.target.setAttribute(`src`, `./img/edit-icon.svg`);
			}

			editing = false;
		}
		else {
			if (info.getAttribute(`aria-hidden`) === `true`) {
				info.setAttribute(`aria-hidden`, `false`);
			}

			if (event.target.children[0] != undefined && event.target.children[0].getAttribute(`src`) === `./img/edit-icon.svg`) {
				event.target.children[0].setAttribute(`src`, `./img/check.svg`);
			}
			else if (event.target.getAttribute(`src`) === `./img/edit-icon.svg`) {
				event.target.setAttribute(`src`, `./img/check.svg`);
			}

			const items = contact.getElementsByTagName(`P`);
			const length = items.length;

			for (let i=0;i<length;i++) {
				const item = items.item(0);
				console.log(item.innerHTML);
				const replacer = document.createElement(`input`);
				let [label, value] = item.innerHTML.split(`:`);

				label = label.trim();
				value = value.trim();

				item.replaceWith(replacer);

				switch(label) {
					case `Email`:
						replacer.setAttribute(`type`, `email`);
						break;
					case `Phone`:
						replacer.setAttribute(`type`, `tel`);
						break;
					case `Address`:
						replacer.setAttribute(`type`, `text`);
						break;
					default:
						console.error(`oops`);
				}
			}

			editing = true;
		}
	};

	// adds in a new contact and allows the info to be edited
	const addClick = event => {
		console.log(`clicked add`);
	};

	// switches color of + when hovering over add button
	const addHover = event => {
		if (event.target.children[0].getAttribute(`src`) === `img/plus-icon-light.svg`) {
			event.target.children[0].setAttribute(`src`, `img/plus-icon-dark.svg`);
		}
	};

	// switches color of + when hovering over add button
	const addLeave = event => {
		if (event.target.children[0].getAttribute(`src`) === `img/plus-icon-dark.svg`) {
			event.target.children[0].setAttribute(`src`, `img/plus-icon-light.svg`);
		}
	};

	// elements selection
	const contacts = document.getElementsByClassName(`contact`);
	const deleteButtons = document.getElementsByClassName(`delete-btn`);
	const editButtons = document.getElementsByClassName(`edit-btn`);
	const addButton = document.getElementById(`add-btn`);

	// adding event listeners
	addButton.onclick = addClick;
	addButton.onmouseenter = addHover;
	addButton.onmouseleave = addLeave;

	for (let i=0;i<contacts.length;i++) {
		contacts.item(i).onmouseenter = showContactCtrl;
		contacts.item(i).onmouseleave = hideContactCtrl;

		contacts.item(i).onclick = contactClick;

		deleteButtons.item(i).onclick = deleteClick;
		editButtons.item(i).onclick = editClick;
	}
});
