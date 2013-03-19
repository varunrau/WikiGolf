$(document).ready(function() {
    var depth = 0;
    var nodes = new Array();
    var end_node = null;
    $('.depth-num').text(depth);
    $('.opp-depth-text').text('Waiting for connection...');

    var conn;
    // The key is this app's api key. It may be worthwhile later to get this from the server later
    var peer = null;

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
            console.log(conn.peer + ' has left the server thing');
        });
    };

    // Get the peerid from the server
    $.ajax({
        url: "peerid",
        type: "GET",
        async: false,
        success: function(data) {
            var peerid = data['peerid'];
            peer = new Peer(peerid, {key: 'zmnov4fauusxajor', debug: false});
            peer.on('connection', connect);
            if (data['partnerid']) {
                var c = peer.connect(data['partnerid']);
                console.log('almost connected');
                c.on('open', function() {
                    connect(c);
                });
                c.on('error', function(err) {
                    console.log(err);
                });
            }
        },
        error: function(e) {
            console.log('Received error from server: ' + e);
        }
    });


    // This will be the peer we're connecting to
    peer.on('open', function(id) {
        console.log(id);
    });

    // Listen for incoming connections
    peer.on('connection', connect);


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
                conn.send({"oppDepth": depth});
            });
        }
    });

    // Get the first page
    // Get the page we are supposed to end at.
    $.ajax({
        url: "wiki-html",
        type: "GET",
        success: function(data) {
            $('.wiki-container').html(data['html']);
            nodes.push(data['start_node']);
            updateNodes();
            end_node = data['end_node'];
            $("a").click(function(e) {
                disableClicks(e);
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

    var disableClicks = function(e) {
        e.preventDefault();
    };

    // When a link is clicked we want to move to the new link and
    // increment our depth
    var linkClicked = function(e, loc, update) {
        if (update) {
            depth++;
            $('.depth-num').text(depth);
            // Send the new depth to the opponent
            conn.send({"oppDepth": depth});
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
            url: "wiki-html",
            type: "POST",
            data: nodeClicked,
            success: function(data) {
                console.log(data);
                $('.wiki-container').html(data);
                $("a").click(function(e) {
                    disableClicks(e);
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
        $('.depth-num').text(depth);
        conn.send({"oppDepth": depth});
        nodes.splice(depth + 1, nodes.length - depth);
        updateNodes();
    };

    var updateNodes = function() {
        $('.node-list').empty();
        $.each(nodes, function() {
            clicked_link = this.toString();
            var split_arr = clicked_link.split("/");
            var clicked_link_name = split_arr[2];
            $('.node-list').append($('<li>').append("<a class='sidebar' href='" + clicked_link + "'>" + clicked_link_name + "</a>"));
        });
    };

    var displayWin = function() {
        var data = {"oppWin": nodes};
        conn.send(data);
        alert('You made it in ' + depth + ' moves!');
    };

});
