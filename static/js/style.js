$(document).ready(function() {

    var adjustNavbar = _.throttle(function() {
        navbar = $('#navbar');
        if ($(window).height() - $('#navbar .navbar-inner').height() < $(window).scrollTop()) {
            navbar.addClass('fix-top');
            navbar.nextAll().first().addClass('replace-top');
        } else if ($(window).height() - $('#navbar .navbar-inner').height() > $(window).scrollTop()) {
            navbar.removeClass('fix-top');
        }
    }, 10)

    var adjustGameInfo = _.throttle(function () {
        var mtop = $(window).scrollTop();

        var jh = $('div.game-info').outerHeight();
        var th = $('div.gamegrid').innerHeight();

        var jtop = $('div.game-info').offset().top;
        var ttop = $('div.gamegrid').offset().top;
        var jbot = jtop + jh;
        var tbot = ttop + th;

        var dtop = ttop-mtop;
        var dbot = tbot-mtop-jh;

        var n = ($(window).height() - jh)/2;

        if(dtop < n) {
            var d = (n-dtop)
            var hd =  th-jh
            if ((dbot > n || jbot < tbot || parseInt($('div.game-info').css('top'),10) >  d) && d < hd) {
                $('div.game-info').css('top', d);
            } else if (hd > 0) {
                $('div.game-info').css('top', hd);
            }
        } else {
            $('div.game-info').css('top', 0);
        }
    }, 10);

    $(window).scroll( function() {
        adjustNavbar();
        adjustGameInfo();
    });

    var setSizes = _.debounce(function () {
        $("div.game-info").css("height", ($(window).height()-$("header.navbar").height())*.8);
    }, 100);

    function onWindowLoad() {
        setSizes();
    }

    function onWindowResize() {
        setSizes();
    }

    $(window).load(onWindowLoad);
    $(window).resize(onWindowResize);

});
