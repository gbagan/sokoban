<script lang="ts">
  import { onMount } from "svelte";
  import LevelSelection from "./components/LevelSelection.svelte";
  import { arrayOf, update } from "@gbagan/utils";
  import Game from "./components/Game.svelte";

  const LEVEL_COUNT = 184;

  let currentLevel: number | null = $state.raw(null);
  let previousLevel = $state.raw(0);
  let levelTexts: string[][] | null = $state.raw(null);
  let bestScores: number[] = $state.raw(getBestScores());

  function getBestScores(): number[] {
    const data = localStorage.getItem("sokoban");
    if (data === null) {
      return arrayOf(LEVEL_COUNT, 0);
    }
    return JSON.parse(data)
  }

  function completeLevel(pushCount: number) {
    bestScores = update(bestScores, [currentLevel!], s => s === 0 ? pushCount : Math.min(s, pushCount));
    localStorage.setItem("sokoban", JSON.stringify(bestScores));
  }

  function loadLevel(i: number) {
    currentLevel = i;
  }

  function goToLevelSelection() {
    previousLevel = currentLevel!;
    currentLevel = null;
  }

  function goToNextLevel() {
    currentLevel = Math.min(currentLevel! + 1, levelTexts!.length - 1)
  }

  onMount(async () => {
    const request = new Request("./levels.json");
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error("Levels cannot be loaded");
    }
    levelTexts = await response.json();
  });
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
    {completeLevel}
    {goToLevelSelection}
    {goToNextLevel}
  />
{/if}