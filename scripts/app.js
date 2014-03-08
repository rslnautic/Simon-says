/*global define */
define([], function () {
    'use strict'
    //declaracion de las notas para la libreria howler.js
    var C5 = new Howl({
        urls: ['C5.mp3']
    });
    var D5 = new Howl({
        urls: ['D5.mp3']
    });
    var E5 = new Howl({
        urls: ['E5.mp3']
    });
    var F5 = new Howl({
        urls: ['F5.mp3']
    });
    var G5 = new Howl({
        urls: ['G5.mp3']
    });
     // GLOBAL VARS
    var animationEnd = true // STATES WHEN TO SHOW THE END SEQUENCE
    var userPlaying = false // STATES WHEN THE USER CAN PLAY
    var userClicks = new Array() // SAVE USER CLICKS SEQUENCE 
    var buttonList // SAVE ALL COLOR BUTTONS IDs
    var computerSequence = new Array() // SAVE RANDOM GENERATED COMPUTER SEQUENCE
    var score = 0 // USER SCORE
    var maxScore = 0; // USER MAXSCORE
    var melodySequence = ["blue", "green", "yellow", "orange", "red"] // SEQUENCE DISPLAYED AT THE END OD THE GANME
    var failSequence = melodySequence.slice(0)

    // USER CANT CLICK AGAIN AFTER 310ms, WHILE COLORS ARE HIGHLIGHTED
    var userWait = function () {
        userPlaying = false
        setTimeout(function () {
            userPlaying = true
        }, 310)
    }

    //INITIALIZE THE GAME
    var initialize = function () {
        buttonList = jQuery.map($(".button"),
         function (element) {
             return $(element).attr('id')
         })
    }

    //ADD ONE NEW COLOR TO THE COMPUTER SEQUENCE EACH TIME THE USER WINS
    var generateComputerSequence = function () {
        computerSequence.push(buttonList[
         Math.floor(Math.random()
           * buttonList.length)])
        console.log(computerSequence)
        //score = computerSequence.length
    }

    //BUTTONS HIGHLIGHT EFFECT
    var highlight = function (button, color) {
        var oldColor = button.css("background-color")
        var oldShadow = button.css("box-shadow") //guarda los parametros de box-shadow
        var shadow = "0px 0px 50px " + color //guarda los parametros del nuevo box-shadow
        button.css("background-color", color).dequeue()
        button.css("box-shadow", shadow).dequeue()
        button.css("z-index", "2").dequeue()

        .delay(300)
        .queue(function () {
            button.css("background-color", oldColor).dequeue()
            button.css("box-shadow", oldShadow).dequeue()
            button.css("z-index", "0").dequeue()
        })
    }

    //SHOW COMPUTER SEQUENCE
    var showSequence = function (Array, speed) {
        var seq = Array
        userPlaying = false
        for (var id in seq) {
            (function (id) {
                setTimeout(function () {
                    if (seq[id] === 'blue') {
                        highlight($("#" + seq[id]), "#2E72FF")
                        C5.stop().play();
                    }
                    else if (seq[id] === 'green') {
                        highlight($("#" + seq[id]), "#2AFA33")
                        D5.stop().play();
                    }
                    else if (seq[id] === 'yellow') {
                        highlight($("#" + seq[id]), "#FFFF11")
                        E5.stop().play();
                    }
                    else if (seq[id] === 'orange') {
                        highlight($("#" + seq[id]), "#FFB21A")
                        F5.stop().play();
                    }
                    else if (seq[id] === 'red') {
                        highlight($("#" + seq[id]), "#FF434F")
                        G5.stop().play();
                    }

                }, speed * id)
            })(id)
        }
        setTimeout(function () {
            userPlaying = true
        }, speed * seq.length)
    }

    //CHECKS IF THE USER CLICKS THE RIGHT BUTTON AT THE RIGHT TIME
    var compareSequences = function () {
        for (var i = 0; i < userClicks.length; i++) {
            if (computerSequence[i] !== userClicks[i]) {
                return false;
            }
        }
        return true;
    }

    //SHOWS END SCREEN AND CLEAR COMPUTER SEQUENCE WHEN THE USER FAILS
    var endGame = function () {
        document.getElementById('finalScore').innerHTML = score;
        document.getElementById('finalMaxScore').innerHTML = maxScore;
        document.getElementById('endScreen').className = 'active';
        setTimeout(function () {
            showSequence(failSequence , 200)
        }, 1000)
        computerSequence = []
    }

    //THE GAME
    $(document).ready(function () {
        initialize()
        //TAKES YOU TO THE GAME SCREEN WHEN YOU CLICK THE START BUTTON AND SET FAIL SEQUENCE
        $('#start-button').click(function () {
            document.getElementById('intro').className = '';
            setTimeout(function () {
                generateComputerSequence()
                showSequence(computerSequence, 600)
            }, 500)
            failSequence = melodySequence.slice(0);
        })

        //TAKES YOU TO THE HOME SCREEN WHEN YOU CLICK THE START BUTTON AND RESSET SCORE VALUE
        $('#end-button').click(function () {
            failSequence.length = 0;
            document.getElementById('intro').className = 'active';
            document.getElementById('endScreen').className = '';
            setTimeout(function () {
            }, 500)
            score = 0;
        })

        //HIGHLIGHT THE BUTTON THAT THE USER CLICK
        $('.button').click(function () {
            console.log(userPlaying)
            if (userPlaying) {
                var thisId = $(this).attr('id')
                if (thisId === 'blue') {
                    highlight($(this), "#2E72FF")
                    C5.stop().play();
                }
                else if (thisId === 'green') {
                    highlight($(this), "#2AFA33")
                    D5.stop().play();
                }
                else if (thisId === 'yellow') {
                    highlight($(this), "#FFFF11")
                    E5.stop().play();
                }
                else if (thisId === 'orange') {
                    highlight($(this), "#FFB21A")
                    F5.stop().play();
                }
                else if (thisId === 'red') {
                    highlight($(this), "#FF434F")
                    G5.stop().play();
                }
                userClicks.push(thisId)

                userWait();
            }

            //MAKE THE COMPARATION AND ENDS GAME IF THE USER SEQUENCE IS NOT CORRECT
            if (!compareSequences()) {
                if(score>maxScore)
                {
                    maxScore=score
                }
                userClicks = []
                computerSequence = []
                endGame()// END GAME
            }

            //IF ALL IS GOOD: SCORE++ AND SHOWS SCORE PANEL & "computerSequence.length != 0" ---> IS FOR CONTROLING ERRORS
            if (userClicks.length >= computerSequence.length && computerSequence.length != 0) 
            {
                userPlaying = false
                score = computerSequence.length
                document.getElementById('Score').innerHTML = score;
                $("#scorePanel").animate({ height: "+=130" }, 300);
                setTimeout(function () {
                    $("#scorePanel").animate({ height: "-=130" }, 300);
                }, 1000)
                generateComputerSequence()
                userClicks = []
                setTimeout(function () {
                    showSequence(computerSequence, 600)
                }, 2000)
            }

        })
    })
    return "<============== OK";

    return '\'Allo \'Allo!';
});