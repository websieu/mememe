window.legacyApi = window.legacyApi || {};

window.legacyApi.onStatusReceived = function(response) {
    var goTelegramm = Cookies.get("goTelegramm");
    var showGoTelegramm = false;

    if ( response.tgbot !== "completed") {
        if (typeof(goTelegramm) == 'undefined') {

            Cookies.set("goTelegramm", 1, {   expires : 2,   path    : '/' });
            showGoTelegramm = true;

        } else {
            goTelegramm = Number(goTelegramm)+1;
            Cookies.set("goTelegramm", goTelegramm, {   expires : 2,   path    : '/' });
            showGoTelegramm = (goTelegramm > 3)? false:true;
        }
    }
    var showGoKYC = false;
    if (!showGoTelegramm && response.tgbot == 'completed' && response.kyc == 'available') {
        var goKYC = Cookies.get("goKYC");
        if (typeof(goKYC) == 'undefined' ) {
            Cookies.set("goKYC", 1, {   expires : 1,   path    : '/' });
            showGoKYC = true;
        } else {
            goKYC = Number(goKYC)+1;
            Cookies.set("goKYC", goKYC, {   expires : 1,   path    : '/' });
            showGoKYC = (goKYC > 3)? false:true;
        }
    }
    if (showGoTelegramm) {
        $('.unicorn-lk').removeClass('hidden')
    }
    if (showGoKYC) {
        $('.unicorn-index').removeClass('hidden')
        $('.unicorn-lk').addClass('hidden')
    }



    $('.unicorn-hello .close').on('click', function () {
        $('.unicorn-hello').fadeOut()
        if(!$('.unicorn-index').hasClass('hidden')) {
            Cookies.set("goKYC", 4, {   expires : 365,   path    : '/' });
        } else {
            Cookies.set("goTelegramm", 2, {   expires : 365,   path    : '/' });
        }


    })

    if(!$('body').hasClass('account')) {
        return;
    }

    if ((response.tgbot === "completed") && (response.bonus !== 'enabled')) {
        $('.telegram-bot-activated').removeClass('hidden');
    } else if ((response.tgbot == "started") && (response.bonus !== 'enabled')) {
        $('.telegram-bot-processing').removeClass('hidden');
    } else if (response.bonus !== 'enabled') {
        $('.telegram-bot-none').removeClass('hidden');
    }
    if (response.kyc !== 'disabled') {
        //нарисовать кнопку запуска визарда KYC
        if (response.kyc == 'unavailable') {
            $('.thin').removeClass('hidden');
        } //KYC in progress
        if (response.kyc == 'applied') {
            $('.kyc-button2').removeClass('hidden');
            $('.docs-applied').removeClass('hidden');
        } //KYC in progress
        if (response.kyc == 'accepted') {
            $('.kyc-button6').removeClass('hidden');
            $('.docs-accepted').removeClass('hidden');
        } //KYC in progress
        if (response.kyc == 'rejected') {
            $('.rejected-reason-main').removeClass('hidden');
            $('.rejected-reason').html(response.kyc_reason.replace(/\n/g, '<br />')).removeClass('hidden')
        } //KYC faild - ask support
        if (response.kyc == 'failed') {
            $('.kyc-button4').removeClass('hidden');
        } //KYC faild - ask support
        if (response.kyc == 'completed') {
            // KYC продейн успешно пользователь не инвестор
            $('.kyc-status').removeClass('hidden');
            if (response.tgbot === "completed" && response.kyc === "completed" && response.wallet  && response.wallet.type_valid) {

                switch (response.bonus) {
                    case 'disabled':
                        $('.telegram-bot-activated').addClass('hidden');
                        $('.telegram-quiz-ready').removeClass('hidden');
                        break;
                    case 'started':
                        $('.telegram-bot-activated').addClass('hidden');
                        break;
                    case 'enabled':
                        $('.telegram-bot-activated').addClass('hidden');
                }

             }
        }
    }
    $('.kyc-in-progress-btn').on('click', function () {
        $('.kyc-button1').addClass('hidden');
        $('.kyc-button2').removeClass('hidden');
    })
}
