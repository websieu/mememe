function mountProgressBars() {
    mountProgressBar($('#pgBarETH'), $('#pgBarETH').data('progress'));
    mountProgressBar($('#pgBarBNB'), $('#pgBarBNB').data('progress'));
}

function mountProgressBar(parent, amt) {
    if (parent.length == 0) {
        return;
    }
    var thold = 0.2;
    var $dependentCaption = $('[data-pb="inner"]', parent)[0];
    var $caption = $('[data-pb="outer"]', parent)[0];

    var $fill = $('.progressBar__fill', parent)[0];

    $fill.style.width = (amt * 100).toFixed(2) + "%";

}

function setCookie(name, value, seconds) {
    var expires = "";
    if (seconds) {
        var date = new Date();
        date.setTime(date.getTime() + (seconds * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

window.setCookie = setCookie;
window.getCookie = getCookie;

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function remove_hash_from_url() {
    var uri = window.location.toString();
    if (uri.indexOf("#") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("#"));
        window.history.replaceState({}, document.title, clean_uri);
    }
}

function messageModal(msg_id) {
    $('.modal-dialog').fadeOut();
    $modal = $('#message-modal');
    $modal.find('div.text').hide();
    $modal.find('div.text.' + msg_id).show();
    $modal.fadeIn();
}

function service_failed_cb(jqxhr, textStatus, error) {
    achtung('service_temporarily_unavailable');
}

function subscr_confirm(hash) {
    $.getJSON("/api/subscription/confirm/" + hash, function (data) {
        achtung('subscription_confirmed');
    }).fail(function (jqxhr, textStatus, error) {
        if (jqxhr.status == 404) {
            achtung('not_found');
        }
    });
}

function unsubscribe(hash) {
    $.getJSON("/api/subscription/del/" + hash, function (data) {
        achtung('unsubscribed');
    }).fail(function (jqxhr, textStatus, error) {
        if (jqxhr.status == 404) {
            achtung('not_found');
        }
    });
}

function reg_confirm(hash) {
    $.getJSON("/api/user/confirm_registration/" + hash, function (data) {
        $('#login-modal').fadeIn();
        remove_hash_from_url();
    }).fail(function (jqxhr, textStatus, error) {
        if (jqxhr.status == 404) {
            $('#reg-confirm-err-modal').fadeIn();
        }
    });
}

function passwd_reset(hash) {
    action = "/api/user/password/recover/" + hash;
    $('.modal-dialog').fadeOut();
    $('#password-restore-modal form').attr('action', action);
    $('#password-restore-modal').fadeIn();
}

function once_set_password(hash) {
    action = "/api/user/password/change";
    var nonce = atob((getCookie('nonce') || "").replace(/"/g, ""));
    $('.modal-dialog').fadeOut();
    $('#password-set-modal [name=old_password]').val(nonce);
    $('#password-set-modal form').attr('action', action);
    $('#password-set-modal').fadeIn();
}

function login_to_url(url) {
    $('#login-modal').fadeIn();
    window._redirectURL = decodeURIComponent(url);
}

function process_anchor() {
    var hash = window.location.hash;

    switch (hash) {
        case "#login":
            $('#login-modal').fadeIn();
            remove_hash_from_url();
            return;
        case "#setpassword":
            once_set_password(params);
            remove_hash_from_url();
            break;
    }

    var m = window.location.hash.match(/#(.*?)\/(.*)/);
    if (!m || m.length != 3) {
        return;
    }
    var act = m[1];
    var params = m[2];

    switch (act) {
        case "subscr_confirm":
            subscr_confirm(params);
            remove_hash_from_url();
            break;
        case "unsubscribe":
            unsubscribe(params);
            remove_hash_from_url();
            break;
        case "reg_confirm":
            reg_confirm(params);
            remove_hash_from_url();
            break;
        case "passwd_reset":
            passwd_reset(params);
            remove_hash_from_url();
            break;
        case "login":
            login_to_url(params);
            remove_hash_from_url();
            break;
    }
}

function subscribe(data, status) {
    $('.subscription-form input[name=email]').val('');
    if (data.status != "ok") {
        if (data.errors && (data.errors.email || data.errors.is_agree)) {
            for (var err in data.errors) {
                var err_code = data.errors[err];
                break;
            }
            achtung(err_code);
            return;
        }
        achtung("service_error");
        return;
    }
    achtung("confirmation_sent");
}

function subscribeFailed(response) {
    if (!response.status) achtung('connection_lost');
    else achtung('default');
}

function ajaxFailure($form, response) {
    if (!response.status) modalError($form, 'connection_lost');
    else if (typeof response.responseJSON != 'undefined' && response.responseJSON.status === 'error') {
        for (var element in response.responseJSON.errors) {
            return modalError($form, response.responseJSON.errors[element][0]);
        }
        modalError($form, 'default');
    }
    else modalError($form, 'default');
}

function validateApiResponse($form, data) {
    if (data.status == 'error') {
        for (var element in data.errors) {
            modalError($form, data.errors[element][0]);
        }
        return false;
    }
    return true;
}

function registerAjaxForm(formSelector, successCallback) {
    $(formSelector).ajaxForm({
        'success': function (data, status) {
            var $form = $(formSelector);
            if (validateApiResponse($form, data)) successCallback(data);
        },
        'error': function (response) {
            ajaxFailure($(formSelector), response)
        }
    });
}

function login(data) {
    var redirectTo = window._redirectURL || '/' + cur_lang + '/account';
    if (data.data.totp_enabled !== true) {
        location.href = redirectTo;
        return;
    }
    showModalWin('two-factor-auth-modal');
}

function tfa_login(data) {
    var redirectTo = window._redirectURL || '/' + cur_lang + '/account';
    location.href = redirectTo;
}

var ICO = (function () {
    return {
        init: function () {
            console.log('ICO function');
            $('.subscription-form').ajaxForm({ 'success': subscribe, 'error': subscribeFailed });
            registerAjaxForm('.login-form', login);
            registerAjaxForm('.2fa-login-form', tfa_login);
            registerAjaxForm('.register-form', function () {
                messageModal('registration_confirmed');
                if (typeof gtag != 'undefined')
                    gtag('event', 'click', { 'event_category': 'create_account' });
                if (typeof fbq != 'undefined')
                    fbq('track', 'Lead');
            });
            registerAjaxForm('.password-reset-form', function () { messageModal('password_reset_email_sent'); });
            registerAjaxForm('.password-restore-form', function () { messageModal('password_reset'); });
            registerAjaxForm('.password-set-form', function () { messageModal('password-set-form'); });
            registerAjaxForm('.support-form', function () { messageModal('support_sent'); });

            process_anchor();
            mountProgressBars();

            $('#logout_btn, .logout-btn').on('click', function () {
                $.getJSON("/api/user/logout", function (data) {
                    if (location.href.match(new RegExp("(/\w{2})?/account#?.*"))) {
                        location.href = "/";
                    } else {
                        location.reload();
                    }
                }).fail(function (jqxhr, textStatus, error) {
                    if (jqxhr.status == 404) {
                        achtung('not_found');
                    }
                });
            });
            console.log('ICO function end');
        }
    }
})(ICO || {});
