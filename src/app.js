const {player} = require('./entities/character')
const {dealer} = require('./entities/character')
const {deck, card} = require('./entities/deck')



const readline = require("readline");
const readline2 = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var currentBet = 0

const putOnBet = () => {
    console.log('Please put your bet');
    return new Promise((resolve, reject) => {
        rl.question("", (answer) => {
            currentBet = parseInt(answer)
            resolve()   
          });
    })
}

const displayPlayerCard = (player) => {
    console.log("You got " +  
    compareCardToString(player.cards[0].face, player.cards[0].symbol) + " " +
    compareCardToString(player.cards[1].face, player.cards[1].symbol))

    player.totalScore = calFinalScore((player.cards[0].value + player.cards[1].value))
    // console.log("player total score: " + player.totalScore)
}

const displayDealerCard = (dealer) => {
    console.log("The dealer got " +  
    compareCardToString(dealer.cards[0].face, dealer.cards[0].symbol) + " " +
    compareCardToString(dealer.cards[1].face, dealer.cards[1].symbol))

    dealer.totalScore = calFinalScore((dealer.cards[0].value + dealer.cards[1].value))
    // console.log("dealer total score: " + dealer.totalScore)
} 

const compareCardToString = (face, symbol) => {
    return deck.symbol[symbol] + "-" + deck.face[face];
}

const randomNumber = (start, end) => {
    return Math.floor(Math.random() * end) + start
}

const calFinalScore = (score) => {
    return score % 10
}

const checkCardsExist = (outCardsFace, outCardsSymbol) => {

    return new Promise((resolve, reject) => {
        var dealing = true;
        while (dealing) {
            let faceIndexCardOne = randomNumber(0, 12);
            let symbolIndexCardOne = randomNumber(0, 3);
        
            let existed = false;
            let length = outCardsFace.length;
            for (let i = 0; i < length; i++) {
                if (outCardsFace[i] !== faceIndexCardOne 
                    && outCardsSymbol[i] !== symbolIndexCardOne) {
                        existed = false;
                } else {
                    existed = true;
                }
            } 

            if (!existed) {
                outCardsFace.push(faceIndexCardOne)
                outCardsSymbol.push(symbolIndexCardOne)
                dealing = false;
            }
        }
        resolve()
        reject()
    })

}

const wannaPlay = () => {
    console.log('Wanna play');
    return new Promise((resolve, reject) => {
        rl.question("", (answer) => {
            
            if (answer.trim().toLowerCase() === 'yes') {
                resolve(true)
                return 
            } else if (answer.trim().toLowerCase() === 'no') {
                rl.close()
                resolve(false)
                return 
            }
            wannaPlay()
          });
    })
}

const dealOutCards = () => {
    var outCardsFace = []
    var outCardsSymbol = []

    for (var i = 0; i < 4; i++) {
        checkCardsExist(outCardsFace, outCardsSymbol).then(() => {
            // console.log("face " + outCardsFace)
            // console.log("symbol " + outCardsSymbol)
        })
    }

    player.cards.push( {
        face: outCardsFace[0],
        symbol: outCardsSymbol[0],
        value: calScore(outCardsFace[0])
    })

    player.cards.push( {
        face: outCardsFace[2],
        symbol: outCardsSymbol[2],
        value: calScore(outCardsFace[2])
    })

    dealer.cards.push( {
        face: outCardsFace[1],
        symbol: outCardsSymbol[1],
        value: calScore(outCardsFace[1])
    })

    dealer.cards.push( {
        face: outCardsFace[3],
        symbol: outCardsSymbol[3],
        value: calScore(outCardsFace[3])
    })

    displayPlayerCard(player)
    displayDealerCard(dealer)

}

const calScore = (index) => {
    var score = 0;
    if (index === 0) {
        score = 1;
    } else if (index === 9 || index === 10 || index === 11 || index === 12) {
        score = 0;
    } else {
        score = index + 1;
    }
    return score;
}


const compareScore = (player, dealer, currentBet) => {
    let playerScore = player.totalScore;
    let dealerScore = dealer.totalScore;
    let lostBet = true;
    if (playerScore > dealerScore) {
        console.log("You won!!!, received " + currentBet)
        lostBet = false;
    } else if (playerScore === dealerScore) {
        console.log("You draw!!!, missed " + currentBet)
    } else {
        console.log("You lost!!!, missed " + currentBet)
    }

    if (!lostBet) {
        player.totalChips += currentBet;
    } else {
        player.totalChips -= currentBet;
    }
}

const playGame = () => {

    putOnBet().then(() => {
        dealOutCards()
        compareScore(player, dealer, currentBet)
        wannaPlay().then((result) => {
            console.log("You got total " + player.totalChips + " chips")
            if(result === true) {
                console.log()
                playGame()
            } else {
                return
            }
        })
    })
}



playGame()

