<!DOCTYPE html>
<html>
    <head>
        <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
        <script src="main.js"></script>
        <script src="http://cdn.peerjs.com/0/peer.js"></script>
        <script src="bootstrap/bootstrap.js"></script>
        <script src="style.js"></script>
        <script src="underscore-min.js"></script>
        <link href="main.css" rel="stylesheet" type="text/css">
        <link href="bootstrap/bootstrap.css" media="all" rel="stylesheet" type="text/css">
        <link href="wikipedia.css" media="all" rel="stylesheet" type="text/css">
        <link href="wikipedia2.css" media="all" rel="stylesheet" type="text/css">
    </head>

    <body>
        <div class='top'>
            <div class="banner-area">
                <h1 class="banner">WikiGolf</h1>
            </div>
            <div class="description">
            </div>
            <div id="navbar" class="navbar transitional-5">
                <div class="navbar-inner">
                    <a class="brand" href="#">WikiGolf</a>
                    <ul class="nav">
                        <li class="active"><a href="#">Home</a></li>
                        <li><a href="#">Link</a></li>
                        <li><a href="#">Link</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="gamegrid clearfix">
            <div class="wiki-container">
            </div>
            <div class="game-info">
                <div class="top-right">
                    <div class"'depth">
                        Your Depth:
                        <span class="depth-num">0</span>
                    </div>
                    <div clashs="visited-nodes">
                        <ul class="node-list">
                        </ul>
                    </div>
                </div>
                <div class="bottom-right">
                    <div class='opp-depth'>
                        <span class='opp-depth-text'>Your Opponent's Current Depth:</span>
                        <span class='opp-depth-num'>0</span>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
