// enable/disable actions
var enableAutoRefresh = true; // enable room autorefresh
var autoRefreshTime = 5; // auto refresh time (in minutes)
var autoRefreshShowTime = true; // show last refresh time in footer
var enableMessageHighlight = true; // highlight new messages

$(document).ready(function () {
    var room = false;
    if (window.location.href.indexOf("room") > -1) {
        room = true;
    }

    if (enableAutoRefresh && !room) {
        var time = autoRefreshTime * 1000 * 60;
        setTimeout('window.location.reload();', time);
        if (autoRefreshShowTime) {
            var item = new Date();
            timeNow = item.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
            $('#content').append('<span style="float: right;">last refresh: <b>' + timeNow + '</b></span>');
        }
    }
    if (enableMessageHighlight) {
        if ($('span.inbox-new-messages').first().text() != '0') {
            $('span.inbox-new-messages').addClass('new');
        }
    }

    $('.unread .post-count').each(function (i) {
        var e = $(this);
        var count = e.text();
        if (count != parseInt(count) && parseInt(count) > 0) {
            e.parent().parent().addClass('really-unread');
            e.parent().prev().children().first().prepend(parseInt(count) + "|");
        }
        if (parseInt(count) == count) {
            e.parent().parent().addClass('never-read');
        }
    });

    if (room) {
        window.scrollTo(0, $('.room-name').first().offset().top);
    }
});
