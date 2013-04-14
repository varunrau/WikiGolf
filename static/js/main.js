$(document).ready(function() {

    var depth = 0;
    var nodes = new Array();
    var end_node = null;
    var scrolling = false;
    var game_html = null;

    var initGame = function() {
        depth = 0;
        nodes = new Array();
        end_node = null;
        $('.opp-depth-text').text('Waiting for connection...');
        $("body").css("overflow", "hidden");
    };

    // Deprecated
    var toggleScrolling = function() {
        if (scrolling) {
            $("body").css("overflow", "visible");
        } else {
            $("body").css("overflow", "hidden");
        }
        scrolling = !scrolling;
    }

    initGame();

    var updateDepth = function(d, send) {
        $('.depth-num').text(d);
        if (send) {
            conn.send({"oppDepth": d});
        }
    };

    updateDepth(depth, false);

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

    var conn;
    // The key is this app's api key. It may be worthwhile later to get this from the server later
    var peer = null;

    var connect = function(c) {
        conn = c;

        // The person we are connecting to is conn.peer
        console.log(conn.peer);

        // We have connected to another person!
        $('.opp-depth-text').text("Your Opponent's Depth:");

        var loadGame = function() {
            $(".wiki-container").html(game_html);
            $("body").css("overflow", "visible");
            scrollToTop();
            updateNodes();
            $('.goal-node').text("Goal: " + end_node);
            $(".play-game").remove();
            enableClicks();
        }

        if ($(".play-game").length > 0) {
            loadGame();
        }

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
            console.log(conn.peer + ' has left the server thing');
        });
    };

    $('.loading-icon').hide();
    $(document).ajaxStart(function() {
        $('.loading-icon').show();
    });
    $(document).ajaxStop(function() {
        $('.loading-icon').hide();
    });

    var getPage = function() {
        $.ajax({
            url: "wiki-html",
            type: "GET",
            success: function(data) {
                var peerid = data["peerid"];
                peer = new Peer(peerid, {key: "zmnov4fauusxajor", debug: false});
                peer.on("connection", connect);
                // We are connecting to another person.
                if (data["partnerid"]) {
                    $(".play-game").remove();
                    $("body").css("overflow", "visible");
                    $(".wiki-container").html(data["html"]);
                    $('.goal-node').text("Goal: " + data['end_node']);
                    scrollToTop();
                    nodes.push(data["title"]);
                    updateNodes();
                    end_node = data["end_node"];
                    var c = peer.connect(data["partnerid"]);
                    c.on("open", function() {
                        connect(c);
                    });
                    c.on("error", function() {
                        console.log(err);
                    });
                    peer.on("connection", connect);
                    enableClicks();
                } else {
                    // Load the content but don't start the game. If we have someone connect then start. If no one starts after two minutes quit and tell the user.
                    $(".play-game").text("Waiting for Partner...");
                    game_html = data["html"];
                    nodes.push(data["title"]);
                    end_node = data["end_node"];
                    setTimeout(function() {
                        if ($(".play-game").length > 0) {
                            $.ajax({
                                url: "quit",
                                type: "POST",
                                data: peerid,
                                success: function() {
                                    console.log("Successfully dequeued from server");
                                },
                                error: function() {
                                    console.log("fuck");
                                }
                            })
                            $("#noPartners").modal();
                        }
                    }, 60000);
                }
            }
        })
    }

    $(".play-game").click(function() {
        $(".play-game").text("Connecting...");
        getPage();
    });


    var enableClicks = function() {
        $("a").click(function(e) {
            disableClicks(e);
            scrollToTop();
            if ($(this).hasClass('play-game')) {
                toggleScrolling();
                return;
            }

            // If we haven't clicked on this before
            if ($.inArray($(this).attr('href'), nodes) === -1) {
                linkClicked(e, $(this).attr('href'), true);
                nodes.push($(this).attr('href'));
                updateNodes();
            }
        });
    }
    var dontCallMe = function() {
        // Get the first page
        // Get the page we are supposed to end at.
        $.ajax({
            url: "wiki-html",
            type: "GET",
            async: false,
            success: function(data) {
                $('.wiki-container').html(data['html']);
                nodes.push(data['title']);
                updateNodes();
                end_node = data['end_node'];
                var peerid = data['peerid'];
                peer = new Peer(peerid, {key: 'zmnov4fauusxajor', debug: false});
                peer.on('connection', connect);
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
                    scrollToTop();
                    if ($(this).hasClass('play-game')) {
                        toggleScrolling();
                        return;
                    }

                    // If we haven't clicked on this before
                    if ($.inArray($(this).attr('href'), nodes) === -1) {
                        linkClicked(e, $(this).attr('href'), true);
                        nodes.push($(this).attr('href'));
                        updateNodes();
                    }
                });
            },
            error: function(e) {
                console.log('something went wrong server side');
            }
        });
    }

    $('.back').click(function(e) {
        console.log('hi')
        if (nodes.length > 0) {
            // Remove the node we are currently on
            nodes.pop();
            linkClicked(e, nodes[nodes.length - 1], true);
            updateNodes();
            depth -= 2;
            console.log('depth is ' + depth);
            $('.depth-num').text(depth);
            conn.on('open', function() {
                updateDepth(depth, true);
            });
        }
    });

    var disableClicks = function(e) {
        e.preventDefault();
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
            error: function(e) {
                console.log('something went wrong server side');
            }
        });
    };

    var nodeItemClicked = function(e) {
        console.log($(this).index() + ' is the index');
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
            error: function(e) {
                console.log('something went wrong server side');
            }
        });
        depth = $(this).index();
        updateDepth(depth, true);
        nodes.splice(depth + 1, nodes.length - depth);
        updateNodes();
    };


    var displayWin = function() {
        var data = {"oppWin": nodes};
        conn.send(data);
        alert('You made it in ' + depth + ' moves!');
    };
});
