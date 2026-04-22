<script lang="ts">
  import { onMount } from "svelte";
  import BoardView from "./components/BoardView.svelte";
  import LevelSelection from "./components/LevelSelection.svelte";
  import { Board, Direction } from "./model.svelte";
  
  type Mode = "game" | "selection";

  let board = $state(new Board());
  let mode: Mode = $state("game");
  let levelTexts: string[][] = $state.raw([]);
  let levelFinished = $derived(board.isLevelFinished());

  function loadLevel(i: number) {
    mode = "game";
    board.load(levelTexts[i]);
  }

  function selectLevel () {
    mode = "selection";
  }

  function undo() {
    if (levelFinished) {
      return;
    }
    board.undo();
  }

  onMount(async () => {
    const request = new Request("./levels.json");
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error("plop");
    }
    levelTexts = await response.json();
    loadLevel(0);
  });

  function handleKeydown(ev: KeyboardEvent) {
    if (levelFinished) {
      return;
    }
    let prev = true;
    switch (ev.key) {
      case "ArrowUp":
        board.move(Direction.North);
        break;
      case "ArrowDown":
        board.move(Direction.South);
        break;
      case "ArrowLeft":
        board.move(Direction.West);
        break;
      case "ArrowRight":
        board.move(Direction.East);
        break;
      default:
        prev = false;
    }
    if (prev) {
      ev.preventDefault();
    }
  }
</script>

{#if mode === "game"}
  <div class="game-container">
    <div>
      <button onclick={undo}>Annuler</button>
      <button onclick={selectLevel}>Choisir un niveau</button>
    </div>
    <main>
      <BoardView {board} />
    </main>
  </div>
{:else}
  <LevelSelection levels={levelTexts} play={loadLevel} />
{/if}


<svelte:window onkeydown={handleKeydown} />

<style>
  .game-container {
    width: 100vw;
    margin: 0 auto;
    text-align: center;
    border-inline: 1px solid var(--border);
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    align-items: center;
    gap: 2rem;
  }

  main {
    width: 800px;
    height: 800px;
  }
</style>