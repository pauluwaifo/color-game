import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState<number>(5);
  const [correct, setCorrect] = useState<number>(0);
  const [wrong, setWrong] = useState<number>(0);
  const [best, setBest] = useState<number>(0);
  const [bgColor, setBgColor] = useState<string>("#FF5733");
  const [colors, setColors] = useState<string[]>([
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A8",
    "#FFD700",
    "#800080",
  ]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [guess, setGuess] = useState<boolean | undefined>();

  useEffect(() => {
    const best = localStorage.getItem("best");
    if (best) {
      setBest(JSON.parse(best));
    } else {
      localStorage.setItem("best", JSON.stringify(0));
    }
  }, []);

  const handleGuess = (color: string) => {
    if (count <= 0) {
      setIsGameOver(true);
      if (correct > best) {
        localStorage.setItem("best", JSON.stringify(correct));
        setBest(correct);
      }
    } else {
      if (color === bgColor) {
        setGuess(true);
        setCount((prev) => prev);
        const shuffledColors = shuffleArray(colors);
        setColors(shuffledColors);
        const randomColor =
          shuffledColors[Math.floor(Math.random() * shuffledColors.length)];
        setBgColor(randomColor);
        setCorrect((prev) => prev + 1);
      } else {
        setGuess(false);
        setCount((prev) => prev - 1);
        setWrong((prev) => prev + 1);
      }
    }
  };

  const shuffleArray = (array: string[]) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ]; // Swap elements
    }
    return shuffledArray;
  };

  const handleReset = () => {
    setCorrect(0);
    setWrong(0);
    setCount(5);
    setIsGameOver(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGuess(undefined);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [guess]);

  // game over container
  const gameOver = () => {
    return (
      <div className="game_over">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 80,
            backgroundColor: "rgba(0,0,0,0.8)",
            borderRadius: "10px",
            gap: "20px",
          }}
        >
          <p className="header">GAME OVER 😢</p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button onClick={() => handleReset()} style={{ color: "black" }}>
              Try again
            </button>
            <p>Score: {correct}</p>
          </div>
        </div>
      </div>
    );
  };

  // main
  return (
    <div className="body">
      <div className="gameContainer">
        {/* game over container */}
        {isGameOver && gameOver()}

        {/* Title */}
        <p data-testid="gameInstructions" className="header">
          GUESS THE CORRECT COLOR
        </p>

        {/* scores, trial */}
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <p style={{ fontWeight: "600" }}>Trial(s): {count}</p>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "40px",
              justifyContent: "flex-end",
              alignItems: "center",
              flex: 1,
            }}
          >
            <p style={{ fontWeight: "600", fontSize: "1em" }}>Best: {best} </p>
            <p
              data-testid="score"
              style={{ fontWeight: "600", fontSize: "1em", color: "green" }}
            >
              correct: {correct}
            </p>

            <p style={{ fontWeight: "600", fontSize: "1em", color: "red" }}>
              wrong: {wrong}
            </p>
          </div>
        </div>

        {/* color box */}
        <div
          data-testid="colorBox"
          className="colorBox"
          style={{
            width: "100%",
            flex: 1,
            flexBasis: "100%",
            borderRadius: "25px",
            backgroundColor: bgColor,
            display: "flex",
          }}
        ></div>

        {/* buttons */}
        <div className="colorButton">
          {colors.map((color, index) => (
            <div className="btn">
              <button
                data-testid="colorOption"
                key={index}
                style={{
                  backgroundColor: color,
                  height: "70px",
                  width: "100%",
                }}
                onClick={() => handleGuess(color)}
              ></button>
            </div>
          ))}
        </div>

        {/* indicator /correct/wrong */}
        <div
          style={{ position: "relative", padding: 10 }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              
            }}
          >
            <p data-testid="gameStatus" style={{ fontSize: "1.2em" }}>
              {guess === true
                ? "correct 🎉"
                : guess === false
                ? "wrong 😢"
                : null}
            </p>
          </div>
        </div>

        {/* reset button */}
        <button
          data-testid="newGameButton"
          onClick={() => handleReset()}
          style={{ color: "black" }}
        >
          New Game
        </button>
      </div>
    </div>
  );
}

export default App;
