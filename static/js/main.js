$(document).ready(function() {
    var depth = 0;
    var nodes = new Array();
    var end_node = null;
    $('.depth-num').text(depth);

    // Get the first page
    // Get the page we are supposed to end at.
    $.ajax({
        url: "wiki-html",
        type: "GET",
        success: function(data) {
            $('.wiki-container').html(data['html']);
            end_node = data['end_node'];
            $("a").click(function(e) {
                if ($(this).hasClass('back')) {
                    linkClicked(e, nodes.pop());
                } else {
                    disableClicks(e);
                }

                // If we haven't clicked on this before
                if ($.inArray($(this).attr('href'), nodes) === -1) {
                    linkClicked(e, $(this).attr('href'));
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
        depth++;
        $('.depth-num').text(depth);
        console.log($(this).attr("href"));
        console.log($(this).hasClass('sidebar'));
        if (loc == end_node) {
            displayWin();
        }
        $.ajax({
            url: "wiki-html",
            type: "POST",
            data: loc,
            success: function(data) {
                $('.wiki-container').html(data);
                $("a").click(function(e) {
                    disableClicks(e);
                    if ($.inArray($(this).attr('href'), nodes) === -1) {
                        linkClicked(e, $(this).attr('href'));
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
