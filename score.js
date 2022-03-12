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

//Embed médií
$(document).ready(function () {
    const checkIfIsMobile = false //Změň false na true pokud chceš vypnout embedování na mobilu
    const isMobile = Math.min(window.screen.width, window.screen.height) < 768 || navigator.userAgent.indexOf("Mobi") > -1;
    if (checkIfIsMobile && isMobile) {
        return;
    }
    let body = $('body');

    // $('a[href*="imgur.com"]')
    //     .each(function () {
    //         let url = new URL(this.href);
    //         let split = url.pathname.split('/');
    //         let id = split[split.length - 1];
    //
    //         $(this).wrap('<blockquote class="imgur-embed-pub" lang="en" data-id="a/' + id + '" ></blockquote>');
    //     });
    // body.append('<script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>');

    $('a[href*="youtube.com"]')
        .each(function () {
            let params = (new URL(this.href)).searchParams;
            let id = params.get('v');

            $(this).replaceWith('<iframe width="224" height="126" src="https://www.youtube.com/embed/' + id + '" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
        });

    $('a[href*="youtu.be"]')
        .each(function () {
            let url = new URL(this.href);
            let split = url.pathname.split('/');
            let id = split[split.length - 1];

            $(this).replaceWith('<iframe width="224" height="126" src="https://www.youtube.com/embed/' + id + '" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
        });


    $('a[href*="twitter.com"]')
        .each(function (index) {
            this.href = this.href.replace(/mobile\.twitter\.com/, "twitter.com");
            this.href = this.href.replace(/m\.twitter\.com/, "twitter.com");
            $(this).wrap('<div  class="twitter-embed-outer"><div class="twitter-embed" id="twitter-embed-' + index + '" style=""><blockquote  class="twitter-tweet" data-dnt="true"></blockquote></div></div>');
        });

    let sizeCache = [];
    interval = setInterval(function () {
        $('.twitter-embed').each(function () {
            let previousHeight = sizeCache[this.id] ?? 0;
            this.style.height = 'auto';
            let currentHeight = parseInt(this.getBoundingClientRect().height);

            console.log(previousHeight, currentHeight);
            if (previousHeight < currentHeight) {
                let adjustedHeight = parseInt(currentHeight * 0.6);
                this.style.height = adjustedHeight + 'px';
                sizeCache[this.id] = adjustedHeight;

                $(this).parent().height(adjustedHeight);
            }
        });
    }, 1000);

    setTimeout(function () {
        clearInterval(interval)
    }, 90 * 1000);

    body.append('<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> ');

});


