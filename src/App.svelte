<script lang="ts">
  import { onMount } from "svelte";
  import LevelSelection from "./components/LevelSelection.svelte";
  import { arrayOf } from "@gbagan/utils";
  import Game from "./components/Game.svelte";

  const LEVEL_COUNT = 184;

  let currentLevel: number | null = $state.raw(null);
  let previousLevel = $state.raw(0);
  let levelTexts: string[][] | null = $state.raw(null);
  let bestScores: number[] = $state(getBestScores());


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
  });

  /*

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

  <div class="confetti-container">
    <div use:confetti={{stageHeight: "100vh", stageWidth: "100vw"}}></div>
  </div>

*/
  function loadLevel(i: number) {
    currentLevel = i;
  }

  function quitLevel() {
    previousLevel = currentLevel!;
    currentLevel = null;
  }
</script>

{#if levelTexts === null}
  <div>Loading</div>
{:else if currentLevel === null}
  <LevelSelection levels={levelTexts} {previousLevel} {bestScores} play={loadLevel} />
{:else}
  <Game
    level={currentLevel}
    text={levelTexts[currentLevel]}
    finished={bestScores[currentLevel] > 0}
    {quitLevel}
  />
{/if}

<style>
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