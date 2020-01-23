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

			contactArr.splice(parseInt(event.target.getAttribute(`id`)), 1);

			// make api call to delete

			displayContacts(contactArr);
		};

		const yesButton = hoverBox.children[2].children[1];
		const noButton = hoverBox.children[2].children[2];

		yesButton.onclick = confirm;
		noButton.onclick = cancel;
	};

	const validate = (value, type) => {
		switch(type) {
			case `firstName`:
				return value !== ``;
			case `phone`:
				return value === `` || value.match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/g) !== null;
			default:
				console.error(`Error with type`);
				return false;
		}
	};

	// shows contact info if not already up
	// switches to editing the info
	const editClick = (event, newContact=false) => {
		let info = event.target.parentNode.parentNode.parentNode;

		if (!info.classList.contains(`contact`)) {
			info = info.parentNode;
		}

		const contact = info;
		info = info.children[CONT_INFO];

		if (editing) {
			let invalid = false;
			editing = false;

			const items = contact.getElementsByTagName(`label`);

			// validate first name, can't be blank
			const fNameHTML = contact.getElementsByClassName(`first-name-input`).item(0);
			if (!validate(fNameHTML.value, `firstName`)) {
				fNameHTML.setAttribute(`style`, `border-bottom: 1px solid red;`);
				editing = invalid = true;
			}
			else {
				if (fNameHTML.style[`border-bottom`] === `1px solid red`) {
					fNameHTML.style[`border-bottom`] = ``;
				}
			}

			// last name doesn't need validation

			// check email, validated by HTML
			const emailHTML = items.item(0).children[0];

			if (!emailHTML.validity.valid) {
				editing = invalid = true;
			}

			// check phone, should be valid format
			const phoneHTML = items.item(1).children[0];
			if (!validate(phoneHTML.value, `phone`)) {
				phoneHTML.setAttribute(`style`, `border-bottom: 1px solid red;`);
				editing = invalid = true;
			}
			else {
				if (phoneHTML.style[`border-bottom`] === `1px solid red`) {
					phoneHTML.style[`border-bottom`] = ``;
				}
			}

			if (invalid) {
				return;
			}

			const created = {};
			created.firstName = fNameHTML.value;
			created.lastName = contact.getElementsByClassName(`last-name-input`).item(0).value;
			created.email = emailHTML.value;
			created.phone = phoneHTML.value.match(/\d+/g).join(``);

			const cid = contact.getAttribute(`id`);

			// make api call with cid
			if (cid === null) {
				// @TODO
				// replace this
				// make api call add
				created.cid = contactArr.length;

				contactArr.push(created);
			}
			else {
				created.cid = cid
				const index = contactArr.findIndex(element => element.cid === contact.getAttribute(`id`));

				if (index === -1) {
					console.error(`uh oh`);
					return;
				}

				// make api call edit
				contactArr[index] = created;
			}

			displayContacts(contactArr);
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
						replacer.children[0].setAttribute(`class`, `email-input`);
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
			const firstNameVal = name.children[0].innerHTML;
			const lastNameVal = name.children[1].innerHTML;

			const firstNameInput = document.createElement(`input`);
			firstNameInput.setAttribute(`type`, `text`);
			firstNameInput.setAttribute(`aria-label`, `First name`);
			firstNameInput.setAttribute(`class`, `first-name-input`);
			firstNameInput.value = firstNameVal;

			const lastNameInput = document.createElement(`input`);
			lastNameInput.setAttribute(`type`, `text`);
			lastNameInput.setAttribute(`aria-label`, `Last name`);
			lastNameInput.setAttribute(`class`, `last-name-input`);
			lastNameInput.value = lastNameVal;

			name.replaceWith(firstNameInput, lastNameInput);

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
		const firstName = name.appendChild(document.createElement(`span`));
		firstName.innerHTML = ``;
		name.appendChild(document.createTextNode(` `));
		const lastName = name.appendChild(document.createElement(`span`));
		lastName.innerHTML = ``;

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

		// confirmation of delete buttons
		const confirm = hover.appendChild(document.createElement(`div`));
		confirm.setAttribute(`class`, `confirmation`);
		confirm.setAttribute(`aria-hidden`, `true`);

		const dialogue = confirm.appendChild(document.createElement(`p`));
		dialogue.innerHTML = `Are you sure?`;

		const yes = confirm.appendChild(document.createElement(`button`));
		yes.setAttribute(`class`, `confirmation-y`);
		yes.innerHTML = `Y`;

		const no = confirm.appendChild(document.createElement(`button`));
		no.setAttribute(`class`, `confirmation-n`);
		no.innerHTML = `N`;

		// contact info
		const info = contact.appendChild(document.createElement(`div`));
		info.setAttribute(`class`, `contact-info`);
		info.setAttribute(`aria-hidden`, `true`);

		const address = info.appendChild(document.createElement(`address`));

		const email = address.appendChild(document.createElement(`p`));
		email.innerHTML = `Email: `;

		const phone = address.appendChild(document.createElement(`p`));
		phone.innerHTML = `Phone: `;

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
		}, true);
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

	// decide whether to show label of search bar
	const searchBlur = event => {
		if (event.target.value !== ``) {
			event.target.labels[0].setAttribute(`style`, `visibility: hidden;`);
		}
		else {
			event.target.labels[0].setAttribute(`style`, `visibility: visible`);
		}
	};

	// show the label when focusing b/c it is out of the way
	const searchFocus = event => {
		event.target.labels[0].setAttribute(`style`, `visibility: visible;`);
	};

	// search for the value inside the search bar if the enter key is pressed
	const searchEnter = event => {
		if (event.key === `Enter`) {
			const filtered =  contactArr.filter(contact => {
				const contactName = ([contact.firstName, contact.lastName]).join(` `);

				return contactName.match(new RegExp(`.*${event.target.value}.*`, `gi`));
			});

			displayContacts(filtered);
		}
	};

	// display the specified array of contacts
	// clear the old displayed contacts if there are any
	const displayContacts = contacts => {
		const length = contactSurround.childNodes.length;

		for (let i=0;i<length;i++) {
			contactSurround.childNodes[0].remove();
		}

		sortContacts(contacts);

		contacts.forEach(contact => {
			const contactBase = createNode();
			setContactInfo(contact, contactBase, Object.assign({}, contact));
			contactSurround.appendChild(contactBase);
		});
	};

	// contArr is the array element, contHTML is the html element
	// info is an object containing all the contact info
	const setContactInfo = (contArr, contHTML, info) => {
		contArr.firstName = info.firstName;
		contArr.lastName = info.lastName;
		contArr.email = info.email;
		contArr.phone = info.phone;
		contArr.cid = info.cid;

		const phoneFormatted = `(${info.phone.substring(0, 3)}) ${info.phone.substring(3, 6)}-${info.phone.substring(6)}`;

		// set html
		contHTML.setAttribute(`id`, info.cid)
		const hover = contHTML.children[0];
		const name = hover.children[0].children[1];
		name.children[0].innerHTML = info.firstName;
		name.children[1].innerHTML = info.lastName;
		const contInfo = contHTML.children[1].children[0];
		contInfo.children[0].innerHTML = `Email: ${info.email}`;
		contInfo.children[1].innerHTML = `Phone: ${phoneFormatted}`;
	};

	const sortContacts = contacts => {
		contacts.sort((a, b) => {
			const compareFirst = a.firstName.localeCompare(b.firstName);

			if (compareFirst === 0) {
				return a.lastName.localeCompare(b.lastName);
			}

			return compareFirst;
		});
	};

	// get the contacts from the DB
	// this is just example for now
	const contactArr = [
		{
			cid: `0`,
			firstName: `John`,
			lastName: `Smith`,
			email: `john@gmail.com`,
			phone: `5555555555`
		},
		{
			cid: `1`,
			firstName: `Davis`,
			lastName: `Goff`,
			email: `davis@gmail.com`,
			phone: `1234567890`
		},
		{
			cid: `2`,
			firstName: `Gaby`,
			lastName: `Whoknows`,
			email: `gaby@gmail.com`,
			phone: `0987654321`
		},
		{
			cid: `3`,
			firstName: `Mary`,
			lastName: `Jesus`,
			email: `mary@gmail.com`,
			phone: `7894561230`
		},
		{
			cid: `4`,
			firstName: `Joey`,
			lastName: `Curitn`,
			email: `joey@gmail.com`,
			phone: `4567891230`
		},
		{
			cid: `5`,
			firstName: `Alpha`,
			lastName: `Beta`,
			email: `alpha@gmail.com`,
			phone: `1237894560`
		}
	];

	(document.getElementById(`loading`)).remove();

	// add the contacts to the document
	const contactSurround = document.getElementById(`contacts-surround`);

	displayContacts(contactArr);

	// elements selection
	const contacts = document.getElementsByClassName(`contact`);
	const deleteButtons = document.getElementsByClassName(`delete-btn`);
	const editButtons = document.getElementsByClassName(`edit-btn`);
	const addButton = document.getElementById(`add-btn`);
	const searchInput = document.getElementsByClassName(`input-surround`)[0].children[0];

	// if the bar is filled in from caching don't show label
	searchBlur({target: searchInput});

	// adding event listeners
	addButton.onclick = addClick;
	addButton.onmouseenter = addHover;
	addButton.onmouseleave = addLeave;

	searchInput.onblur = searchBlur;
	searchInput.onfocus = searchFocus;
	searchInput.onkeydown = searchEnter;

	for (let i=0;i<contacts.length;i++) {
		contacts.item(i).onmouseenter = showContactCtrl;
		contacts.item(i).onmouseleave = hideContactCtrl;

		contacts.item(i).onclick = contactClick;

		deleteButtons.item(i).onclick = deleteClick;
		editButtons.item(i).onclick = editClick;
	}
});
