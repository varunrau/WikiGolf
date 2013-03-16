$(document).ready(function() {
    var depth = 0;

    $.ajax({
        url: "wiki-html",
        type: "GET",
        success: function(data) {
            $('.wiki-container').html(data);
            $("a").click(function(e) {
                disableClicks(e);
                linkClicked(e, $(this).attr('href'));
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
        $.ajax({
            url: "wiki-html",
            type: "POST",
            data: loc,
            success: function(data) {
                $('.wiki-container').html(data);
                $("a").click(function(e) {
                    disableClicks(e);
                    linkClicked(e, $(this).attr('href'));
                });
            },
            error: function(e) {
                console.log('something went wrong server side');
            }
        });
    };

});
