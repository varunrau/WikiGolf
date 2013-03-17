$(document).ready(function() {
    var depth = 0;
    var nodes = new Array();
    var end_node = null;
    $('.depth-num').text(depth);

    var conn;
    // Connect to PeerJS, get key_val from server
    var peer = new Peer({key: key_val, debug: true});
    peer.on('open', function(id) {
        console.log(id);
    }

    peer.on('connection', function(c) {
        conn = c;

        // The person we are connecting to is conn.peer
        console.log(conn.peer);

        conn.on('data', function(data) {
            console.log(data);
        });

        conn.on('close', function(err) {
            alert(conn.peer + ' has left the server thing');
        });

    });

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
