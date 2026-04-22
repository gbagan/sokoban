<script lang="ts">
  import { Board } from "../model.svelte";
  import { range } from "../util";
  import BoardView from "./BoardView.svelte";

  type Props = {
    levels: string[][];
    play: (level: number) => void;
  }

  let {levels, play}: Props = $props();

  let board: Board | null = $state(null);
  let selected = $state(-1);

  function selectLevel(i: number) {
    selected = i;
    board = new Board();
    board.load(levels[i]);
  } 
</script>
<main>
  <div class="levels">
    {#each range(1, 91) as i}
      <button class={["level", {selected: selected === i}]} onclick={() => selectLevel(i)}>{i+1}</button>
    {/each}
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
      <button disabled={selected === -1} onclick={() => play(selected)}>Jouer</button>
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .levels {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-gap: 1rem;
    width: 45rem;
  }

  .level {
    line-height: 1.15;
    color: rgba(0, 0, 0, 0.65);
    max-width: 3.6rem;
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
  
    &.selected {
      border: medium solid blue;
    }
  }

  .preview {
    width: 30rem;
    height: 25rem;
    padding: 1rem;
    border: thin solid gray;
  }

  .right {
    display: flex;
    flex-direction: column;
  }
</style>