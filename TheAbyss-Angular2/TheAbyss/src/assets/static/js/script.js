$.ajaxSetup({ headers: { 'X-CSRFToken': csrf_token } });

window.legacyApi = window.legacyApi || {};
window.legacyApi.openModal = function (targetId, bonus) {
    $("body").addClass('modal-open');
    showModalWin(targetId);

    setTimeout(function () { $('#' + targetId + ' input[type!=hidden]:first').focus() }, 300);

    if (targetId == 'register-modal' && bonus && $('#' + targetId + ' input[name=bonus]').length == 0) {
        $('#' + targetId + ' form').append('<input name="bonus" value="true" type="hidden"/>');
    }
};

var getUrlParameter = function getUrlParameter(sParam) {
    //https://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function onRecaptchaLoad() {
    if (!recaptcha_enabled)
        return;

    // Force recaptcha
    $('.recaptcha[data-force]').each(function (index, item) {
        captcha_id = grecaptcha.render(
            $(item)[0],
            {
                sitekey: recaptcha_id,
                theme: 'light'
            }
        );
    });
}

function selectAndCopy(el) {
    // Copy textarea, pre, div, etc.
    if (document.body.createTextRange) {
        // IE
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
        return textRange.execCommand("Copy");
    } else if (window.getSelection && document.createRange) {
        // non-IE
        var editable = el.contentEditable; // Record contentEditable status of element
        var readOnly = el.readOnly; // Record readOnly status of element
        el.contentEditable = true; // iOS will only select text on non-form elements if contentEditable = true;
        el.readOnly = false; // iOS will not select in a read only form element
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range); // Does not work for Firefox if a textarea or input
        if (el.nodeName == "TEXTAREA" || el.nodeName == "INPUT")
            el.select(); // Firefox will only select a form element with select()
        if (el.setSelectionRange && navigator.userAgent.match(/ipad|ipod|iphone/i))
            el.setSelectionRange(0, 999999); // iOS only selects "form" elements with SelectionRange
        el.contentEditable = editable; // Restore previous contentEditable status
        el.readOnly = readOnly; // Restore previous readOnly status
        if (document.queryCommandSupported("copy")) {
            return document.execCommand('copy');
        }
    }

    return false;
}

// Lazy loads
// $(window).on("load", function() {
// });

//  MODAL
function achtung(msg) {
    var $modal = $('#modal-dialog');
    var $msg = $modal.find('#' + msg);
    if ($msg.length == 0) $msg = $modal.find('#default');

    $modal.find('.message').hide();
    $modal.fadeIn();
    $msg.show();
}

var captcha_id = null;

function modalError($form, err_msg_id) {
    if (recaptcha_enabled) {
        if (captcha_id != null) {
            grecaptcha.reset(captcha_id);
        }

        $('.recaptcha[data-force]').each(function (index, item) {
            // HAX
            grecaptcha.reset(index);
        });

        if ($form.find('.recaptcha > div').length == 0 && err_msg_id == 'captcha_required') {
            captcha_id = grecaptcha.render(
                $form.find('.recaptcha')[0],
                {
                    sitekey: recaptcha_id,
                    theme: 'light'
                }
            );
            return;
        } else if (err_msg_id == 'captcha_required') {
            return;
        }
    }

    var $err_field = $form.find('div.hidden-alert.' + err_msg_id);
    if (!$err_field.length) {
        $err_field = $form.find('div.hidden-alert[data-for="default"]');
    }
    showContextAlert($err_field);
}

function hideContextAlerts() {
    $('form .hidden-alert').css('visibility', 'hidden').slideUp(150);
}

function showContextAlert($alert) {
    $alert.slideDown(150).css({ visibility: 'visible', opacity: 0 }).animate({ opacity: 1.0 });
}

function showModalWin(modal_id) {
    var $modals = $('.modal-dialog');
    $modals.fadeOut();
    $modals.find('input').not('[type="hidden"]').not('.noclear').not('[type="checkbox"]').val('');
    $modals.find('textarea').not('.noclear').val('');
    hideContextAlerts();
    $('#' + modal_id).fadeIn();
    if (isIos()) {
        document.body.style.position = "fixed";
    }
}

function hideModal(modalId) {
    $("body").removeClass('modal-open');
    $('#' + modalId).fadeOut();
    document.body.style.position = '';
}

function isIos() {
    var iOS = /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    return iOS;
}

//Function main
var SCRIPT = (function () {
    return {
        show: function () {
            var showPhished = localStorage.getItem('showPhished-block');
            var topRules = localStorage.getItem('topRules');

            if (showPhished === '1') {
                $('.phished-block').remove();
            }
        },
        STICKY: function () {
            // STICKY NAVBAR
            window.onscroll = function () { scrollFunction() };
            scrollFunction();

            function scrollFunction() {
                if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                    $("nav.sticky").addClass('scrolled');
                } else {
                    $("nav.sticky").removeClass('scrolled');
                }
            }

            $('.burger').on('click', function () {
                $(this).toggleClass('change');
            });
            $(".overlay a").on('click', function () {
                $('.burger').removeClass('change');
            });
            $('.burger').on('click', function () {
                $("#overlay").toggleClass('window');
                $("body").toggleClass('modal-open');
            });
            $('.overlay-content a').on('click', function () {
                $("#overlay").toggleClass('window');
                $("body").toggleClass('modal-open');
            });

            $('.phished-block .close-icon').on('click', function () {
                localStorage.setItem('showPhished-block', '1');
                $('.sticky').animate({ 'padding-top': 10 }, 200);
                $('.phished-block').slideUp(300, function () {
                    $(this).remove();
                });
            });

            var sliders = {
                init() {
                    var self = this;
                    self.fn = function () {
                        var width = window.innerWidth && document.documentElement.clientWidth ?
                            Math.min(window.innerWidth, document.documentElement.clientWidth) :
                            window.innerWidth ||
                            document.documentElement.clientWidth ||
                            document.getElementsByTagName('body')[0].clientWidth;
                        if (width <= 1024) {
                            teamMob();
                            window.removeEventListener('resize', self.fn);
                        }
                    };
                    window.addEventListener('resize', self.fn);
                    self.fn();
                }
            };

            sliders.init();

            // SLIDERS
            function teamMob() {
                if ($('.team-mob .slider2').length > 0) {
                    $('.team-mob .slider2').slick({
                        slidesToShow: 5,
                        slidesToScroll: 1,
                        autoplay: true,
                        autoplaySpeed: 3500,
                        arrows: false,
                        swipeToSlide: true,
                        dots: true,
                        responsive: [
                            {
                                breakpoint: 1023,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1,
                                    rows: 1,
                                    dots: true
                                }
                            },
                            {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1,
                                    rows: 1,
                                    dots: true
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    rows: 1,
                                    dots: true
                                }
                            }

                        ]
                    });
                }
            }

            // SMOOTH SCROLL
            $(document).on('click', 'a.smooth-scroller[href^="#"]', function (event) {
                event.preventDefault();

                var stickyHeaderHeight = $('.sticky').height() + 70; // + margin-top

                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset().top - stickyHeaderHeight
                }, 500);

            });

            // Mobile scroll
            $(document).on('click', '.overlay a[href^="#"].item', function (event) {
                event.preventDefault();

                var stickyHeaderHeight = $('.sticky').height() + 20; // + margin-top

                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset().top - stickyHeaderHeight
                }, 0);
            });


            // ACCORDION
            var acc = $(".accordion").not('.disabled');
            var i;

            for (i = 0; i < acc.length; i++) {
                acc[i].onclick = function () {

                    this.classList.toggle("active");

                    var panel = this.nextElementSibling;
                    if (panel.style.display === "block") {
                        panel.style.display = "none";
                    } else {
                        panel.style.display = "block";
                    }
                }
            }


            $('.modal-dialog .close-modal').not('[data-dont-touch-me-with-jquery]').click(function (event) {
                $("body").removeClass('modal-open');
                $(this).closest('.modal-dialog').fadeOut();
                document.body.style.position = '';
            });
            $('.modal-content').not('[data-dont-touch-me-with-jquery]').click(function (event) { event.stopPropagation(); });
            $('.modal-dialog').not('[data-dont-touch-me-with-jquery]').not('#wallet_unbinded').click(function (event) {
                $("body").removeClass('modal-open');
                $('.modal-dialog').fadeOut();
                document.body.style.position = '';
            });
            $('input').on('input', function (event) { hideContextAlerts(); });


            $('.modal-opener-btn').not('[data-dont-touch-me-with-jquery]').click(function () {
                window.legacyApi.openModal($(this).data('target'), $(this).data('bonus'));
            });

            hideContextAlerts();

            $('#message-modal form').on('submit', function () { return false; });

            $('#register-modal button').on('click', function () {
                var is_agreed = $('input.check').prop('checked');
                if (!is_agreed) {
                    $('.checkmark').addClass('error');
                    return false;
                }
            });
            $('.check').on('click', function () {
                $('.checkmark').removeClass('error');
            })

            $('.events .modal-opener-btn').on('click', function () {
                $('.events img:not([src])').each(function () {
                    $(this).attr('src', $(this).data('src'));
                })
            });

            //    overlay
            $('.overlay').on('click', function () {
                $(this).siblings('.gallery-modal').find('.gallery-slider').slick({
                    dots: false,
                    arrows: true,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 1,
                    adaptiveHeight: true

                });
            })

            $('body.maintenance .modal-opener-btn').on('click', function (event) {
                event.stopImmediatePropagation();
                $('.modal-dialog').hide();
                $('#maintenance-modal').fadeIn();
                event.preventDefault();
                return false;
            });

            var copiedMsgTimer = null;
            $('a.copy-ref').on('click', function () {
                if (copiedMsgTimer != null)
                    clearTimeout(copiedMsgTimer);
                if (selectAndCopy($('.ref-link')[0])) {
                    $('.right .copied').show();
                    copiedMsgTimer = setTimeout(function () {
                        $('.right .copied').fadeOut();
                    }, 1000);
                }
                return false;
            })
            $('a.copy-abi').on('click', function () {
                if (copiedMsgTimer != null)
                    clearTimeout(copiedMsgTimer);
                if (selectAndCopy($('.abi-json')[0])) {
                    $('.copied-msg').show();
                    copiedMsgTimer = setTimeout(function () {
                        $('.copied-msg').fadeOut();
                    }, 1000);
                }
                return false;
            })

            // SWITCHER
            $('.pie-switch .slider').on('click', function () {
                $(this).toggleClass('on');
                if (!$(this).hasClass('on')) {
                    $('.tokens img.soft').show();
                    $('.tokens img.hard').hide();
                    $('.tokens .switcher .hard').addClass('off');
                    $('.tokens .switcher .soft').removeClass('off');
                } else {
                    $('.tokens img.hard').show();
                    $('.tokens img.soft').hide();
                    $('.tokens .switcher .soft').addClass('off');
                    $('.tokens .switcher .hard').removeClass('off');
                }

            });
            $('.cap-switch .slider').on('click', function () {
                $(this).toggleClass('on');
                if ($(this).hasClass('on')) {
                    $('.details .us-details').show();
                    $('.details .international-details').hide();
                    $('.details .switch .international').addClass('off');
                    $('.details .switch .us').removeClass('off');
                } else {
                    $('.details .international-details').show();
                    $('.details .us-details').hide();
                    $('.details .switch .us').addClass('off');
                    $('.details .switch .international').removeClass('off');
                }

            });

            $('.switch-tables div').on('click', function () {
                if ($(this).hasClass('platform-on')) {
                    if (!$(this).hasClass('on')) {
                        $('.platform-table').show();
                        $('.blockchain-table').hide();
                        $(this).addClass('on');
                        $('.blockchain-on').removeClass('on');
                    }
                } else {
                    if (!$(this).hasClass('on')) {
                        $('.platform-table').hide();
                        $('.blockchain-table').show();
                        $(this).addClass('on');
                        $('.platform-on').removeClass('on');
                    }
                }
            })

            if ($('.news-carousel').length > 0) {
                $('.news-carousel').slick({
                    infinite: false,
                    centerMode: false,
                    centerPadding: '60px',
                    slidesToShow: 5,
                    responsive: [
                        {
                            breakpoint: 769,
                            settings: {
                                infinite: false,
                                arrows: false,
                                centerMode: true,
                                centerPadding: '100px',
                                slidesToShow: 1
                            }
                        },
                        {
                            breakpoint: 627,
                            settings: {
                                infinite: false,
                                arrows: false,
                                centerMode: true,
                                centerPadding: '60px',
                                slidesToShow: 1
                            }
                        },
                        {
                            breakpoint: 426,
                            settings: {
                                infinite: false,
                                arrows: false,
                                centerMode: true,
                                centerPadding: '40px',
                                slidesToShow: 1
                            }
                        },
                        {
                            breakpoint: 380,
                            settings: {
                                infinite: false,
                                arrows: false,
                                centerMode: true,
                                centerPadding: '20px',
                                slidesToShow: 1
                            }
                        }
                    ]
                });
            }



            $(window).scroll(function () {
                if ($(this).scrollTop() > 0) {
                    $('#up-sidenav').fadeIn();
                } else {
                    $('#up-sidenav').hide();
                }
            });
            $('#up-sidenav').click(function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 400);
                return false;
            });

            $('.unicorn-hello .close').on('click', function () {
                $('.unicorn-hello').fadeOut()
            })

        },
        video: function () {
            var iframe = $('.video-wrapper.dt iframe');

            if (window.Vimeo && iframe.length > 0) {
                var player = new Vimeo.Player(iframe);
                player.pause();
                $('.video-wrapper.dt').css('display', 'none')
                $('.video-open-btn.dt').on('click', function () {
                    $('.video-wrapper.dt').show()
                    player.play()
                    $("body").addClass('modal-open');
                })
                $('.video-wrapper.dt .close-video').on('click', function () {
                    $("body").removeClass('modal-open');
                    $('.video-wrapper.dt').hide()
                    player.pause()
                })
            }
        },
        iframe: function () {
            var iframe = $('.video-wrapper.mob iframe');
            if (window.Vimeo && iframe.length > 0) {
                var player = new Vimeo.Player(iframe);
                player.pause();
                $('.video-wrapper.mob').css('display', 'none')
                $('.video-open-btn.mob').on('click', function () {
                    $('.video-wrapper.mob').show()
                    player.play()
                    $("body").addClass('modal-open');
                })
                $('.video-wrapper.mob .close-video').on('click', function () {
                    $("body").removeClass('modal-open');
                    $('.video-wrapper.mob').hide()
                    player.pause()
                })
            }
        },
        view: function () {
            var view = getUrlParameter('view');

            if (view == 'support') {
                $('#msg_type').val('support');
                showModalWin('support-modal');
            };
        },
        scroll: function () {
            $(window).on('scroll', function () {
                if ($(window).scrollTop() < 50) {
                    $('.mouse-scroll').fadeIn()
                } else {
                    $('.mouse-scroll').fadeOut()
                }
            })
        },
        init: function () {
            this.show(), this.STICKY(), this.video(), this.iframe(), this.video(), this.scroll();
        }
    }
})(SCRIPT || {});

