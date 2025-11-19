<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  const GRID_SIZE = 20;
  const CELL_SIZE = 20; // px
  const SPEED = 200;

  let snake = $state([{ x: 10, y: 10 }]);
  let food = $state({ x: 15, y: 15 });
  let direction = $state({ x: 0, y: 0 });
  let score = $state(0);
  let gameOver = $state(false);
  let gameLoop: any;
  let hasStarted = $state(false);

  function startGame() {
    // Start with length of 3
    snake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    food = getRandomPosition();
    direction = { x: 0, y: -1 }; // Start moving up so we don't crash into ourselves immediately
    score = 0;
    gameOver = false;
    hasStarted = true;
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, SPEED);
  }

  function getRandomPosition() {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }

  function update() {
    if (gameOver) return;

    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      endGame();
      return;
    }

    // Self collision
    if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      endGame();
      return;
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      food = getRandomPosition();
      // Ensure food doesn't spawn on snake
      while (snake.some((s) => s.x === food.x && s.y === food.y)) {
        food = getRandomPosition();
      }
    } else {
      snake.pop();
    }
  }

  function endGame() {
    gameOver = true;
    clearInterval(gameLoop);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!hasStarted) return;

    switch (e.key) {
      case "ArrowUp":
        if (direction.y === 0) direction = { x: 0, y: -1 };
        e.preventDefault();
        break;
      case "ArrowDown":
        if (direction.y === 0) direction = { x: 0, y: 1 };
        e.preventDefault();
        break;
      case "ArrowLeft":
        if (direction.x === 0) direction = { x: -1, y: 0 };
        e.preventDefault();
        break;
      case "ArrowRight":
        if (direction.x === 0) direction = { x: 1, y: 0 };
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
    style="width: {GRID_SIZE * CELL_SIZE}px; height: {GRID_SIZE * CELL_SIZE}px;"
  >
    {#if !hasStarted}
      <div class="absolute inset-0 flex items-center justify-center bg-black/10">
        <button class="neo-button" onclick={startGame}>START GAME</button>
      </div>
    {/if}

    {#if gameOver}
      <div class="absolute inset-0 z-10 flex items-center justify-center bg-black/10">
        <button class="neo-button" onclick={startGame}>TRY AGAIN</button>
      </div>
    {/if}

    <!-- Food -->
    <div
      class="bg-neo-primary border-neo-border absolute border-2"
      style="left: {food.x * CELL_SIZE}px; top: {food.y * CELL_SIZE}px; width: {CELL_SIZE}px; height: {CELL_SIZE}px;"
    ></div>

    <!-- Snake -->
    {#each snake as segment, i}
      <div
        class="border-neo-border absolute border {i === 0 ? 'bg-neo-text' : 'bg-neo-secondary'}"
        style="left: {segment.x * CELL_SIZE}px; top: {segment.y *
          CELL_SIZE}px; width: {CELL_SIZE}px; height: {CELL_SIZE}px;"
      ></div>
    {/each}
  </div>

  <p class="text-neo-text/70 text-sm font-bold">Use Arrow Keys to Move</p>
</div>
