<script lang="ts">
  import { Board } from "../model.svelte";
  import { range } from "@gbagan/utils";
  import BoardView from "./BoardView.svelte";

  type Props = {
    levels: string[][];
    bestScores: number[];
    play: (level: number) => void;
  }

  let {levels, bestScores, play}: Props = $props();

  let board: Board | null = $state(null);
  let selected = $state(-1);
  let levelSection = $state(0);

  function selectLevel(i: number) {
    selected = i;
    board = new Board();
    board.load(levels[i]);
  }
</script>
<main>
  <div class="col">
    <div class="levels">
      {#each range(levelSection*30, levelSection*30+30) as i}
        <button
          class={["level", {selected: selected === i, finished: bestScores[i] > 0}]}
          onclick={() => selectLevel(i)}
        >
          {i+1}
        </button>
      {/each}
    </div>
    <div class="level-section">
      {#each range(0, 6) as i}
        <button
          class={["level section", {selected: levelSection === i}]}
          onclick={() => levelSection = i}
        >
          {i*30+1}-{i*30+30}
        </button>
      {/each}
    </div>  
  </div>
  <div class="right">
    <div class="preview">
      {#if board !== null}
        {#key selected}
          <BoardView {board} />
        {/key}
      {/if}
    </div>
    <div>
      <button
        class="ui-button"
        disabled={selected === -1}
        onclick={() => play(selected)}
      >
        Jouer
      </button>
      {#if selected >= 0 && bestScores[selected] > 0}
        <span style:color="green">Terminé en {bestScores[selected]} mouvements</span>
      {:else if selected >= 0 && bestScores[selected] === 0}
        <span style:color="red">Non terminé</span>
      {/if}
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 2rem;
  }

  @media (orientation: portrait) {
    main {
      flex-direction: column;
    }
  }

  .col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .levels {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 1rem;
    width: 30rem;
  }

  .level-section {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 1rem;
  }

  .level {
    line-height: 1.15;
    color: rgba(0, 0, 0, 0.65);
    width: 3.6rem;
    height: 3.6rem;
    border: thin solid gray;
    display: inline-flex;
    align-items : center;
    justify-content: center;
    cursor: pointer;
    border-radius: 0.7rem;
    opacity: 1;
    transition: opacity 0.3s ease;
    padding: 0.3rem;
    background-color: transparent;
    outline: 0;
  
    &.section {
      width: 4.5rem;
    }

    &.selected {
      border: medium solid blue;
    }

    &.finished {
        background-color: lightgreen;
    }
  }

  .preview {
    width: min(90vmin, 30rem);
    height: min(75vmin, 25rem);
    padding: 1rem;
    border: thin solid gray;
  }

  .right {
    display: flex;
    flex-direction: column;
  }
</style>