var depth = 0;
var nodes = new Array();
var end_node = null;
var conn;
var peer = null;

var initGame = function() {
    if (peer) {
        peer.destroy();
    }
    depth = 0;
    nodes = new Array();
    end_node = null;
    conn = undefined;
    peer = null;
    updateDepth();
    updateNodes();
};


$(document).ready(function() {
    updateDepth(depth, false);
    $('.opp-depth-text').text('Waiting for connection...');

    $('.loading-icon').hide();

    // Disable scrolling
    $('body').css('overflow', 'hidden');

    $('a').click(function() {
        // Get the wiki data and scroll to the game area
        if ($(this).hasClass('play-game')) {
            $('.play-game').text('Connecting...');
            $.ajax({
                url: "wiki-html",
                type: "GET",
                success: function(data) {
                    if (data['partnerid']) {
                        $('.play-game').remove();
                        getFirstPage(data);
                        scrollToTop();
                        $('body').css('overflow', 'visible');
                    } else {
                        $('.play-game').text('Waiting for partner...');
                        // TODO
                        // there's probably some jquery thing that will call a function
                        // after 30 seconds
                        $.delay(6000, function() {
                            // This is a super shady way of keeping track of state.
                            // GAME STATE
                            if ($('.play-game')) {
                                // tell user to come back later and end connection
                                $('#noPartners').modal({
                                    keyboard: true
                                });
                                terminatePeer();
                            }
                        });
                    }
                },
                error: errFn
            });
        }
    });
});

// Update the depth, send the info to the opponent if we have one.
var updateDepth = function(d, send) {
    $('.depth-num').text(d);
    if (send) {
        conn.send({"oppDepth": d});
    }
};

// Update the visited node list
var updateNodes = function() {
    $('.node-list').empty();
    $.each(nodes, function() {
        clicked_link = this.toString();
        var split_arr = clicked_link.split("/");
        var clicked_link_name = split_arr[2];
        $('.node-list').append($('<li>').append("<a class='sidebar' href='" + clicked_link + "'>" + clicked_link_name + "</a>"));
    });
};

var scrollToTop = function() {
    $('html, body').animate({
        scrollTop: $(".navbar").offset().top
    }, 1000);
};

var connect = function(c) {
    conn = c;

    // The person we are connecting to is conn.peer
    console.log(conn.peer);

    // We have connected to another person!
    $('.opp-depth-text').text("Your Opponent's Depth:");

    // The data that is sent from the other peer
    conn.on('data', function(data) {
        if (data['oppDepth']) {
            $('.opp-depth-num').text(data['oppDepth']);
        }
        if (data['oppWin']) {
            alert('Your opponent has won :(' + data['oppWin']);
            alert(data['oppWin']);
        }
    });

    conn.on('close', function(err) {
        terminatePeer();
        $.ajax({
            url: "wiki-html",
            type: "GET",
            async: false,
            success: function(data) {
                getFirstPage(data);
            },
            error: errFn
        });
        console.log(conn.peer + ' has left the server thing');
        // TODO
        // Display a modal alert telling the user that their partner has left them
        // for a younger more attractive player
        // possibly someone who is better at Wikipedia Golf
        $('#partnerDropped').modal({
            keyboard: true
        });
        initGame();
        scrollToTop();
    });
};

// When a link is clicked we want to move to the new link and
// increment our depth
var linkClicked = function(e, loc, update) {
    if (update) {
        depth++;
        updateDepth(depth, true);
        if (loc == end_node) {
            displayWin();
        }
    }
    console.log('loc is ' + loc);
    $.ajax({
        url: "wiki-html",
        type: "POST",
        data: loc,
        success: function(data) {
            $('.wiki-container').html(data);
            $("a").click(function(e) {
                disableClicks(e);
                scrollToTop();
                if ($.inArray($(this).attr('href'), nodes) === -1) {
                    linkClicked(e, $(this).attr('href'), true);
                    if (update) {
                        nodes.push($(this).attr('href'));
                        updateNodes();
                    }
                }
            });
            $(".node-list li").click(nodeItemClicked);
        },
        error: errFn
    });
};

$(document).ajaxStart(function() {
    console.log('showing');
    $('.loading-icon').show();
});
$(document).ajaxStop(function() {
    $('.loading-icon').hide();
});

var disableClicks = function(e) {
    e.preventDefault();
};

var nodeItemClicked = function(e) {
    var nodeClicked = $(this).children('a').eq(0).attr('href');
    console.log(nodeClicked);
    $.ajax({
        url: "get-html",
        type: "POST",
        data: nodeClicked,
        success: function(data) {
            console.log(data);
            $('.wiki-container').html(data);
            $("a").click(function(e) {
                disableClicks(e);
                scrollToTop();
                // If we haven't clicked on this before
                if ($.inArray($(this).attr('href'), nodes) === -1) {
                    linkClicked(e, $(this).attr('href'), true);
                    nodes.push($(this).attr('href'));
                    updateNodes();
                }
            });
            $(".node-list li").click(nodeItemClicked);
        },
        error: errFn
    });
    depth = $(this).index();
    updateDepth(depth, true);
    nodes.splice(depth + 1, nodes.length - depth);
    updateNodes();
};

// Returns false if the link does not start with the '/wiki/'
var isExternal = function(link) {
    return link.indexOf("/wiki/") !== -1;
};

var displayWin = function() {
    var data = {"oppWin": nodes};
    conn.send(data);
    alert('You made it in ' + depth + ' moves!');
};

var getFirstPage = function(data) {
    $('.wiki-container').html(data['html']);
    nodes.push(data['title']);
    updateNodes();
    end_node = data['end_node'];
    var peerid = data['peerid'];
    peer = new Peer(peerid, {key: 'zmnov4fauusxajor', debug: false});
    peer.on('connection', connect);
    peer.on('close', close);
    $('.goal-node').text("Goal: " + data['end_node']);
    if (data['partnerid']) {
        end_title = data['end_title'];
        var c = peer.connect(data['partnerid']);
        c.on('open', function() {
                connect(c);
        });
        c.on('error', function(err) {
                console.log(err);
        });
        peer.on('connection', connect);
    }
    $("a").click(function(e) {
            disableClicks(e);
            if ($(this).hasClass('play-game')) {
                scrollToTop();
                $('.play-game').remove();
                return;
            }
            // We don't have a partner yet!
            // Tell the user we couldn't do anything.
            if (conn === undefined) {
                $('.flash-area').append("<div class='flash'>You're not connected to a partner! We're working on connecting you.</div>");
                $('.flash').fadeOut(4000, function() {
                    console.log('flash message faded out');
                });
                return;
            }
            // If we haven't clicked on this before
            if ($.inArray($(this).attr('href'), nodes) === -1) {
                linkClicked(e, $(this).attr('href'), true);
                nodes.push($(this).attr('href'));
                updateNodes();
            }
    });
};

var terminatePeer = function() {
    $.ajax({
        url: "quit",
        type: "POST",
        data: data["peerid"],
        success: function() {
            console.log('terminated connection');
        },
        error: errFn
    });
};

var errFn = function(err) {
    console.log("Received error: " + err);
};


initGame();
