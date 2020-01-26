const REGISTER_NAME = `davis@test.com`;
const REGISTER_PWORD = `testpassword`;

const LOGIN_NAME = `davis@test.com`;
const LOGIN_PWORD = `testpassword`;

const url = `https://pregradcrisis.azurewebsites.net`;

document.addEventListener(`DOMContentLoaded`, () => {
	let register = false;

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
		event.preventDefault();

		if (usernameInput.validity.valid && passwordInput.validity.valid) {
			if (register) {
				const register = new Promise((resolve, reject) => {
					const request = new XMLHttpRequest();
					const body = {
						uid: REGISTER_NAME,
						pword: REGISTER_PWORD
					};

					request.open(`POST`, `${url}/adduser.php`);
					request.setRequestHeader(`Content-type`, `application/json`)
					request.onload = () => resolve(JSON.parse(request.responseText));
					request.onerror = () => reject(request.statusText);
					request.send(JSON.stringify(body));
				});

				register.then(
					data => {
						console.log(data);
					}
				).catch(
					reason => {
						console.error(reason);
					}
				);
			}
			else {
				const login = new Promise((resolve, reject) => {
					const request = new XMLHttpRequest();
					const body = {
						uid: LOGIN_NAME,
						pword: LOGIN_PWORD
					};

					request.open(`POST`, `${url}/login.php`);
					request.setRequestHeader(`Content-type`, `application/json`)
					request.onload = () => resolve(JSON.parse(request.responseText));
					request.onerror = () => reject(request.statusText);
					request.send(JSON.stringify(body));
				});

				login.then(
					data => {
						console.log(data);
					}
				).catch(
					reason => {
						console.error(reason);
					}
				);

			}
		}
	};

	const toggleType = event => {
		if (sendBtn.innerHTML === `Log in`) {
			register = true;
			sendBtn.innerHTML = `Register`;
			toggleBtn.innerHTML = `Or log in`;
		}
		else {
			register = false;
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
