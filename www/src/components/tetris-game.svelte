<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  const COLS = 10;
  const ROWS = 20;
  const BLOCK_SIZE = 20;
  const COLORS = [
    "bg-neo-bg", // Empty
    "bg-neo-primary", // I
    "bg-neo-secondary", // J
    "bg-neo-tertiary", // L
    "bg-blue-400", // O
    "bg-green-400", // S
    "bg-purple-400", // T
    "bg-orange-400", // Z
  ];

  const SHAPES = [
    [],
    [[1, 1, 1, 1]], // I
    [
      [1, 0, 0],
      [1, 1, 1],
    ], // J
    [
      [0, 0, 1],
      [1, 1, 1],
    ], // L
    [
      [1, 1],
      [1, 1],
    ], // O
    [
      [0, 1, 1],
      [1, 1, 0],
    ], // S
    [
      [0, 1, 0],
      [1, 1, 1],
    ], // T
    [
      [1, 1, 0],
      [0, 1, 1],
    ], // Z
  ];

  let grid = $state(createGrid());
  let piece = $state(randomPiece());
  let score = $state(0);
  let gameOver = $state(false);
  let gameLoop: any;
  let hasStarted = $state(false);

  function createGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  function randomPiece() {
    const typeId = Math.floor(Math.random() * 7) + 1;
    const shape = SHAPES[typeId];
    return {
      shape,
      typeId,
      x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
      y: 0,
    };
  }

  function startGame() {
    grid = createGrid();
    piece = randomPiece();
    score = 0;
    gameOver = false;
    hasStarted = true;
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, 500);
  }

  function update() {
    if (gameOver) return;
    move(0, 1);
  }

  function move(dx: number, dy: number) {
    piece.x += dx;
    piece.y += dy;
    if (checkCollision()) {
      piece.x -= dx;
      piece.y -= dy;
      if (dy > 0) {
        freeze();
        clearLines();
        piece = randomPiece();
        if (checkCollision()) {
          gameOver = true;
          clearInterval(gameLoop);
        }
      }
      return false;
    }
    return true;
  }

  function rotate() {
    const originalShape = piece.shape;
    piece.shape = piece.shape[0].map((_, i) => piece.shape.map((row) => row[i]).reverse());
    if (checkCollision()) {
      piece.shape = originalShape;
    }
  }

  function checkCollision() {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const newX = piece.x + x;
          const newY = piece.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && grid[newY][newX] !== 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function freeze() {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          // Check if within bounds before assigning
          if (piece.y + y >= 0 && piece.y + y < ROWS && piece.x + x >= 0 && piece.x + x < COLS) {
            grid[piece.y + y][piece.x + x] = piece.typeId;
          }
        }
      }
    }
  }

  function clearLines() {
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (grid[y].every((cell) => cell !== 0)) {
        grid.splice(y, 1);
        grid.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++; // Check same row again
      }
    }
    if (linesCleared > 0) {
      score += linesCleared * 100;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!hasStarted || gameOver) return;

    switch (e.key) {
      case "ArrowLeft":
        move(-1, 0);
        e.preventDefault();
        break;
      case "ArrowRight":
        move(1, 0);
        e.preventDefault();
        break;
      case "ArrowDown":
        move(0, 1);
        e.preventDefault();
        break;
      case "ArrowUp":
        rotate();
        e.preventDefault();
        break;
    }
  }

  onDestroy(() => {
    if (gameLoop) clearInterval(gameLoop);
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex flex-col items-center gap-4">
  <div class="flex w-full justify-between text-xl font-black">
    <span>SCORE: {score}</span>
    {#if gameOver}
      <span class="text-neo-primary">GAME OVER</span>
    {/if}
  </div>

  <div
    class="border-neo-border bg-neo-bg shadow-neo relative border-4"
    style="width: {COLS * BLOCK_SIZE}px; height: {ROWS * BLOCK_SIZE}px;"
  >
    {#if !hasStarted}
      <div class="absolute inset-0 z-10 flex items-center justify-center bg-black/10">
        <button class="neo-button" onclick={startGame}>START GAME</button>
      </div>
    {/if}

    {#if gameOver}
      <div class="absolute inset-0 z-10 flex items-center justify-center bg-black/10">
        <button class="neo-button" onclick={startGame}>TRY AGAIN</button>
      </div>
    {/if}

    <!-- Grid -->
    {#each grid as row, y}
      {#each row as cell, x}
        {#if cell !== 0}
          <div
            class="border-neo-border absolute border {COLORS[cell]}"
            style="left: {x * BLOCK_SIZE}px; top: {y * BLOCK_SIZE}px; width: {BLOCK_SIZE}px; height: {BLOCK_SIZE}px;"
          ></div>
        {/if}
      {/each}
    {/each}

    <!-- Active Piece -->
    {#if hasStarted && !gameOver}
      {#each piece.shape as row, y}
        {#each row as cell, x}
          {#if cell !== 0}
            <div
              class="border-neo-border absolute border {COLORS[piece.typeId]}"
              style="left: {(piece.x + x) * BLOCK_SIZE}px; top: {(piece.y + y) *
                BLOCK_SIZE}px; width: {BLOCK_SIZE}px; height: {BLOCK_SIZE}px;"
            ></div>
          {/if}
        {/each}
      {/each}
    {/if}
  </div>

  <p class="text-neo-text/70 text-sm font-bold">Arrows: Move/Rotate</p>
</div>
