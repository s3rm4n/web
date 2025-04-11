import React, { useRef, useState, useEffect } from 'react';

const birdSize = 30;
const pipeSpeed = 2;
const gravity = 0.25;
const jumpStrength = -4.6;


const Home: React.FC = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [birdY, setBirdY] = useState(0);
  const [pipeWidth, setPipeWidth] = useState(50);
  const [pipeGap, setPipeGap] = useState(120);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<{ x: number; gapY: number }[]>([]);

  useEffect(() => {
    setCanvasWidth(window.innerWidth);
    setCanvasHeight(window.innerHeight);
    setBirdY(window.innerHeight / 2)
  }, []);

  // Generate initial pipes
  useEffect(() => {
    if (!gameStarted) {
      setPipes([{ x: canvasWidth, gapY: Math.random() * (canvasHeight - pipeGap) }]);
    }
  }, [gameStarted]);

  // Function to generate new pipes
  const generatePipe = () => {
    setPipes(prevPipes => [...prevPipes, { x: canvasWidth, gapY: Math.random() * (canvasHeight - pipeGap) }]);
  };

  // Function to update game state
  const update = () => {
    if (gameOver || !gameStarted) return;

    // Bird movement
    setBirdVelocity(prevVelocity => prevVelocity + gravity);
    setBirdY(prevY => Math.max(0, Math.min(canvasHeight, prevY + birdVelocity)));

    // Pipe movement and generation
    setPipes(prevPipes =>
      prevPipes
        .map(pipe => ({ ...pipe, x: pipe.x - pipeSpeed }))
        .filter(pipe => pipe.x + pipeWidth > 0)
    );

    // Generate new pipe when needed
    if (pipes.length > 0 && pipes[pipes.length - 1].x < canvasWidth - 200) {
      generatePipe();
    }

    // Collision detection
    for (const pipe of pipes) {
      if (
        birdY < pipe.gapY ||
        birdY + birdSize > pipe.gapY + pipeGap
      ) {
        if (
          birdSize + 10 > pipe.x &&
          birdSize  < pipe.x + pipeWidth
        ) {
          setGameOver(true);
          break;
        }
      } else if (birdSize + 10 > pipe.x && birdSize  < pipe.x + pipeWidth) {
        setScore(prevScore => prevScore + 1);
      }
    }

    // Game over if bird hits top or bottom
    if (birdY <= 0 || birdY >= canvasHeight - birdSize) {
      setGameOver(true);
    }
  };

  // Function to draw game elements on canvas
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(10, birdY, birdSize, birdSize);

    // Draw pipes
    ctx.fillStyle = 'green';
    for (const pipe of pipes) {
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.gapY); // Top pipe
      ctx.fillRect(pipe.x, pipe.gapY + pipeGap, pipeWidth, canvasHeight - (pipe.gapY + pipeGap)); // Bottom pipe
    }

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Game Over Message
    if (gameOver) {
      ctx.fillStyle = "red";
      ctx.font = "30px sans-serif";
      ctx.fillText("Game Over!", canvasWidth / 2 - 100, canvasHeight / 2 - 20);
      ctx.fillStyle = "black";
      ctx.font = "16px sans-serif";
      ctx.fillText("Click or press any key to restart", canvasWidth / 2 - 120, canvasHeight / 2 + 10);
    }

    // Start Message
    if (!gameStarted && !gameOver) {
      ctx.fillStyle = "black";
      ctx.font = "24px sans-serif";
      ctx.fillText("Click or press any key to start", canvasWidth / 2 - 150, canvasHeight / 2 - 10);
    }
  };

  // Game loop using requestAnimationFrame
  useEffect(() => {
    let animationId: number;

    const gameLoop = () => {
      update();
      draw();
      animationId = requestAnimationFrame(gameLoop);
    };

    if (gameStarted || (!gameStarted && !gameOver)) {
      animationId = requestAnimationFrame(gameLoop);
    } else {
      draw() // Draw game over state
    }

    return () => cancelAnimationFrame(animationId);
  }, [gameStarted, gameOver, birdY, birdVelocity, pipes, score]); // Re-run when these change

  // Handle user input (click or key press)
  const handleInput = () => {
    if (gameOver || !gameStarted) {
      setGameOver(false);
      setScore(0);
      setBirdY(canvasHeight / 2);
      setBirdVelocity(0);
      setPipes([{ x: canvasWidth, gapY: Math.random() * (canvasHeight - pipeGap) }]);
      setGameStarted(true);
    } else {
      setBirdVelocity(jumpStrength);
      setGameStarted(true)
    }
  };


  return (
    <div
      onClick={handleInput}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'skyblue',
      }}
    >
        <canvas
          ref={canvasRef}
          width={canvasWidth || 0}
          height={canvasHeight || 0}
          onClick={handleInput}
        />
      </div>
  );
};
export default Home;
