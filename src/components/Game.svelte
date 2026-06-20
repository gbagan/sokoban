<script lang="ts">
  import { Board, Direction } from "../model.svelte";
  import BoardView from "./BoardView.svelte";

  type Props = {
    level: number;
    text: string[];
    finished: boolean;
    quitLevel: () => void;
  };

  let { level, text, finished, quitLevel }: Props = $props();

  let version = $state.raw(0);

  let board = $derived.by(() => {
    version;
    return new Board(text);
  });

  let isLevelFinished = $derived(board.isLevelFinished());

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

  function handleQuitLevel() {
    quitLevel();
  }

  function restart() {
    version++;
  }

  function undo() {
    if (isLevelFinished) {
      return;
    }
    board.undo();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<main class="sokoban-page">
  <header class="game-header">
    <button class="top-button" onclick={undo}>↩ Annuler</button>
    <button class="top-button" onclick={handleQuitLevel}>▦ Choisir un niveau</button>
    <div class="move-counter">📦 Poussées : {board.pushCount}</div>
  </header>

  <section class="game-layout">
    <aside class="side-panel">
      <h2 class="panel-title">Objectif</h2>

      <div class="objective-content">
        <div class="objective-row">
          <div class="objective-icon">📦</div>
          <div>Poussez toutes les caisses sur les cibles.</div>
        </div>

        <div class="status-list">
          <div class="status-chip level">🔷 Niveau {level + 1}</div>
          {#if finished}
            <div class="status-chip completed">✅ Terminé</div>
          {:else}
            <div class="status-chip not-completed">🚩 Non terminé</div>
          {/if}
          <button class="replay-button" onclick={restart}>↻ Rejouer</button>
        </div>
      </div>
    </aside>

    <section class="board-panel">
      <div class="board-frame">
        <BoardView {board} />
      </div>
    </section>

    <aside class="side-panel controls-panel">
      <div class="dpad">
        <button class="dpad-button up" onclick={() => board.move(Direction.North)}>▲</button>
        <button class="dpad-button left" onclick={() => board.move(Direction.West)}>◀</button>
        <button class="dpad-button right" onclick={() => board.move(Direction.East)}>▶</button>
        <button class="dpad-button down" onclick={() => board.move(Direction.South)}>▼</button>
      </div>
    </aside>
  </section>
</main>

<style>
.sokoban-page {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 1rem;

  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1.25rem;

  color: var(--amber-950);

  background:
    radial-gradient(circle at 8% 8%, rgb(255 255 255 / 0.85), transparent 24%),
    radial-gradient(circle at 92% 90%, rgb(251 191 36 / 0.22), transparent 26%),
    linear-gradient(135deg, #fff7ed, #ffedd5);
}

/* Barre du haut */

.game-header {
  width: 45rem;
  margin-inline: auto;

  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 1rem;
  align-items: center;

  padding: 1rem 1.375rem;
  border-radius: 1.375rem;

  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.92), rgb(255 248 236 / 0.95));
  box-shadow: var(--shadow-panel);
  border: 2px solid rgb(255 255 255 / 0.85);
}

.game-title {
  grid-column: 1 / -1;
  justify-self: center;

  margin: -3rem 0 4px;
  padding: 0.625rem 3.5rem;

  color: white;
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 950;
  letter-spacing: 0.04em;
  text-shadow: 0 3px 0 rgb(0 0 0 / 0.28);

  border-radius: 18px;
  border: 3px solid var(--amber-950);
  background:
    linear-gradient(
      180deg,
      var(--amber-600),
      var(--amber-800)
    );

  box-shadow:
    0 7px 0 var(--amber-950),
    0 14px 20px color-mix(in srgb, var(--amber-950) 25%, transparent);
}

.top-button {
  min-height: 2.75rem;
  padding: 0 1.375rem;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  border: 2px solid color-mix(in srgb, var(--amber-800) 25%, transparent);
  border-radius: var(--radius-button);

  color: var(--amber-950);
  background:
    linear-gradient(180deg, #fffdf7, #ffefd2);

  font-size: 1rem;
  font-weight: 750;

  box-shadow: var(--shadow-button);
  cursor: pointer;

  transition:
    transform 150ms ease,
    box-shadow 150ms ease,
    filter 150ms ease;
}

.top-button:hover {
  transform: translateY(-2px);
  filter: brightness(1.02);
}

.top-button:active {
  transform: translateY(2px);
  box-shadow:
    0 2px 0 color-mix(in srgb, var(--amber-950) 25%, transparent);
}

.move-counter {
  justify-self: end;

  height: 3rem;
  padding: 0 30px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.675rem;

  border-radius: var(--radius-button);
  border: 2px solid color-mix(in srgb, var(--blue-600) 20%, transparent);

  color: var(--blue-600);
  background:
    linear-gradient(180deg, #eff6ff, #dbeafe);

  font-size: 1.35rem;
  font-weight: 900;

  box-shadow:
    0 5px 0 color-mix(in srgb, var(--blue-600) 25%, transparent),
    inset 0 2px 0 rgb(255 255 255 / 0.75);
}

/* Layout principal */

.game-layout {
  display: flex;
  align-items: space-around;
  justify-content: center;
  gap: 1.25rem;
  align-items: center;
}

/* Cartes latérales */

.side-panel {
  width: 15rem;
  border-radius: var(--radius-panel);
  padding: 1.5rem 1.25rem;

  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.9), var(--panel));
  border: 3px solid rgb(255 255 255 / 0.82);
  box-shadow: var(--shadow-panel);
}

.panel-title {
  width: fit-content;
  margin: 0 auto 1.5rem;
  padding: 0.625rem 1.5rem;

  color: white;
  font-size: 1.35rem;
  font-weight: 900;
  text-shadow: 0 2px 0 rgb(0 0 0 / 0.28);

  border-radius: 0.75rem;
  border: 2px solid var(--amber-950);
  background:
    linear-gradient(180deg, var(--amber-600), var(--amber-800));

  box-shadow:
    0 5px 0 var(--amber-950),
    0 8px 14px color-mix(in srgb, var(--amber-950) 20%, transparent);
}

.objective-content {
  display: grid;
  gap: 0.875rem;
}

.objective-row {
  display: grid;
  grid-template-columns: 3rem 1fr;
  gap: 0.875rem;
  align-items: center;

  font-size: 1.05rem;
  font-weight: 650;
  line-height: 1.35;
}

.objective-icon {
  width: 3rem;
  aspect-ratio: 1;

  display: grid;
  place-items: center;

  border-radius: 14px;
  background:
    linear-gradient(180deg, var(--orange-200), var(--orange-300));
  box-shadow:
    inset 0 2px 0 rgb(255 255 255 / 0.65),
    0 4px 0 rgb(124 45 18 / 0.18);
}

.status-list {
  margin-top: 14px;
  padding-top: 20px;

  display: grid;
  gap: 12px;

  border-top: 2px dashed rgb(146 64 14 / 0.22);
}

.status-chip {
  min-height: 54px;
  padding: 0 18px;

  display: flex;
  align-items: center;
  gap: 12px;

  border-radius: 14px;
  border: 2px solid rgb(146 64 14 / 0.16);
  background:
    linear-gradient(180deg, #fffdf7, #fff1d8);

  font-size: 1.05rem;
  font-weight: 850;

  &.level {
    color: var(--blue-600);
    border-color: color-mix(in srgb, var(--blue-600) 22%, transparent);
    background:
      linear-gradient(180deg, var(--blue-50), var(--blue-100));
  }

  &.not-completed {
    color: var(--red-600);
    border-color: color-mix(in srgb, var(--red-600) 25%, transparent);
    background:
      linear-gradient(180deg, var(--orange-50), var(--orange-100));
  }

  &.completed {
    color: var(--green-600);
    border-color: color-mix(in srgb, var(--green-600) 25%, transparent);
    background:
      linear-gradient(180deg, var(--green-50), var(--green-100));
  }
}

.replay-button {
  margin-top: 8px;
  min-height: 66px;
  width: 100%;

  border: 0;
  border-radius: 18px;

  color: white;
  background:
    linear-gradient(180deg, var(--blue-400), var(--blue-600));

  font-size: 1.45rem;
  font-weight: 950;
  text-shadow: 0 2px 0 rgb(0 0 0 / 0.22);

  box-shadow:
    0 7px 0 var(--blue-800),
    0 12px 20px rgb(37 99 235 / 0.22),
    inset 0 3px 0 rgb(255 255 255 / 0.35);

  cursor: pointer;
}

.replay-button:hover {
  transform: translateY(-2px);
}

.replay-button:active {
  transform: translateY(3px);
  box-shadow:
    0 4px 0 var(--blue-800),
    inset 0 3px 0 rgb(255 255 255 / 0.25);
}

/* Plateau central */

.board-panel {
  padding: 1.5rem;

  border-radius: 1.75rem;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.92), #fff0d6);
  border: 3px solid rgb(255 255 255 / 0.9);
  box-shadow: var(--shadow-panel);
}

.board-frame {
  width: 45rem;
  height: 38rem;

  display: grid;
  place-items: center;

  border-radius: 24px;
  background:
    radial-gradient(circle at center, #ffe8bf, #f8d89d);
  box-shadow:
    inset 0 5px 16px rgb(120 72 20 / 0.16),
    inset 0 0 0 2px rgb(255 255 255 / 0.45);
}

.controls-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dpad {
  display: grid;
  grid-template-columns: repeat(3, 4rem);
  grid-template-rows: repeat(3, 4rem);
  gap: 0.625rem;
}

.dpad-button {
  border: 0;
  border-radius: 1rem;

  display: grid;
  place-items: center;

  color: white;
  background:
    linear-gradient(180deg, var(--gray-600), var(--gray-950));

  font-size: 2rem;
  font-weight: 900;

  box-shadow:
    0 6px 0 #181818,
    0 10px 18px rgb(0 0 0 / 0.18),
    inset 0 2px 0 rgb(255 255 255 / 0.16);

  cursor: pointer;
  user-select: none;

  transition:
    transform 120ms ease,
    box-shadow 120ms ease,
    filter 120ms ease;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.08);
  }

  &:active {
    transform: translateY(3px);
    box-shadow:
      0 3px 0 #181818,
      inset 0 2px 0 rgb(255 255 255 / 0.1);
  }

  &.up {
    grid-column: 2;
    grid-row: 1;
  }

  &.left {
    grid-column: 1;
    grid-row: 2;
  }

  &.right {
    grid-column: 3;
    grid-row: 2;
  }

  &.down {
    grid-column: 2;
    grid-row: 3;
  }
}
</style>