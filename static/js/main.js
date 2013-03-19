$(document).ready(function() {
    var depth = 0;
    var nodes = new Array();
    var end_node = null;
    $('.depth-num').text(depth);

    var conn;
    // Connect to PeerJS, the key is the API key
    // The id should come from the server

    var peerid = ''

    // The key is this app's api key. It may be worthwhile later to get this from the server later
    var peer = null;

    var connect = function(c) {
        conn = c;

        // The person we are connecting to is conn.peer
        console.log(conn.peer);

        // The data that is sent from the other peer
        conn.on('data', function(data) {
            console.log(data);
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
            peerid = data['peerid'];
            peer = new Peer(peerid, {key: 'zmnov4fauusxajor', debug: true});
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
                } else {
                    // remove all nodes after this thing
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
            },
            error: function(e) {
                console.log('something went wrong server side');
            }
        });
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
        alert('You made it in ' + depth + ' moves!');
    };


});
