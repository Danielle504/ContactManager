const CONT_HOVER = 1;
const CONT_INFO = 3;
const CONT_CTRL = 3

document.addEventListener(`DOMContentLoaded`, () => {
	const showContactCtrl = event => {
		if (event.target.childNodes[CONT_HOVER].childNodes[CONT_CTRL] == undefined || !event.target.childNodes[CONT_HOVER].childNodes[CONT_CTRL].classList.contains(`contact-ctrl`)) {
			return;
		}

		event.target.childNodes[CONT_HOVER].childNodes[CONT_CTRL].setAttribute(`aria-hidden`, `false`);
	};

	const hideContactCtrl = event => {
		if (event.target.childNodes[CONT_HOVER].childNodes[CONT_CTRL] == undefined || !event.target.childNodes[CONT_HOVER].childNodes[CONT_CTRL].classList.contains(`contact-ctrl`)) {
			return;
		}

		event.target.childNodes[CONT_HOVER].childNodes[CONT_CTRL].setAttribute(`aria-hidden`, `true`);
	};

	const contactClick = event => {
		if (event.target.nodeName === `H3` || event.target.nodeName === `IMG`) {
			contactClick({
				target: event.target.parentNode.parentNode.parentNode
			});
		}

		if (event.target.classList.contains(`contact-hover-box`)) {
			contactClick({
				target: event.target.parentNode
			});
		}

		if (event.target.childNodes[CONT_HOVER] == undefined || event.target.childNodes[CONT_HOVER].childNodes[CONT_CTRL] == undefined || !event.target.childNodes[CONT_HOVER].childNodes[CONT_CTRL].classList.contains(`contact-ctrl`)) {
			return;
		}

		if (event.target.childNodes[CONT_INFO] == undefined || !event.target.childNodes[CONT_INFO].classList.contains(`contact-info`)) {
			return;
		}

		if (event.target.childNodes[CONT_INFO].getAttribute(`aria-hidden`) === `true`) {
			event.target.childNodes[CONT_INFO].setAttribute(`aria-hidden`, `false`);
			event.target.childNodes[CONT_HOVER].childNodes[CONT_CTRL].setAttribute(`aria-hidden`, `false`);
		}
		else {
			event.target.childNodes[CONT_INFO].setAttribute(`aria-hidden`, `true`);
		}
	};

	const contacts = document.getElementsByClassName(`contact`);

	for (let i=0;i<contacts.length;i++) {
		contacts.item(i).onmouseenter = showContactCtrl;
		contacts.item(i).onmouseleave = hideContactCtrl;

		contacts.item(i).onclick = contactClick;
	}

	const hideAll = () => {
		for (let i=0;i<contacts.length;i++) {
			contacts.item(i).childNodes[CONT_HOVER].setAttribute(`aria-hidden`, `true`);
		}
	};
});
