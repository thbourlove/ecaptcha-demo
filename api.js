function loadCaptcha() {
    captchas = document.getElementsByClassName("captcha");
    for (var i = 0; i < captchas.length; i++) {
        var captcha = captchas[i];
        var request = new XMLHttpRequest();
        publickey = captcha.dataset.publickey;
        request.open("GET", "//localhost:8888/captcha/new?clientId="+publickey, true);
        request.onload = function () {
            if (request.status === 200) {
                captchaId = request.responseText;
                captcha.appendChild(createCaptchaForm(captchaId));
                document.body.appendChild(createCaptcha(captchaId, publickey));
            }
        }
        request.send();
    }
}

function reloadCaptchaImage(captchaId, publickey) {
    image = document.getElementById("captcha-image-"+captchaId);
    var request = new XMLHttpRequest();
    request.open("GET", "//localhost:8888/captcha/reload?captchaId="+captchaId, true);
    request.onload = function () {
        if (request.status === 200 && request.responseText === 'success') {
            image.src = "//localhost:8888/captcha/" + captchaId + ".png";
        }
    }
    request.send();
}

function createCaptchaForm(captchaId) {
    div = document.createElement('div');

    inputCaptchaId = document.createElement('input');
    inputCaptchaId.type = "hidden";
    inputCaptchaId.name = "captchaId";
    inputCaptchaId.value = captchaId;
    div.appendChild(inputCaptchaId);

    inputSecret = document.createElement('input');
    inputSecret.type = "hidden";
    inputSecret.name = "secret";
    inputSecret.id = "e-captcha-secret-" + captchaId;
    div.appendChild(inputSecret);
    return div;
}

function createCaptcha(captchaId, publickey) {
    div = document.createElement('div');

    image = document.createElement('img');
    image.src = "//localhost:8888/captcha/" + captchaId + ".png";
    image.id = "captcha-image-".captchaId;
    div.appendChild(image);

    input = document.createElement('input');
    input.type = "text";
    input.name = "captcha";
    div.appendChild(input);

    button = document.createElement('div');
    button.class = "captcha-button";
    button.textContent = "Verify";

    button.addEventListener("click", function () {
        verifyString = input.value;
        var request = new XMLHttpRequest();
        request.open("GET", "//localhost:8888/captcha/verify?captchaId="+captchaId+"&verifyString="+verifyString, true);
        request.onload = function () {
            secret = request.responseText;
            if (secret === "fail") {
                reloadCaptchaImage(captchaId, publickey)
            } else {
                inputSecret = document.getElementById("e-captcha-secret-"+captchaId);
                inputSecret.value = secret;
            }
        }
        request.send();
    });

    div.appendChild(button);
    return div;
}

window.addEventListener("load", loadCaptcha, false);
