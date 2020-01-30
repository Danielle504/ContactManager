const url = `https://pregradcrisis.azurewebsites.net`;

// indices for when targeting these nodes as children of a parent
const HOVER_BOX = 0;

const MAIN = 0;
const NAME = 0;

const CTRL = 1;
const EDIT = 0;
const DELETE = 1;

const CONFIRMATION = 2;
const CONFIRM = 1;
const DENY = 2;

const INFO = 1;
const ADDRESS = 0;
const EMAIL= 0;
const PHONE = 1;

const md5 = string => {
	const rotateLeft = (lValue, iShiftBits) => {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	};

	const addUnsigned = (lX, lY) => {
		const lX8 = (lX & 0x80000000);
		const lY8 = (lY & 0x80000000);
		const lX4 = (lX & 0x40000000);
		const lY4 = (lY & 0x40000000);
		const lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);

		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}

		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			}
			else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		}
		else {
			return (lResult ^ lX8 ^ lY8);
		}
	};

	const F = (x, y, z) => {
		return (x & y) | ((~x) & z);
	};

	const G = (x, y, z) => {
		return (x & z) | (y & (~z));
	};

	const H = (x, y, z) => {
		return (x ^ y ^ z);
	};

	const I = (x, y, z) => {
		return (y ^ (x | (~z)));
	};

	const FF = (a, b, c, d, x, s, ac) => {
		a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	const GG = (a, b, c, d, x, s, ac) => {
		a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));

		return addUnsigned(rotateLeft(a, s), b);
	};

	const HH = (a, b, c, d, x, s, ac) => {
		a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));

		return addUnsigned(rotateLeft(a, s), b);
	};

	const II = (a, b, c, d, x, s, ac) => {
		a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));

		return addUnsigned(rotateLeft(a, s), b);
	};

	const convertToWordArray = string => {
		let lWordCount;

		const lMessageLength = string.length;
		const lNumberOfWords_temp1 = lMessageLength + 8;
		const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		const lWordArray = Array(lNumberOfWords-1);

		let lBytePosition = 0;
		let lByteCount = 0;

		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}

		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength << 3;
		lWordArray[lNumberOfWords-1] = lMessageLength >>> 29;

		return lWordArray;
	};

	const wordToHex = lValue => {
		let wordToHexValue="";
		let wordToHexValue_temp="";
		let lByte;
		let lCount;

		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;

			wordToHexValue_temp = "0" + lByte.toString(16);
			wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length-2, 2);
		}

		return wordToHexValue;
	};

	const utf8Encode = string => {
		string = string.replace(/\r\n/g,"\n");
		let utftext = "";

		for (var n = 0; n < string.length; n++) {
			const c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}

		return utftext;
	};

	let x = Array();

	let k, AA, BB, CC, DD, a, b, c, d;

	let S11 = 7, S12 = 12, S13 = 17, S14 = 22;
	let S21 = 5, S22 = 9 , S23 = 14, S24 = 20;
	let S31 = 4, S32 = 11, S33 = 16, S34 = 23;
	let S41 = 6, S42 = 10, S43 = 15, S44 = 21;

	string = utf8Encode(string);

	x = convertToWordArray(string);

	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;

	for (k=0;k<x.length;k+=16) {
		AA = a; BB = b; CC = c; DD = d;
		a = FF(a, b, c, d, x[k+0], S11,0xD76AA478);
		d = FF(d, a, b, c, x[k+1], S12,0xE8C7B756);
		c = FF(c, d, a, b, x[k+2], S13,0x242070DB);
		b = FF(b, c, d, a, x[k+3], S14,0xC1BDCEEE);
		a = FF(a, b, c, d, x[k+4], S11,0xF57C0FAF);
		d = FF(d, a, b, c, x[k+5], S12,0x4787C62A);
		c = FF(c, d, a, b, x[k+6], S13,0xA8304613);
		b = FF(b, c, d, a, x[k+7], S14,0xFD469501);
		a = FF(a, b, c, d, x[k+8], S11,0x698098D8);
		d = FF(d, a, b, c, x[k+9], S12,0x8B44F7AF);
		c = FF(c, d, a, b, x[k+10], S13,0xFFFF5BB1);
		b = FF(b, c, d, a, x[k+11], S14,0x895CD7BE);
		a = FF(a, b, c, d, x[k+12], S11,0x6B901122);
		d = FF(d, a, b, c, x[k+13], S12,0xFD987193);
		c = FF(c, d, a, b, x[k+14], S13,0xA679438E);
		b = FF(b, c, d, a, x[k+15], S14,0x49B40821);
		a = GG(a, b, c, d, x[k+1], S21,0xF61E2562);
		d = GG(d, a, b, c, x[k+6], S22,0xC040B340);
		c = GG(c, d, a, b, x[k+11], S23,0x265E5A51);
		b = GG(b, c, d, a, x[k+0], S24,0xE9B6C7AA);
		a = GG(a, b, c, d, x[k+5], S21,0xD62F105D);
		d = GG(d, a, b, c, x[k+10], S22,0x2441453);
		c = GG(c, d, a, b, x[k+15], S23,0xD8A1E681);
		b = GG(b, c, d, a, x[k+4], S24,0xE7D3FBC8);
		a = GG(a, b, c, d, x[k+9], S21,0x21E1CDE6);
		d = GG(d, a, b, c, x[k+14], S22,0xC33707D6);
		c = GG(c, d, a, b, x[k+3], S23,0xF4D50D87);
		b = GG(b, c, d, a, x[k+8], S24,0x455A14ED);
		a = GG(a, b, c, d, x[k+13], S21,0xA9E3E905);
		d = GG(d, a, b, c, x[k+2], S22,0xFCEFA3F8);
		c = GG(c, d, a, b, x[k+7], S23,0x676F02D9);
		b = GG(b, c, d, a, x[k+12], S24,0x8D2A4C8A);
		a = HH(a, b, c, d, x[k+5], S31,0xFFFA3942);
		d = HH(d, a, b, c, x[k+8], S32,0x8771F681);
		c = HH(c, d, a, b, x[k+11], S33,0x6D9D6122);
		b = HH(b, c, d, a, x[k+14], S34,0xFDE5380C);
		a = HH(a, b, c, d, x[k+1], S31,0xA4BEEA44);
		d = HH(d, a, b, c, x[k+4], S32,0x4BDECFA9);
		c = HH(c, d, a, b, x[k+7], S33,0xF6BB4B60);
		b = HH(b, c, d, a, x[k+10], S34,0xBEBFBC70);
		a = HH(a, b, c, d, x[k+13], S31,0x289B7EC6);
		d = HH(d, a, b, c, x[k+0], S32,0xEAA127FA);
		c = HH(c, d, a, b, x[k+3], S33,0xD4EF3085);
		b = HH(b, c, d, a, x[k+6], S34,0x4881D05);
		a = HH(a, b, c, d, x[k+9], S31,0xD9D4D039);
		d = HH(d, a, b, c, x[k+12], S32,0xE6DB99E5);
		c = HH(c, d, a, b, x[k+15], S33,0x1FA27CF8);
		b = HH(b, c, d, a, x[k+2], S34,0xC4AC5665);
		a = II(a, b, c, d, x[k+0], S41,0xF4292244);
		d = II(d, a, b, c, x[k+7], S42,0x432AFF97);
		c = II(c, d, a, b, x[k+14], S43,0xAB9423A7);
		b = II(b, c, d, a, x[k+5], S44,0xFC93A039);
		a = II(a, b, c, d, x[k+12], S41,0x655B59C3);
		d = II(d, a, b, c, x[k+3], S42,0x8F0CCC92);
		c = II(c, d, a, b, x[k+10], S43,0xFFEFF47D);
		b = II(b, c, d, a, x[k+1], S44,0x85845DD1);
		a = II(a, b, c, d, x[k+8], S41,0x6FA87E4F);
		d = II(d, a, b, c, x[k+15], S42,0xFE2CE6E0);
		c = II(c, d, a, b, x[k+6], S43,0xA3014314);
		b = II(b, c, d, a, x[k+13], S44,0x4E0811A1);
		a = II(a, b, c, d, x[k+4], S41,0xF7537E82);
		d = II(d, a, b, c, x[k+11], S42,0xBD3AF235);
		c = II(c, d, a, b, x[k+2], S43,0x2AD7D2BB);
		b = II(b, c, d, a, x[k+9], S44,0xEB86D391);
		a = addUnsigned(a, AA);
		b = addUnsigned(b, BB);
		c = addUnsigned(c, CC);
		d = addUnsigned(d, DD);
	}

	const temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

	return temp.toLowerCase();
};

const redirect = () => {
	const index = window.location.href.lastIndexOf(`/contacts.html`);

	window.location.replace(`${window.location.href.slice(0, index)}/index.html`);
};

if (document.cookie !== ``) {
	if (document.cookie.includes(`username=`) && document.cookie.includes(`password=`)) {
		const breakPoint = document.cookie.indexOf(`; `);

		let username = document.cookie.indexOf(`username=`);
		let password = document.cookie.indexOf(`password=`);

		if (username > breakPoint) {
			username = document.cookie.slice(username + 9);
			password = document.cookie.slice(9, breakPoint);
		}
		else {
			username = document.cookie.slice(9, breakPoint);
			password = document.cookie.slice(password + 9);
		}

		const login = new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			const body = {
				uid: username,
				pword: md5(password)
			};

			request.open(`POST`, `${url}/login.php`);
			request.setRequestHeader(`Content-type`, `application/json`)
			request.onload = () => resolve(JSON.parse(request.responseText));
			request.onerror = () => reject(request.statusText);
			request.send(JSON.stringify(body));
		});

		login.then(
			data => {
				mainLogic(username);
			}
		).catch(
			reason => {
				redirect();
			}
		);
	}
	else {
		redirect();
	}
}
else {
	redirect();
}

const mainLogic = username => {
	let editing = false;

	const error = message => {
		errorDisplay.setAttribute(`aria-hidden`, `false`);
		errorDisplay.innerHTML = message;
	};

	const hideError = () => {
		errorDisplay.setAttribute(`aria-hidden`, `true`);
	};

	// show the edit and delete buttons
	const showContactCtrl = event => {
		const controls = event.target.children[MAIN].children[CTRL];

		if (controls == undefined || !controls.classList.contains(`contact-ctrl`)) {
			return;
		}

		if (controls.parentNode.children[CONFIRMATION].getAttribute(`aria-hidden`) === `false`) {
			return;
		}

		controls.setAttribute(`aria-hidden`, `false`);
	};

	// hide the edit and delete buttons
	const hideContactCtrl = event => {
		if (event.target.children[HOVER_BOX].children[MAIN].children[NAME].nodeName !== `H3`) {
			return;
		}

		const controls = event.target.children[HOVER_BOX].children[CTRL];

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
		if (target.nodeName === `H3` || target.parentNode.nodeName === `H3`) {
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

		const hover = target.children[HOVER_BOX];

		// if hover or info don't exist (i.e. detected wrong click) then do nothing
		if (hover == undefined || hover.children[CTRL] == undefined || !hover.children[1].classList.contains(`contact-ctrl`)) {
			return;
		}

		const controls = hover.children[CTRL];
		const info = target.children[INFO];

		if (info == undefined || !info.classList.contains(`contact-info`)) {
			return;
		}

		hideError();

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
		hideError();

		let controls = event.target.parentNode;

		if (event.target.tagName === `IMG`) {
			controls = controls.parentNode;
		}

		const hoverBox = controls.parentNode;

		controls.setAttribute(`aria-hidden`, `true`);
		hoverBox.children[CONFIRMATION].setAttribute(`aria-hidden`, `false`);

		const cancel = () => {
			controls.setAttribute(`aria-hidden`, `false`);
			hoverBox.children[CONFIRMATION].setAttribute(`aria-hidden`, `true`);

			yesButton.onclick = null;
			noButton.onclick = null;
		};

		const confirm = () => {
			yesButton.onclick = null;
			noButton.onclick = null;
			const cid = event.target.parentNode.parentNode.parentNode.parentNode.getAttribute(`id`);

			// make api call to delete
			const deleteContact = new Promise((resolve, reject) => {
				const request = new XMLHttpRequest();

				const body = {
					cid: cid
				};

				request.open(`POST`, `${url}/deleteContact.php`);
				request.setRequestHeader(`Content-type`, `application/json`)
				request.onload = () => resolve(JSON.parse(request.responseText));
				request.onerror = () => reject(request.statusText);
				request.send(JSON.stringify(body));
			});

			deleteContact.then(
				data => {
					if (data.code === 200) {
						contactArr.forEach((contact, i) => {
							if (contact.cid === cid) {
								contactArr.splice(i, 1);
							}
						});

						displayContacts(contactArr);
					}
					else {
						error(`Could not delete contact. Please try again or come back later.`);
					}
				}
			).catch(
				reason => {
					error(`Could not delete contact. Please try again or come back later.`);
				}
			);
		};

		const yesButton = hoverBox.children[CONFIRMATION].children[CONFIRM];
		const noButton = hoverBox.children[CONFIRMATION].children[DENY];

		yesButton.onclick = confirm;
		noButton.onclick = cancel;
	};

	const validate = (value, type) => {
		switch(type) {
			case `fname`:
				return value !== ``;
			case `phone`:
				return value === `` || value.match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/g) !== null;
			default:
				return false;
		}
	};

	// shows contact info if not already up
	// switches to editing the info
	const editClick = (event, newContact=false) => {
		hideError();

		let info = event.target.parentNode.parentNode.parentNode;

		const placeholder = document.getElementById(`placeholder`);

		if (placeholder != undefined) {
			placeholder.remove();
		}

		if (!info.classList.contains(`contact`)) {
			info = info.parentNode;
		}

		const contact = info;
		info = info.children[INFO];

		if (editing) {
			let invalid = false;
			editing = false;

			const items = contact.getElementsByTagName(`label`);

			// validate first name, can't be blank
			const fNameHTML = contact.getElementsByClassName(`first-name-input`).item(0);
			if (!validate(fNameHTML.value, `fname`)) {
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
			const emailHTML = items.item(EMAIL).children[0];

			if (!emailHTML.validity.valid) {
				editing = invalid = true;
			}

			// check phone, should be valid format
			const phoneHTML = items.item(PHONE).children[0];
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
			created.fname = fNameHTML.value;
			created.lname = contact.getElementsByClassName(`last-name-input`).item(0).value;
			created.email = emailHTML.value;
			created.phone = phoneHTML.value.match(/\d+/g).join(``);

			const cid = contact.getAttribute(`id`);

			// make api call with cid
			if (cid === null) {
				const addContact = new Promise((resolve, reject) => {
					const request = new XMLHttpRequest();
					const body = {
						uid: username,
						fname: created.fname,
						lname: created.lname,
						phone: created.phone,
						email: created.email
					};

					request.open(`POST`, `${url}/addContact.php`);
					request.setRequestHeader(`Content-type`, `application/json`)
					request.onload = () => resolve(JSON.parse(request.responseText));
					request.onerror = () => reject(request.statusText);
					request.send(JSON.stringify(body));
				});

				addContact.then(
					data => {
						if (data.code === 200) {
							created.cid = data.cid;
							contactArr.push(created);
							displayContacts(contactArr);
						}
						else {
							error(`Could not add contact. Please try again or wait until later.`);
						}
					}
				).catch(
					reason => {
						error(`Could not add contact. Please try again or wait until later.`);
					}
				);
			}
			else {
				created.cid = cid
				const index = contactArr.findIndex(element => element.cid === contact.getAttribute(`id`));

				if (index === -1) {
					error(`Could not edit contact. Please try again or wait until later.`);
					return;
				}

				// make api call edit
				const editContact = new Promise((resolve, reject) => {
					const request = new XMLHttpRequest();
					const body = {
						uid: username,
						cid: created.cid,
						fname: created.fname,
						lname: created.lname,
						phone: created.phone,
						email: created.email
					};

					request.open(`POST`, `${url}/editContact.php`);
					request.setRequestHeader(`Content-type`, `application/json`)
					request.onload = () => resolve(JSON.parse(request.responseText));
					request.onerror = () => reject(request.statusText);
					request.send(JSON.stringify(body));
				});

				editContact.then(
					data => {
						if (data.code === 200) {
							contactArr[index] = created;
							displayContacts(contactArr);
						}
						else {
							error(`Could not edit contact. Please try again or wait until later.`);
						}
					}
				).catch(
					reason => {
						error(`Could not edit contact. Please try again or wait until later.`);
					}
				);
			}
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
				}

				replacer.parentNode.parentNode.append(replacer.cloneNode(true));
				replacer.remove();
			}

			contact.getElementsByTagName(`ADDRESS`).item(0).remove();

			// replace the name with an input
			const name = contact.getElementsByTagName(`H3`).item(0);
			const fnameVal = name.children[0].innerHTML;
			const lnameVal = name.children[1].innerHTML;

			const fnameInput = document.createElement(`input`);
			fnameInput.setAttribute(`type`, `text`);
			fnameInput.setAttribute(`aria-label`, `First name`);
			fnameInput.setAttribute(`class`, `first-name-input`);
			fnameInput.value = fnameVal;

			const lnameInput = document.createElement(`input`);
			lnameInput.setAttribute(`type`, `text`);
			lnameInput.setAttribute(`aria-label`, `Last name`);
			lnameInput.setAttribute(`class`, `last-name-input`);
			lnameInput.value = lnameVal;

			name.replaceWith(fnameInput, lnameInput);

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

		const name = main.appendChild(document.createElement(`h3`));
		const fname = name.appendChild(document.createElement(`span`));
		fname.innerHTML = ``;
		name.appendChild(document.createTextNode(` `));
		const lname = name.appendChild(document.createElement(`span`));
		lname.innerHTML = ``;

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

		hideError();

		const newContact = contactSurround.appendChild(createNode());

		// targets the edit button of the created node
		editClick({
			target: newContact.children[HOVER_BOX].children[CTRL].children[EDIT]
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
			hideError();

			const filtered =  contactArr.filter(contact => {
				const contactName = ([contact.fname, contact.lname]).join(` `);

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

		if (contactArr.length < 1) {
			const helper = document.createElement(`p`);
			helper.innerHTML = `Add contacts by clicking the button above.`;
			helper.setAttribute(`id`, `placeholder`);

			contactSurround.append(helper);
		}
		else {
			sortContacts(contacts);

			contacts.forEach(contact => {
				const contactBase = createNode();
				setContactInfo(contact, contactBase, Object.assign({}, contact));
				contactSurround.appendChild(contactBase);
			});
		}
	};

	// contArr is the array element, contHTML is the html element
	// info is an object containing all the contact info
	const setContactInfo = (contArr, contHTML, info) => {
		contArr.fname = info.fname;
		contArr.lname = info.lname;
		contArr.email = info.email;
		contArr.phone = info.phone;
		contArr.cid = info.cid;

		const phoneFormatted = `(${info.phone.substring(0, 3)}) ${info.phone.substring(3, 6)}-${info.phone.substring(6)}`;

		// set html
		contHTML.setAttribute(`id`, info.cid);

		const hover = contHTML.children[HOVER_BOX];

		const name = hover.children[MAIN].children[NAME];
		name.children[0].innerHTML = info.fname;
		name.children[1].innerHTML = info.lname;

		const contInfo = contHTML.children[INFO].children[ADDRESS];
		contInfo.children[EMAIL].innerHTML = `Email: ${info.email}`;
		contInfo.children[PHONE].innerHTML = `Phone: ${phoneFormatted}`;
	};

	const sortContacts = contacts => {
		contacts.sort((a, b) => {
			const compareFirst = a.fname.localeCompare(b.fname);

			if (compareFirst === 0) {
				return a.lname.localeCompare(b.lname);
			}

			return compareFirst;
		});
	};

	const handleLogout = event => {
		event.preventDefault();

		hideError();

		document.cookie = `username=;expires=Thu, 01 Jan 1970 00:00:00 UTC`;
		document.cookie = `password=;expires=Thu, 01 Jan 1970 00:00:00 UTC`;

		redirect();
	};

	document.getElementById(`uname`).innerHTML = `${username} `;

	let contactArr = [];

	const requestContacts = new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();

		request.open(`POST`, `${url}/searchContacts.php`);
		request.setRequestHeader(`Content-type`, `application/json`)
		request.onload = () => resolve(JSON.parse(request.responseText));
		request.onerror = () => reject(request.statusText);
		request.send(JSON.stringify({uid: username}));
	});

	requestContacts.then(
		data => {
			if (data.code !== 200) {
				error(`Could not retrieve contacts. Reload the page to try again or wait until later.`);
			}
			contactArr = [... data.contacts];
			displayContacts(contactArr);
		}
	).catch(
		reason => {
			error(`Could not retrieve contacts. Reload the page to try again or wait until later.`);
		}
	);

	// add the contacts to the document
	const contactSurround = document.getElementById(`contacts-surround`);

	// elements selection
	const contacts = document.getElementsByClassName(`contact`);
	const deleteButtons = document.getElementsByClassName(`delete-btn`);
	const editButtons = document.getElementsByClassName(`edit-btn`);
	const addButton = document.getElementById(`add-btn`);
	const searchInput = document.getElementsByClassName(`input-surround`)[0].children[0];
	const logout = document.getElementById(`logout-btn`);
	const errorDisplay = document.getElementById(`error`);

	// if the bar is filled in from caching don't show label
	searchBlur({target: searchInput});

	// adding event listeners
	addButton.onclick = addClick;
	addButton.onmouseenter = addHover;
	addButton.onmouseleave = addLeave;

	searchInput.onblur = searchBlur;
	searchInput.onfocus = searchFocus;
	searchInput.onkeydown = searchEnter;

	logout.onclick = handleLogout;

	for (let i=0;i<contacts.length;i++) {
		contacts.item(i).onmouseenter = showContactCtrl;
		contacts.item(i).onmouseleave = hideContactCtrl;

		contacts.item(i).onclick = contactClick;

		deleteButtons.item(i).onclick = deleteClick;
		editButtons.item(i).onclick = editClick;
	}
};
