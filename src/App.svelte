<script lang="ts">
  import { onMount, untrack } from "svelte";
  import BoardView from "./components/BoardView.svelte";
  import LevelSelection from "./components/LevelSelection.svelte";
  import { Board, Direction } from "./model.svelte";
  import { arrayOf } from "./util";
    import { confetti } from "./confetti";

  const LEVEL_COUNT = 184;

  type Mode = "game" | "selection";

  let currentLevel = $state(-1);
  let board = $state(new Board());
  let mode: Mode = $state("game");
  let levelTexts: string[][] = $state.raw([]);
  let finishedLevels: boolean[] = $state(getFinishedLevels());
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

  function getFinishedLevels(): boolean[] {
    const data = localStorage.getItem("sokoban");
    if (data === null) {
      return arrayOf(LEVEL_COUNT, false);
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
        console.log("plop");
        finishedLevels[currentLevel] = true;
        localStorage.setItem("sokoban", JSON.stringify(finishedLevels));
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
    <div>
      <button class="ui-button" onclick={undo}>Annuler</button>
      <button class="ui-button" onclick={selectLevel}>Choisir un niveau</button>
    </div>
    <main>
      <BoardView {board} />
    </main>
  </div>
{:else}
  <LevelSelection levels={levelTexts} {finishedLevels} play={loadLevel} />
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

  main {
    width: 800px;
    height: 800px;
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