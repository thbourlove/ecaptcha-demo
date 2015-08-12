<?php
function validate_captcha($captchaId, $secret) {
    function sign($unsigned) {
        static $privateKey = 'yyyy';
        return md5($privateKey.$unsigned);
    }

    function check_secret($secret) {
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => 'http://localhost:8888/captcha/validate?secret='.$secret,
        ));
        $response = curl_exec($curl);
        echo $response, "</br>";
        echo sign($secret), "</br>";
        curl_close($curl);
        return sign($secret) === $response;
    }
    echo $captchaId, "</br>";
    echo sign($captchaId), "</br>";
    echo $secret, "</br>";

    return sign($captchaId) === $secret && check_secret($secret);
}

$data = $_POST;
$captchaId = $data['captchaId'];
$secret = $data['secret'];

if (validate_captcha($captchaId, $secret)) {
    echo 'success';
} else {
    echo 'failed';
}
