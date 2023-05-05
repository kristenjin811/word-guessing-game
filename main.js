const Api = (() => {
  const url = "https://random-word-api.herokuapp.com/word"
  const getRandomWord = () => {
    return fetch(url).then((response) => response.json())
  }
  console.log(getRandomWord)
  return {
    getRandomWord
  }
})()

const View = (() => {
  let domSelector = {
    wordArea: ".random-word",
    inputBox: ".user-input",
    btn: ".new-game-btn",
    counter: ".counter"
  }

  return {
    domSelector,
  }
})()


const Model = ((api, view) => {
  const backupWordList = [
    "ballot",
    "soil",
    "legislation",
    "valley",
    "country",
    "nail",
    "piano",
    "speech",
    "efflux",
    "reason",
    "alcohol",
    "stable",
    "slice",
    "situation",
    "profession",
    "restaurant",
    "pocket",
    "satisfaction",
    "condition",
    "comfortable"
  ]
  class State {
    constructor() {
      this._word = ""
      this._maskedWord = ""
      this._incorrectGuesses = 0
      this._maxIncorrectGuesses = 10
      this._correctWords = 0
    }
    get word() {
      return this._word
    }

    get maskedWord() {
      return this._maskedWord
    }

    get incorrectGuesses() {
      return this._incorrectGuesses
    }

    get maxIncorrectGuesses() {
      return this._maxIncorrectGuesses
    }

    get correctWords() {
      return this._correctWords
    }

    set word(value) {
      this._word = value
      this._maskedWord = this.maskWord()
    }

    maskWord(){
      // takes a word as input and returns the word with random indexed letters
        // replaced with underscore _
      const concealCount = Math.floor(Math.random() * this._word.length-3) + 1;
      const concealIndices = new Set();
      while (concealIndices.size < concealCount) {
        concealIndices.add(Math.floor(Math.random() * this._word.length));
      }

      return this._word.split('').map((char, index) => {
        return concealIndices.has(index) ? '_' : char;
      }).join('');
    }

    updateIncorrectGuesses() {
      this._incorrectGuesses ++
    }

    isCorrectGuess(input) {
      return this._maskedWord.includes(input)
    }

    revealLetter(letter) {
      this._maskedWord = this._maskedWord.split('').map((char, index) => {
        return (char === '_' && this._word[index] === letter) ? letter : char;
      }).join('');
      // change the masked letter back to letter
    }

    isGameOver() {
      return this.incorrectGuesses >= this.maxIncorrectGuesses
    }

    hasWon() {
      // return true if there is no more masked letter in this word
      return !this._maskedWord.includes('_')
    }

    reset() {
      this._word = "";
      this._maskedWord = "";
      this._incorrectGuesses = 0;
      this._correctWords = 0
    }

    correctWords() {
      return this._correctWords;
    }

    incrementCorrectWords() {
      this._correctWords++;
    }
  }
  const state = new State()

  return {
    state,
    backupWordList
  }
})(Api, View)


const Controller = ((api, model, view) => {
  const { domSelector } = view
  const { state, backupWordList } = model
  const { getRandomWord } = api

  const newGame = () => {
    // Initialize a new game.
    state.reset();
    getRandomWord()
      .then(wordArr => {
        state.word = wordArr[0];
        console.log(state.word)
        render();
      })
      .catch(() => {
        // Use backup list in case of API failure.
        const randomIndex = Math.floor(Math.random() * backupWordList.length);
        state.word = backupWordList[randomIndex];
        render();
      });
  }


  const render = () => {
    // Render the game view.
    const wordContainer = document.querySelector(domSelector.wordArea);
    const counterSpan = document.querySelector(domSelector.counter);
    wordContainer.innerText = state.maskedWord;
    console.log(state.maskedWord)
    counterSpan.innerText = state.incorrectGuesses;
  }

  const guessLetter = () => {
    const inputBox = document.querySelector(domSelector.inputBox);
    inputBox.addEventListener('input', (event) => {
      const letter = event.target.value.toLowerCase();
      event.target.value = ""
      if (state.isCorrectGuess(letter)) {
        state.revealLetter(letter);
        if (state.hasWon()) {
          alert("Congratulations! You have guessed the word!");
          newGame();
        }
      } else {
        state.updateIncorrectGuesses();
        if (state.isGameOver()) {
          alert(`Game over! You have guessed ${state.correctWords()} word${state.correctWords() !== 1 ? 's' : ''}!`);
          newGame();
        }
      }
      render();
    });
  }

  const initNewGameBtn = () => {
    const newGameBtn = document.querySelector(domSelector.btn);
    newGameBtn.addEventListener('click', newGame);
  }


  // Initialize the game.
  const bootstrap = () => {
    newGame();
    guessLetter();
    initNewGameBtn();
    render();
  }

  return {
    bootstrap,
  }
})(Api, Model, View)

Controller.bootstrap()
