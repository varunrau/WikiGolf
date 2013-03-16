$(document).ready(function() {
    var depth = 0;
    var nodes = new Array();
    $('.depth-num').text(depth);

    $.ajax({
        url: "wiki-html",
        type: "GET",
        success: function(data) {
            $('.wiki-container').html(data);
            $("a").click(function(e) {
                disableClicks(e);
                linkClicked(e, $(this).attr('href'));
                nodes.push($(this).attr('href'));
                updateNodes();
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
    var linkClicked = function(e, loc) {
        depth++;
        console.log(depth);
        $('.depth-num').text(depth);
        $.ajax({
            url: "wiki-html",
            type: "POST",
            data: loc,
            success: function(data) {
                $('.wiki-container').html(data);
                $("a").click(function(e) {
                    disableClicks(e);
                    linkClicked(e, $(this).attr('href'));
                    nodes.push($(this).attr('href'));
                    updateNodes();
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
            $('.node-list').append($('<li>').append("<a href='" + clicked_link + "'>" + clicked_link_name + "</a>"));
        });
    };

});
