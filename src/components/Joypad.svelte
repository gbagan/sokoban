<script lang="ts">
  import { Direction } from "../model.svelte";

  type Props = {
    move: (dir: Direction) => void;
  }

  let {move}: Props = $props();
</script>

<div class="dpad">
  <button onpointerdown={() => move(Direction.North)}>▲</button>
  <div class="middle">
    <button onpointerdown={() => move(Direction.West)}>◀</button>
    <div class="center"></div>
    <button onpointerdown={() => move(Direction.East)}>▶</button>
  </div>
  <button onpointerdown={() => move(Direction.South)}>▼</button>
</div>

<style>
  .dpad {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  button {
    width: 60px;
    height: 60px;
    margin: 5px;
    font-size: 20px;
    border: none;
    border-radius: 12px;
    background: #333;
    color: white;
    box-shadow: 0 4px #111;
    transition: all 0.1s;
  }

  .middle {
    display: flex;
    align-items: center;
  }

  .center {
    width: 60px;
    height: 60px;
  }


  button:active {
    transform: translateY(4px);
    box-shadow: 0 1px #111;
  }
</style>