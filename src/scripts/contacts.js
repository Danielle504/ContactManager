const CONT_HOVER = 0;
const CONT_INFO = 1;
const CONT_CTRL = 1;

document.addEventListener(`DOMContentLoaded`, () => {
	let editing = false;

	// show the edit and delete buttons
	const showContactCtrl = event => {
		const controls = event.target.children[CONT_HOVER].children[CONT_CTRL];

		if (controls == undefined || !controls.classList.contains(`contact-ctrl`)) {
			return;
		}

		if (controls.parentNode.children[2].getAttribute(`aria-hidden`) === `false`) {
			return;
		}

		controls.setAttribute(`aria-hidden`, `false`);
	};

	// hide the edit and delete buttons
	const hideContactCtrl = event => {
		if (event.target.children[CONT_HOVER].children[0].children[1].nodeName !== `H3`) {
			return;
		}

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

		// if clicking on the edit/delete buttons
		if (target.nodeName === `BUTTON` || target.parentNode.nodeName === `BUTTON`) {
			return;
		}

		// change target when clicking on the name and image
		if (target.nodeName === `H3` || target.nodeName === `IMG`) {
			contactClick({
				target: target.parentNode.parentNode.parentNode
			});
		}

		// if you clicked on the hover box the target needs to be the parent
		if (target.classList.contains(`contact-hover-box`)) {
			contactClick({
				target: target.parentNode
			});
		}

		if (target.classList.contains(`contact-main`)) {
			contactClick({
				target: target.parentNode.parentNode
			});
		}

		const hover = target.children[CONT_HOVER];

		// if hover or info don't exist (i.e. detected wrong click) then do nothing
		if (hover == undefined || hover.children[CONT_CTRL] == undefined || !hover.children[CONT_CTRL].classList.contains(`contact-ctrl`)) {
			return;
		}

		const controls = hover.children[CONT_CTRL];
		const info = target.children[CONT_INFO];

		if (info == undefined || !info.classList.contains(`contact-info`)) {
			return;
		}

		// show the important stuff
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
		let controls = event.target.parentNode;

		if (event.target.tagName === `IMG`) {
			controls = controls.parentNode;
		}

		const hoverBox = controls.parentNode;

		controls.setAttribute(`aria-hidden`, `true`);
		hoverBox.children[2].setAttribute(`aria-hidden`, `false`);

		const cancel = () => {
			controls.setAttribute(`aria-hidden`, `false`);
			hoverBox.children[2].setAttribute(`aria-hidden`, `true`);

			yesButton.onclick = null;
			noButton.onclick = null;
		};

		const confirm = () => {
			yesButton.onclick = null;
			noButton.onclick = null;

			hoverBox.parentNode.remove();
		};

		const yesButton = hoverBox.children[2].children[1];
		const noButton = hoverBox.children[2].children[2];

		yesButton.onclick = confirm;
		noButton.onclick = cancel;
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
			// toggle between the button pictures for the edit button
			if (event.target.children[0] != undefined && event.target.children[0].getAttribute(`src`) === `./img/check.svg`) {
				event.target.children[0].setAttribute(`src`, `./img/edit-icon.svg`);
			}
			else if (event.target.getAttribute(`src`) === `./img/check.svg`) {
				event.target.setAttribute(`src`, `./img/edit-icon.svg`);
			}

			const items = contact.getElementsByTagName(`label`);
			const length = items.length;
			const address = document.createElement(`address`);

			// change the name and info to paragraphs or headers
			// containing the respective input's value
			const name = contact.getElementsByTagName(`input`).item(0);
			const nameH = document.createElement(`h3`);

			nameH.innerHTML = name.value;

			name.replaceWith(nameH);

			for (let i=0;i<length;i++) {
				const item = items.item(0);

				const replacer = document.createElement(`p`);
				replacer.innerHTML = [item.childNodes[0].data, item.children[0].value].join(` `)

				item.remove();
				address.append(replacer)
			}

			info.append(address);

			editing = false;
		}
		else {
			// if the info box is hidden show it
			if (info.getAttribute(`aria-hidden`) === `true`) {
				info.setAttribute(`aria-hidden`, `false`);
			}

			// toggle the edit button image
			if (event.target.children[0] != undefined && event.target.children[0].getAttribute(`src`) === `./img/edit-icon.svg`) {
				event.target.children[0].setAttribute(`src`, `./img/check.svg`);
			}
			else if (event.target.getAttribute(`src`) === `./img/edit-icon.svg`) {
				event.target.setAttribute(`src`, `./img/check.svg`);
			}

			// replace all the paragraphs (contact info) with input
			// boxes that have the correct input type
			const items = contact.getElementsByTagName(`P`);
			const length = items.length;

			for (let i=1;i<length;i++) {
				const item = items.item(1);
				const replacer = document.createElement(`label`);

				let [label, value] = item.innerHTML.split(`:`);

				label = label.trim();
				value = value.trim();

				replacer.innerHTML = `${label}:`;

				item.replaceWith(replacer);

				replacer.append(document.createElement(`input`));
				replacer.children[0].value = value;

				switch(label) {
					case `Email`:
						replacer.children[0].setAttribute(`type`, `email`);
						break;
					case `Phone`:
						replacer.children[0].setAttribute(`type`, `tel`);
						break;
					case `Address`:
						replacer.children[0].setAttribute(`type`, `text`);
						break;
					default:
						console.error(`oops`);
				}

				replacer.parentNode.parentNode.append(replacer.cloneNode(true));
				replacer.remove();
			}

			contact.getElementsByTagName(`ADDRESS`).item(0).remove();

			// replace the name with an input
			const name = contact.getElementsByTagName(`H3`).item(0);
			const nameInput = document.createElement(`input`);
			nameInput.setAttribute(`type`, `text`);
			nameInput.setAttribute(`aria-label`, `Name`);
			nameInput.value = name.innerHTML;

			name.replaceWith(nameInput);

			editing = true;
		}
	};

	// use append child because it returns the added element
	const createNode = () => {
		// contact container
		const contact = document.createElement(`div`);
		contact.setAttribute(`class`, `contact`);
		contact.setAttribute(`tabindex`, `0`);

		// the part of the collapsed node that is hovered over
		const hover = contact.appendChild(document.createElement(`div`));
		hover.setAttribute(`class`, `contact-hover-box`);

		// contact name and picture
		const main = hover.appendChild(document.createElement(`div`));
		main.setAttribute(`class`, `contact-main`);

		const picture = main.appendChild(document.createElement(`img`));
		picture.setAttribute(`class`, `profile-picture`);
		picture.setAttribute(`src`, `./img/square-placeholder.jpg`);
		picture.setAttribute(`alt`, ``);

		const name = main.appendChild(document.createElement(`h3`));
		name.innerHTML = ``;

		// edit and delete buttons
		const control = hover.appendChild(document.createElement(`div`));
		control.setAttribute(`class`, `contact-ctrl`);
		control.setAttribute(`aria-hidden`, `true`);

		const edit = control.appendChild(document.createElement(`button`));
		edit.setAttribute(`class`, `edit-btn`);
		edit.onclick = editClick;

		const editPicture = edit.appendChild(document.createElement(`img`));
		editPicture.setAttribute(`src`, `./img/edit-icon.svg`);
		editPicture.setAttribute(`alt`, `Edit`);

		const deleteButton = control.appendChild(document.createElement(`button`));
		deleteButton.setAttribute(`class`, `delete-btn`);
		deleteButton.onclick = deleteClick;

		const deletePicture = deleteButton.appendChild(document.createElement(`img`));
		deletePicture.setAttribute(`src`, `./img/delete-icon.svg`);
		deletePicture.setAttribute(`alt`, `Delete`);

		// contact info
		const info = contact.appendChild(document.createElement(`div`));
		info.setAttribute(`class`, `contact-info`);
		info.setAttribute(`aria-hidden`, `true`);

		const address = info.appendChild(document.createElement(`address`));

		const email = address.appendChild(document.createElement(`p`));
		email.innerHTML = `Email: `;

		const phone = address.appendChild(document.createElement(`p`));
		phone.innerHTML = `Phone: `;

		const home = address.appendChild(document.createElement(`p`));
		home.innerHTML = `Address: `;

		contact.onmouseenter = showContactCtrl;
		contact.onmouseleave = hideContactCtrl;

		contact.onclick = contactClick;

		return contact;
	};

	// adds in a new contact and allows the info to be edited
	const addClick = event => {
		event.preventDefault();

		const newContact = contactSurround.appendChild(createNode());

		// this is ugly but targets the edit button of the created node
		editClick({
			target: newContact.children[CONT_HOVER].children[CONT_CTRL].children[0]
		});
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

	const searchBlur = event => {
		if (event.target.value !== ``) {
			event.target.labels[0].setAttribute(`style`, `visibility: hidden;`);
		}
		else {
			event.target.labels[0].setAttribute(`style`, `visibility: visible`);
		}
	};

	const searchFocus = event => {
		event.target.labels[0].setAttribute(`style`, `visibility: visible;`);
	};

	// elements selection
	const contacts = document.getElementsByClassName(`contact`);
	const deleteButtons = document.getElementsByClassName(`delete-btn`);
	const editButtons = document.getElementsByClassName(`edit-btn`);
	const addButton = document.getElementById(`add-btn`);
	const contactSurround = document.getElementById(`contacts-surround`);
	const searchInput = document.getElementsByClassName(`input-surround`)[0].children[0];

	// adding event listeners
	addButton.onclick = addClick;
	addButton.onmouseenter = addHover;
	addButton.onmouseleave = addLeave;

	searchInput.onblur = searchBlur;
	searchInput.onfocus = searchFocus;

	for (let i=0;i<contacts.length;i++) {
		contacts.item(i).onmouseenter = showContactCtrl;
		contacts.item(i).onmouseleave = hideContactCtrl;

		contacts.item(i).onclick = contactClick;

		deleteButtons.item(i).onclick = deleteClick;
		editButtons.item(i).onclick = editClick;
	}
});
