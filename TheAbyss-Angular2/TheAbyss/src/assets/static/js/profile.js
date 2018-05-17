function serializeProfileForm() {
    var data = {
        participate: $('#profile_form input[name="participate"]').is(':checked'),
        nickname: $('#profile_form input[name="nickname"]').val()
    };
    return data;
};

function submitProfileForm() {
    var data = serializeProfileForm();
    $('#profile_form .saved').removeClass('show');
    $.ajax('/api/user/profile', {
        type: 'put',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function () {
            flashSuccessText();
        },
        error: function (xhr, status, errorThrown) {
            var error = xhr.responseJSON;
            if (!error) {
                showErrorDialog('Oops, error occured');
            } else if (error.message) {
                showErrorDialog(error.message);
            } else if (error.nickname) {
                $('.input-wrapper .hidden-alert').html(error.nickname[0]);
                showContextAlert($('.input-wrapper .hidden-alert'));
            }
        }
    });
};

function showErrorDialog(message) {
    console.log(message);
};

function flashSuccessText() {
    $('#profile_form .saved').addClass('show');
};

function addRemoveButton() {
    $('#remove-avatar-wrapper').show();
};

function delRemoveButton() {
    $('#remove-avatar-wrapper').hide();
};

function setLoading(loading) {
    if (loading) {
        $('.avatar-img > .loader').addClass('on');
    } else {
        $('.avatar-img > .loader').removeClass('on');
    }
}

function removeAvatar() {
    $('#avatar-img-wrapper').empty();
}

function setAvatar(image) {
    $('#avatar-img-wrapper').html('<img src="' + image + '">');
}

var PROFILE = (function () {
    return {
        init: function () {
            $('input[name="nickname"]').on('input', function () {
                hideContextAlerts();
            });
            $('.nickname_is_set').on('click', function (e) {
                e.preventDefault();
                submitProfileForm();
            });
            $('#profile_form').on('submit', function (e) {
                e.preventDefault();
                submitProfileForm();
            });

            var $image = $('#avatar-image');
            var imageFile = null;
            var uploadCrop = null;

            $('#remove-avatar-wrapper').on('click', '.remove-avatar', function (e) {
                e.preventDefault();
                $.ajax('/api/user/avatar', {
                    type: 'delete',
                    beforeSend: function () {
                        setLoading(true);
                    },
                    complete: function () {
                        setLoading(false);
                    },
                    success: function (data) {
                        removeAvatar();
                        delRemoveButton();
                    }
                });
            });
            $('.change-avatar').on('click', function () {
                $('#avatarInput').trigger('click');
            });
            $('#avatarInput').change(function () {
                if (uploadCrop) {
                    uploadCrop.destroy();
                    uploadCrop = null;
                };
                if (this.files && this.files[0]) {
                    imageFile = this.files[0];
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $image.attr('src', e.target.result);
                        showModalWin('avatar-modal');
                        $('body').addClass('modal-open');
                        uploadCrop = new Croppie(document.getElementById('avatar-image'), {
                            enforceBoundary: true,
                            enableExif: true,
                            viewport: {
                                width: 200,
                                height: 200,
                                type: 'circle'
                            },
                            boundary: {
                                width: 300,
                                height: 300
                            },
                            update: function (croppe) {
                                $('.avatar-form input[name=crop_data]').val(JSON.stringify(croppe.points));
                            },
                        });
                    }
                    reader.readAsDataURL(this.files[0]);
                }
            });
            $('.avatar-form').on('submit', function (e) {
                e.preventDefault();
                hideModal('avatar-modal');
                var data = new FormData();
                data.append('file', imageFile);
                data.append('cropData', $('.avatar-form input[name=crop_data]').val());
                $.ajax('/api/user/avatar', {
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                        setLoading(true);
                    },
                    complete: function () {
                        setLoading(false);
                    },
                    success: function (data) {
                        setAvatar(data.avatar);
                        addRemoveButton();
                    },
                    error: function (xhr, status, errorThrown) {
                        if (xhr.status == 400) {
                            var field = Object.keys(xhr.responseJSON)[0];
                            var msg = xhr.responseJSON[field];
                            $('#upload-error-modal .error-message-wrapper').html('<p>' + msg + '</p>');
                            showModalWin('upload-error-modal');
                            $('body').addClass('modal-open');
                        }
                    }
                });
            });
        }
    }
})(PROFILE || {});