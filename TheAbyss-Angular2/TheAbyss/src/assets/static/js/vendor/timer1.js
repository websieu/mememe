$(function(){
    function timer1(settings){
        var config = {
            endDate: $('.bonus-container-ts .ends-in').data('dt'),
            timeZone: 'UTC',
            hours: $('#hours-bonus'),
            minutes: $('#minutes-bonus'),
            seconds: $('#seconds-bonus'),
            newSubMessage: 'and should be back online in a few minutes...'
        };

        if ($('.bonus-container-ts .ends-in').length === 0) {
            return;
        }
        function prependZero(number){
            return number < 10 ? '0' + number : number;
        }
        
        $.extend(true, config, settings || {});
        var currentTime = moment();
        var endDate = moment.tz(config.endDate, config.timeZone);
        var diffTime = endDate.valueOf() - currentTime.valueOf();
        var duration = moment.duration(diffTime, 'milliseconds');
        var days = duration.days();
        var interval = 1000;
        var subMessage = $('.sub-message');
        var clock = $('.ends-in');
        if(diffTime < 0){
            endEvent(subMessage, config.newSubMessage, clock);
            return;
        }
        if(days > 0){
            $('#days-bonus').text(prependZero(days));
        }
        var timer_upd = function(){
            duration = moment.duration(duration - interval, 'milliseconds');
            var hours = duration.hours(),
                minutes = duration.minutes(),
                seconds = duration.seconds();
            days = duration.days();
            if(hours  <= 0 && minutes <= 0 && seconds  <= 0 && days <= 0){
                clearInterval(intervalID);
                endEvent(subMessage, config.newSubMessage, clock);

                window.location.reload();
            }
            if(days === 0){
                $('.bonus-container-ts .days-bonus').hide();
            }
            if(days === 0 && hours === 0){
                $('.hours-bonus').hide();
            }
            if(days === 0 && hours === 0 && minutes === 0){
                $('.minutes-bonus').hide();
            }
            $('#days-bonus').text(prependZero(days));
            config.hours.text(prependZero(hours));
            config.minutes.text(prependZero(minutes));
            config.seconds.text(prependZero(seconds));
        }
        timer_upd();
        var intervalID = setInterval(timer_upd, interval);
    }
    function endEvent($el, newText, hideEl){
        $el.text(newText);
        hideEl.hide();
    }
    timer1();
});

