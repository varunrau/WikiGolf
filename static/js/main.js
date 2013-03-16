$(document).ready(function() {
    $.ajax({
        url: "wiki-html",
        type: "GET",
        success: function(data) {
            $('.wiki-container').html(data);
        },
        error: function(e) {
            console.log('something went wrong in ajax');
        }
    });
    console.log('hi')
});
