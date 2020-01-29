const url = `https://pregradcrisis.azurewebsites.net`;

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

	let k,AA,BB,CC,DD,a,b,c,d;

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
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=addUnsigned(a,AA);
		b=addUnsigned(b,BB);
		c=addUnsigned(c,CC);
		d=addUnsigned(d,DD);
	}

	const temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

   	return temp.toLowerCase();
};

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

		if (usernameInput.value === `username` || usernameInput.value === `password`) {
			console.error(`garbage`);
		}

		if (usernameInput.validity.valid && passwordInput.validity.valid) {
			const username = usernameInput.value;
			const password = md5(passwordInput.value);

			if (register) {
				const register = new Promise((resolve, reject) => {
					const request = new XMLHttpRequest();
					const body = {
						uid: username,
						pword: password
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
						uid: username,
						pword: password
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
						document.cookie = encodeURIComponent(`info=${atob(`username:${username}password:${password}`)};secure;samesite`);
					}
				).catch(
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
