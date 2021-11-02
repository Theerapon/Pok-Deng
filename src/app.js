const {player} = require('./entities/character')
const {dealer} = require('./entities/character')
const {deck, card} = require('./entities/deck')



const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var currentBet = 0

const putOnBet = () => {
    console.log('Please put your bet');
    rl.question("", (answer) => {
        currentBet = answer
        rl.close()
        dealOutCards()
      });
}

const displayPlayerCard = (player) => {
    console.log("You got " +  
    comareCard(player.cards[0].face, player.cards[0].symbol) + " " +
    comareCard(player.cards[1].face, player.cards[1].symbol))
}

const displayDealerCard = (dealer) => {
    console.log("You got " +  
    comareCard(dealer.cards[0].face, dealer.cards[0].symbol) + " " +
    comareCard(dealer.cards[1].face, dealer.cards[1].symbol))
} 

const comareCard = (face, symbol) => {
    return deck.symbol[symbol] + "-" + deck.face[face];
}

const randomNumber = (start, end) => {
    return Math.floor(Math.random() * end) + start
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
        value: 0
    })

    player.cards.push( {
        face: outCardsFace[2],
        symbol: outCardsSymbol[2],
        value: 0
    })

    dealer.cards.push( {
        face: outCardsFace[1],
        symbol: outCardsSymbol[1],
        value: 0
    })

    dealer.cards.push( {
        face: outCardsFace[3],
        symbol: outCardsSymbol[3],
        value: 0
    })

    displayPlayerCard(player)
    displayDealerCard(dealer)
    
}

const checkScore = () => {

}

putOnBet()

// while(true) {



// }