<script lang="ts">
  import SnakeGame from "./snake-game.svelte";
  import TetrisGame from "./tetris-game.svelte";

  let activeGame = $state<"menu" | "snake" | "tetris">("menu");

  function selectGame(game: "snake" | "tetris") {
    activeGame = game;
  }

  function backToMenu() {
    activeGame = "menu";
  }
</script>

<div class="flex w-full flex-col items-center">
  {#if activeGame === "menu"}
    <div class="flex w-full max-w-xs flex-col gap-4">
      <h3 class="mb-2 text-center text-xl font-black">SELECT GAME</h3>
      <button class="neo-button flex w-full items-center justify-between" onclick={() => selectGame("snake")}>
        <span>SNAKE</span>
        <span>🐍</span>
      </button>
      <button class="neo-button flex w-full items-center justify-between" onclick={() => selectGame("tetris")}>
        <span>TETRIS</span>
        <span>🧱</span>
      </button>
    </div>
  {:else}
    <div class="flex w-full flex-col items-center">
      <button class="hover:text-neo-primary mb-4 self-start text-xs font-bold underline" onclick={backToMenu}>
        &larr; BACK TO MENU
      </button>

      {#if activeGame === "snake"}
        <SnakeGame />
      {:else if activeGame === "tetris"}
        <TetrisGame />
      {/if}
    </div>
  {/if}
</div>
