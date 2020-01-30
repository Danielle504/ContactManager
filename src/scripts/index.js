import md5 from './md5';

const url = `https://pregradcrisis.azurewebsites.net`;

const login = (username, password, success, failure) => {
	const promise = new Promise((resolve, reject) => {
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

	promise.then(
		data => {
			success(data)
		}
	).catch(
		reason => {
			failure(reason)
		}
	);
};

if (document.cookie !== ``) {
	if (document.cookie.includes(`password=`) && document.cookie.includes(`username=`)) {
		const breakPoint = document.cookie.indexOf(`; `);

		let username = document.cookie.indexOf(`username=`);
		let password = document.cookie.indexOf(`password=`);

		if (username > breakPoint) {
			username = document.cookie.slice(username + 9);
			password = document.cookie.slice(0, breakPoint);
		}
		else {
			username = document.cookie.slice(0, breakPoint);
			password = document.cookie.slice(password + 9);
		}

		login(username, password,
			data => {
				const index = window.location.href.lastIndexOf(`/index.html`);

				window.location.replace(`${window.location.href.slice(0, index)}/contacts.html`);
			},
			reason => {
				console.error(reason);
			}
		);
	}
}

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
			const username = usernameInput.value;
			const password = passwordInput.value;

			if (register) {
				const register = new Promise((resolve, reject) => {
					const request = new XMLHttpRequest();
					const body = {
						uid: username,
						pword: md5(password)
					};

					request.open(`POST`, `${url}/adduser.php`);
					request.setRequestHeader(`Content-type`, `application/json`)
					request.onload = () => resolve(JSON.parse(request.responseText));
					request.onerror = () => reject(request.statusText);
					request.send(JSON.stringify(body));
				});

				register.then(
					data => {
						document.cookie = `username=${encodeURIComponent(username)};samesite=strict`;
						document.cookie = `password=${encodeURIComponent(password)};samesite=strict`;
						console.log(document.cookie);
					}
				).catch(
					reason => {
						console.error(reason);
					}
				);
			}
			else {
				login(username, password,
					data => {
						document.cookie = `username=${encodeURIComponent(username)};samesite=strict`;
						document.cookie = `password=${encodeURIComponent(password)};samesite=strict`;
						console.log(document.cookie);

						const index = window.location.href.lastIndexOf(`/index.html`);

						window.location.replace(`${window.location.href.slice(0, index)}/contacts.html`);
					},
					reason => {
						console.error(reason);
					}
				);
			}
		}
	};

	const handleKeyDownSend = event => {
		if (event.key === `Enter`) {
			handleSend(event);
		}
	};

	const handleKeyDownToggle = event => {
		if (event.key === `Enter`) {
			toggleType(event);
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
	sendBtn.onkeydown = handleKeyDownSend;
	toggleBtn.onclick = toggleType;
	toggleBtn.onkeydown = handleKeyDownToggle;
});
