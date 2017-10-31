// enable/disable actions
var enableMeanMenu = true; // enable MeanMenu - hamburger menu for mobile
var enableEasySend = true; // enable sending by ctrl+enter
var enableLightbox = true; // enable lightbox
var enableAutoRefresh = true; // enable room autorefresh
var autoRefreshTime = 1; // auto refresh time (in minutes)
var autoRefreshShowTime = true; // show last refresh time in footer
var enableTinyMce = false; // not working at the moment
var enableThemeColor = true; // change theme color for android chrome
var enableMessageHighlight = true; // highlight new messages

$(document).ready(function () {
    var updateVisited = function () {
        var visited = JSON.parse(window.localStorage.getItem("visited")) || [];
        var fourthTable = $("#fourthTable");
        fourthTable.empty();
        for (var i = 0; i < visited.length; i++) {
            fourthTable.append(visited[i]);
        }
    };

    var room = false;
    var totalUnread = 0;
    if (window.location.href.indexOf("room") > -1 || window.location.href.indexOf("inbox") > -1 || window.location.href.indexOf("user") > -1) {
        room = true;
    }

    if (enableThemeColor) {
        $("meta[name='theme-color']").attr('content', '#94ada5');
    }

    if (room) {
        window.scrollTo(0, $('.room-name').first().offset().top);
    } else {
        if (enableAutoRefresh) {
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
        var secondTable = $('.room-list').last();
        secondTable.after("<hr><table id='thirdTable' class='room-list hidden-table'/>");
        var thirdTable = $('.room-list').last();
        thirdTable.after("<hr><table id='fourthTable' class='room-list hidden-table'/>");
        $('.unread .post-count').each(function (i) {
            var e = $(this);
            var count = e.text();
            if (count != parseInt(count) && parseInt(count) > 0) {
                e.parent().parent().addClass('really-unread');
                e.parent().prev().children().first().prepend(parseInt(count) + "|");
                totalUnread++;
            }
            if (parseInt(count) == count) {
                var row = e.parent().parent();
                row.addClass('never-read');
                row.appendTo(thirdTable);
            }
        });

        updateVisited();

        document.title = "(" + totalUnread + ") Score Phorum v4.0";
    }

    $('.room-list a').mousedown(function () {

        var visited = JSON.parse(window.localStorage.getItem("visited")) || [];
        var row = $(this).parent().parent().clone();
        row.removeClass();
        row.addClass('last-visited');

        row.find(".last-message-time").text("| " + new Date().toISOString().slice(11, 19) );

        var item = row.prop('outerHTML');
        visited.unshift(item);
        visited.length = Math.min(5, visited.length);

        window.localStorage.setItem("visited", JSON.stringify(visited));

        updateVisited();
    });


});
