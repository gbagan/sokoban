<script lang="ts">
  import { Direction, Tile, type Board } from "../model.svelte";
  import { divMod } from "../util";
  
  type Props = {
    board: Board;
  }

  let {board}: Props = $props();

  const heroSprite = {
    [Direction.North]: "./sprites/player_north.png",
    [Direction.South]: "./sprites/player_south.png",
    [Direction.West]: "./sprites/player_west.png",
    [Direction.East]: "./sprites/player_east.png",
  }
</script>


<main>
  {#if board.width > 0 && board.height > 0}
    {@const [heroY, heroX] = divMod(board.hero, board.width)}
    <svg viewBox="-{500-25*board.width} -{425-25*board.height} 1000 850">
      {#each board.grid as tile, idx}
        {@const [y, x] = divMod(idx, board.width)}  
        {#if tile === Tile.Wall}
          <image
            href="./sprites/block.png"
            width="50"
            height="50"
            style:transform="translate({50*x}px, {50*y}px)"
          />
        {:else if tile === Tile.Ground}
          <image
            href="./sprites/ground.png"
            width="50"
            height="50"
            style:transform="translate({50*x}px, {50*y}px)"
          />
        {:else if tile === Tile.Target}
          <image
            href="./sprites/ground.png"
            width="51"
            height="51"
            style:transform="translate({50*x}px, {50*y}px)"
          />
          <image
            href="./sprites/target.png"
            width="50"
            height="50"
            style:transform="translate({50*x}px, {50*y}px)"
          />
        {/if}
      {/each}
      {#each board.boxes as box}
        {@const [y, x] = divMod(box, board.width)}
        <image
          href={board.grid[box] === Tile.Target ? "./sprites/crate2.png" : "./sprites/crate.png"}
          width="50"
          height="50"
          class="object"
          style:transform="translate({50*x}px, {50*y}px)"
        />
      {/each}
      <image
        href={heroSprite[board.heroDirection]}
        width="50"
        height="50"
        class="object"
        style:transform="translate({50*heroX}px, {50*heroY}px)"
      />
    </svg>
  {/if}
</main>

<style>
  .object {
    transition: transform 150ms linear;
  }
</style>