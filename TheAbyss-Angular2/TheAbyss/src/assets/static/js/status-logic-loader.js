
function checkStatuses() {
    $.ajax({
        type: 'GET',
        url: '/api/kyc/getstatuses',
        success: function (data) {
            window.legacyApi.onStatusReceived(data);
        },
        error: function (xhr, str) {
            console.log('Возникла ошибка: ' + xhr.responseCode + "\n" + str);
        }
    });
}


$(function() {
    if($('#logout_btn').length)  {
        checkStatuses();
    }
});

