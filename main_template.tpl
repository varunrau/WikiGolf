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
            <div class='container'>
				<div class='jumbotron'>
                    <h1>WikiGolf</h1>
                    <p class='lead'>
                    WikiGolf is a GWAP (a game with a purpose) that lets you play Wikipedia Golf with your friends while also generating useful data to help solve difficult problems in Artificial Intelligence.
                    </p>
                    <a class='btn btn-large btn-success play-game' href='#'>Play a Game!</a>
                </div>
                <hr>
                <div class='row-fluid'>
                    <div class='span4'>
                        <h2>How do I play?</h2>
                        <p>
                            The objective of the game is to go from the start page to the goal page by only clicking on the links on the wikipedia page. The player who finishes first with the fewest number of clicks wins!
                        </p>
                    </div>
                    <div class='span4'>
                        <h2>How does it work?</h2>
                        <p>
                            When you finish a round, we look at the path you take and try to find patterns. We hope to use this data towards improving Natural Language Processing programs like Siri and Google Now.                         </p>
                    </div>
                    <div class='span4'>
                        <h2>What will it solve?</h2>
                        <p>
                            Why is it that some pages are more closely related than others? What links on Wikipedia are relevant to the current search? How can we figure out the context of this page? These are the types of questions we hope to answer.
                        </p>
                    </div>
                </div>
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
                <h4 class='goal-node'>
                    HI GAIZ
                </h4>
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
                        <span class='opp-depth-num'></span>
                    </div>
                </div>
                <span class='loading-icon'>Loading...</span>
            </div>
        </div>
    </body>
</html>
