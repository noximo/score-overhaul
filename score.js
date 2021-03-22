//Změna vzhledu
$(document).ready(function () {
    let timeNow = function () {
        var date = new Date();
        return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    }
    const updateVisited = function () {
        const visited = JSON.parse(window.localStorage.getItem("visited")) || [];
        const fourthTable = $("#fourthTable");
        fourthTable.empty();
        for (let i = 0; i < visited.length; i++) {
            fourthTable.append(visited[i]);
        }
    };
    let room = false;
    let totalUnread = 0;
    if (window.location.href.indexOf("room") > -1 || window.location.href.indexOf("inbox") > -1 || window.location.href.indexOf("user") > -1) {
        room = true;
    }
    $("meta[name='theme-color']").attr('content', '#94ada5');
    if (room) {
        window.scrollTo(0, $('.room-name').first().offset().top);
    } else {
        const time = 1000 * 60;
        setTimeout('window.location.reload();', time);
        $('#content').append('<span style="float: right;">last refresh: <b>' + timeNow() + '</b></span>');

        let inboxNewMessages = $('span.inbox-new-messages');
        if (inboxNewMessages.first().text() !== '0') {
            inboxNewMessages.addClass('new');
        }

        const secondTable = $('.room-list').last();
        secondTable.after("<hr><table id='thirdTable' class='room-list hidden-table'/>");
        const thirdTable = $('.room-list').last();
        thirdTable.after("<hr><table id='fourthTable' class='room-list hidden-table'/>");
        $('.unread .post-count').each(function () {
            const e = $(this);
            const count = e.text();
            // noinspection EqualityComparisonWithCoercionJS
            if (count != parseInt(count) && parseInt(count) > 0) {
                e.parent().parent().addClass('really-unread');
                e.parent().prev().children().first().prepend(parseInt(count) + "|");
                totalUnread++;
            }
            // noinspection EqualityComparisonWithCoercionJS
            if (parseInt(count) == count) {
                const row = e.parent().parent();
                row.addClass('never-read');
                row.appendTo(thirdTable);
            }
        });
        updateVisited();
        document.title = "(" + totalUnread + ") Score Phorum v4.0";
    }
    $('.room-list a').mousedown(function () {
        const visited = JSON.parse(window.localStorage.getItem("visited")) || [];
        const row = $(this).parent().parent().clone();
        row.removeClass();
        row.addClass('last-visited');
        row.find(".last-message-time").text("| " + timeNow());
        const item = row.prop('outerHTML');
        visited.unshift(item);
        visited.length = Math.min(5, visited.length);
        window.localStorage.setItem("visited", JSON.stringify(visited));
        updateVisited();
    });
});

//Skrývání uživatelů
$(document).ready(function () {
    const hideUsers = ["tvoje-mama"];

    hideUsers.forEach(function (user) {
        $('.message .recipient:contains("' + user + '")').each(function () {
            hideMessage($(this).parents('.message'));
        });
        $('.message[data-author="' + user + '"]').each(function () {
            hideMessage($(this));
        });
    });

    function toggleMessage(message) {
        message.find('.send-reply, .text, [class^=level]').toggle();

        message.toggleClass('messageOffset');
        message.toggleClass('messageHidden');
        message.find('.toggleMessage').toggleClass('toggleOffset');
    }

    function hideMessage(message) {
        if (message.hasClass('messageHidden')) {
            return;
        }
        message.addClass('messageHidden');
        message.find('[class^=level]').attr('style', 'top:0;position:relative;');
        message.find('.send-reply,.text, [class^=level]').hide();

        let toggle = $('<div class="toggleMessage">👁</div>');

        toggle.click(function () {
            toggleMessage(message);
        });
        message.find('.avatar').prepend(toggle);
    }
});

//Embed tweetů
$(document).ready(function () {
    $('a[href*="twitter.com"]')
        .each(function () {
            this.href = this.href.replace(/mobile\.twitter\.com/, "twitter.com");
        })
        .wrap('<blockquote class="twitter-tweet"></blockquote>');

    $('body').append('<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>');
});


