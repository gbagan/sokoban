<script lang="ts">
  import { onMount, untrack } from "svelte";
  import BoardView from "./components/BoardView.svelte";
  import LevelSelection from "./components/LevelSelection.svelte";
  import { Board, Direction } from "./model.svelte";
  import { arrayOf } from "./util";
  import { confetti } from "./confetti";
    import Joypad from "./components/Joypad.svelte";

  const LEVEL_COUNT = 184;

  type Mode = "game" | "selection";

  let currentLevel = $state(-1);
  let board = $state(new Board());
  let mode: Mode = $state("game");
  let levelTexts: string[][] = $state.raw([]);
  let bestScores: number[] = $state(getBestScores());
  let isLevelFinished = $derived(currentLevel >= 0 && board.isLevelFinished());

  function loadLevel(i: number) {
    mode = "game";
    currentLevel = i;
    board.load(levelTexts[i]);
  }

  function selectLevel () {
    mode = "selection";
  }

  function undo() {
    if (isLevelFinished) {
      return;
    }
    board.undo();
  }

  function getBestScores(): number[] {
    const data = localStorage.getItem("sokoban");
    if (data === null) {
      return arrayOf(LEVEL_COUNT, 0);
    }
    return JSON.parse(data)
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

  $effect(() => {
    if (isLevelFinished) {
      untrack(() => {
        const score = board.moveCount();
        const lastScore = bestScores[currentLevel];
        const newScore = lastScore === 0 ? score : Math.min(score, lastScore);
        bestScores[currentLevel] = newScore;
        localStorage.setItem("sokoban", JSON.stringify(bestScores));
      })
    }
  })

  function handleKeydown(ev: KeyboardEvent) {
    if (isLevelFinished) {
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
    <header>
      <button class="ui-button" onclick={undo}>Annuler</button>
      <button class="ui-button" onclick={selectLevel}>Choisir un niveau</button>
      <span class="moves">Mouvements: {board.moveCount()}</span>
    </header>
    <div class="game-sub-container">
      <main>
        <BoardView {board} />
      </main>
      <Joypad move={dir => board.move(dir)} />
    </div>
  </div>
{:else}
  <LevelSelection levels={levelTexts} {bestScores} play={loadLevel} />
{/if}
{#if isLevelFinished}
  <div class="confetti-container">
    <div use:confetti={{stageHeight: "100vh", stageWidth: "100vw"}}></div>
  </div>
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

  .game-sub-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  @media (orientation: portrait) {
    .game-sub-container {
      flex-direction: column;
    }
  }

  main {
    width: min(90vmin, 800px);
    height: min(90vmin, 800px);
  }

  header {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }

  .moves {
    color: blue;
  }

  .confetti-container {
    position: fixed;
    top: 15vh;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: flex;
    justify-content: center;
    z-index: 400;
  }
</style>