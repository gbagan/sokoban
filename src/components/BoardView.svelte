<script lang="ts">
  import { Direction, Tile, type Board } from "../model.svelte";
  import { divMod } from "@gbagan/utils";
  
  type Props = {
    board: Board;
  }

  let {board}: Props = $props();

  const heroSprite = {
    [Direction.North]: "./sprites/player-north.avif",
    [Direction.South]: "./sprites/player-south.avif",
    [Direction.West]: "./sprites/player-west.avif",
    [Direction.East]: "./sprites/player-east.avif",
  }
</script>

<main>
  {#if board.width > 0 && board.height > 0}
    {@const [heroY, heroX] = divMod(board.hero, board.width)}
    <svg viewBox="-{500-25*board.width} -{425-25*board.height} 1000 850">
      <filter id="darken">
        <feColorMatrix values="0.3 0 0 0 0
                               0 0.3 0 0 0
                               0 0 0.3 0 0
                               0 0 0 1 0"/>
      </filter>
      {#each board.grid as tile, idx}
        {@const [y, x] = divMod(idx, board.width)}  
        {#if tile === Tile.Wall}
          <image
            href="./sprites/block.avif"
            width="50"
            height="50"
            style:transform="translate({50*x}px, {50*y}px)"
          />
        {:else if tile === Tile.Ground}
          <image
            href="./sprites/ground.avif"
            width="50"
            height="50"
            preserveAspectRatio="none"
            style:transform="translate({50*x}px, {50*y}px)"
          />
        {:else if tile === Tile.Target}
          <image
            href="./sprites/ground.avif"
            width="51"
            height="51"
            preserveAspectRatio="none"
            style:transform="translate({50*x}px, {50*y}px)"
          />
          <image
            href="./sprites/target.avif"
            width="50"
            height="50"
            style:transform="translate({50*x}px, {50*y}px)"
          />
        {/if}
      {/each}
      {#each board.boxes as box}
        {@const [y, x] = divMod(box, board.width)}
        <image
          href="./sprites/crate.avif"
          width="50"
          height="50"
          class="object"
          class:over-target={board.grid[box] === Tile.Target}
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
  main {
    width: 100%;
    height: 100%;
  }

  .object {
    transition: transform 150ms linear;
    &.over-target {
      filter: url("#darken");
    }
  }
</style>