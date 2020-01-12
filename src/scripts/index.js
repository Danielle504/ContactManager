document.addEventListener(`DOMContentLoaded`, () => {
	const inputBlur = event => {
		if (event.target.value !== ``) {
			event.target.labels[0].setAttribute(`style`, `visibility: hidden;`);
		}
		else {
			event.target.labels[0].setAttribute(`style`, `visibility: visible`);
		}
	};

	const inputFocus = event => {
		event.target.labels[0].setAttribute(`style`, `visibility: visible;`);
	};

	const handleSend = event => {
		console.log(`This is where I'd send my info. If I had any!`);
	};

	const toggleType = event => {
		if (sendBtn.innerHTML === `Log in`) {
			sendBtn.innerHTML = `Register`;
			toggleBtn.innerHTML = `Or log in`;
		}
		else {
			sendBtn.innerHTML = `Log in`;
			toggleBtn.innerHTML = `Or register`;
		}
	};

	const usernameInput = document.getElementById(`username`);
	const passwordInput = document.getElementById(`password`);
	const sendBtn = document.getElementById(`send-btn`);
	const toggleBtn = document.getElementById(`toggle-type-btn`);

	if (usernameInput.value !== ``) {
		usernameInput.labels[0].setAttribute(`style`, `visibility: hidden;`)
	}

	if (passwordInput.value !== ``) {
		passwordInput.labels[0].setAttribute(`style`, `visibility: hidden;`)
	}

	usernameInput.onblur = passwordInput.onblur = inputBlur;
	usernameInput.onfocus = passwordInput.onfocus = inputFocus;

	sendBtn.onclick = handleSend;
	toggleBtn.onclick = toggleType;
});
