<script lang="ts">
  import { Board } from "../model.svelte";
  import { range } from "@gbagan/utils";
  import BoardView from "./BoardView.svelte";

  type Props = {
    levels: string[][];
    previousLevel: number;
    bestScores: number[];
    play: (level: number) => void;
  }

  let {levels, previousLevel, bestScores, play}: Props = $props();

  let selected = $derived(previousLevel);
  let levelSection = $state(0);

  let board = $derived(new Board(levels[selected]));

  function selectLevel(i: number) {
    selected = i;
  }
</script>

<div class="container">
  <main class="level-screen">
    <section class="level-panel">
      <h1 class="level-title">Sélection du niveau</h1>
      <div class="level-grid">
        {#each range(levelSection*30, levelSection*30+30) as i}
          <button
            class={["level-button", {selected: selected === i, completed: bestScores[i] > 0}]}
            onclick={() => selectLevel(i)}
          >
            {i+1}
          </button>
        {/each}
      </div>
      <div class="level-pages">
        {#each range(0, 6) as i}
          <button
            class={["page-button", {selected: levelSection === i}]}
            onclick={() => levelSection = i}
          >
            {i*30+1}-{i*30+30}
          </button>
        {/each}
      </div>
    </section>

    <section class="preview-panel">
      <div class="preview-title">Niveau {selected+1}</div>

      <div class="level-preview">
        {#if board !== null}
          {#key selected}
            <BoardView {board} />
          {/key}
        {/if}
      </div>

      <div class="preview-actions">
        <button class="play-button" onclick={() => play(selected)}>▶ Jouer</button>
        {#if bestScores[selected] > 0}
          <div class="status-badge completed">🏁 Terminé</div>
        {:else}
          <div class="status-badge not-completed">🚩 Non terminé</div>
        {/if}
      </div>
    </section>
<!--
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
  -->
  </main>
</div>

<style>
.container {
  min-height: 100vh;
  color: var(--brown-900);

  background:
    radial-gradient(circle at 10% 10%, rgb(255 255 255 / 0.8), transparent 28%),
    radial-gradient(circle at 90% 85%, rgb(255 218 170 / 0.45), transparent 32%),
    linear-gradient(135deg, #fff7ed, var(--bg));

  display: flex;
  align-items: center;
  justify-content: center;
}

.level-screen {
  aspect-ratio: 16 / 9;
  width: min(100vw, calc(100vh * 16 / 9));
  height: min(100vh, calc(100vw * 9 / 16));
  box-sizing: border-box;
  padding: 2.5rem;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.75rem;
  align-items: center;
}

/* Cartes principales */

.level-panel,
.preview-panel {
  position: relative;
  border-radius: var(--radius-lg);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.9), rgb(255 248 236 / 0.95)),
    var(--panel);
  border: 3px solid rgb(255 255 255 / 0.85);
  box-shadow:
    var(--shadow-soft),
    inset 0 0 0 2px rgb(139 92 24 / 0.12);
}

.level-panel {
  padding: 4rem 2.25rem 2rem;
}

.preview-panel {
  padding: 2.25rem;
}

/* Titre panneau gauche */

.level-title {
  position: absolute;
  top: -1.75rem;
  left: 50%;
  transform: translateX(-50%);

  padding: 0.75rem 2rem;
  border-radius: 0.875rem;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 0.5px;
  text-shadow: 0 3px 0 rgb(0 0 0 / 0.25);

  background:
    linear-gradient(180deg, #b86b25, #7c3f12);
  border: 3px solid #5f2f0b;
  box-shadow:
    0 8px 0 #4b2608,
    0 12px 20px rgb(75 38 8 / 0.28);
}

/* Grille de niveaux */

.level-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.25rem;
}

.level-button {
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid rgb(124 63 18 / 0.25);
  border-radius: 1rem;

  color: var(--brown-900);
  font-size: 1.75rem;
  font-weight: 800;

  background:
    linear-gradient(180deg, #fffdf7, #fff0d6);
  box-shadow:
    var(--shadow-button),
    inset 0 2px 0 rgb(255 255 255 / 0.9);

  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease,
    background 160ms ease;
}

.level-button:hover {
  transform: translateY(-3px);
  box-shadow:
    0 8px 0 rgb(120 72 20 / 0.18),
    0 10px 18px rgb(120 72 20 / 0.15),
    inset 0 2px 0 rgb(255 255 255 / 0.95);
}

.level-button:active {
  transform: translateY(2px);
  box-shadow:
    0 2px 0 rgb(120 72 20 / 0.18),
    inset 0 2px 0 rgb(255 255 255 / 0.85);
}

/* Niveau terminé */

.level-button.completed {
  color: #14532d;
  border-color: rgb(34 197 94 / 0.7);
  background:
    linear-gradient(180deg, var(--green-200), var(--green-400));
  box-shadow:
    0 5px 0 rgb(21 128 61 / 0.35),
    inset 0 2px 0 rgb(255 255 255 / 0.7);
}

.level-button.completed::after {
  content: "✓";
  display: block;
  margin-top: -0.25rem;
  font-size: 1.25rem;
  color: var(--green-700);
}

/* Niveau sélectionné */

.level-button.selected {
  color: var(--blue-700);
  border: 4px solid var(--blue-600);
  background:
    linear-gradient(180deg, #ffffff, var(--blue-50));
  box-shadow:
    0 0 0 5px rgb(59 130 246 / 0.18),
    0 5px 0 rgb(37 99 235 / 0.35),
    inset 0 2px 0 rgb(255 255 255 / 0.9);
}

/* Pagination */

.level-pages {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px dashed rgb(161 98 7 / 0.22);

  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}

.page-button {
  min-height: 3.5rem;
  border: 2px solid rgb(124 63 18 / 0.2);
  border-radius: 0.8rem;

  color: var(--brown-700);
  font-size: 1rem;
  font-weight: 700;

  background:
    linear-gradient(180deg, #fffaf0, #ffeecf);
  box-shadow:
    0 4px 0 rgb(120 72 20 / 0.14),
    inset 0 2px 0 rgb(255 255 255 / 0.85);

  cursor: pointer;
}

.page-button.selected {
  color: white;
  border-color: var(--blue-700);
  background:
    linear-gradient(180deg, var(--blue-400), var(--blue-600));
  box-shadow:
    0 5px 0 var(--blue-800),
    inset 0 2px 0 rgb(255 255 255 / 0.35);
}

/* Panneau aperçu */

.preview-title {
  width: fit-content;
  margin: -1rem auto 1.5rem;
  padding: 0.675rem 3rem;

  color: white;
  font-size: 1.5rem;
  font-weight: 900;
  text-shadow: 0 2px 0 rgb(0 0 0 / 0.22);

  border-radius: 0.875rem;
  border: 3px solid var(--blue-800);
  background:
    linear-gradient(180deg, var(--blue-400), var(--blue-600));
  box-shadow:
    0 5px 0 #1e3a8a;
}

.level-preview {
  padding: 1.25rem;
  border-radius: 1.25rem;
  background:
    linear-gradient(180deg, #ffe8bf, #f7d9a8);
  border: 2px solid rgb(124 63 18 / 0.18);
  box-shadow:
    inset 0 3px 8px rgb(124 63 18 / 0.12);
}

.preview-actions {
  margin-top: 1.25rem;

  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
}

.play-button {
  height: 4rem;
  width: 20rem;
  border: 0;
  border-radius: 1rem;

  color: white;
  font-size: 1.75rem;
  font-weight: 950;
  letter-spacing: 0.4px;
  text-shadow: 0 3px 0 rgb(0 0 0 / 0.22);

  background:
    linear-gradient(180deg, var(--blue-400), var(--blue-600));
  box-shadow:
    0 7px 0 var(--blue-800),
    0 12px 20px rgb(37 99 235 / 0.22),
    inset 0 3px 0 rgb(255 255 255 / 0.35);

  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 10px 0 var(--blue-800),
      0 16px 26px rgb(37 99 235 / 0.26),
      inset 0 3px 0 rgb(255 255 255 / 0.35);
  }

  &:active {
    transform: translateY(3px);
    box-shadow:
      0 4px 0 var(--blue-800),
      inset 0 3px 0 rgb(255 255 255 / 0.28);
  }
}

.status-badge {
  min-height: 3rem;
  padding: 0 1.5rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  border-radius: 0.875rem;
  font-size: 1.25rem;
  font-weight: 800;

  &.not-completed {
    border: 2px solid var(--orange-400);
    color: var(--red-600);
    background: linear-gradient(
      180deg,
      var(--orange-50),
      var(--orange-100)
    );
  }

  &.completed {
    border: 2px solid var(--green-400);
    color: var(--green-700);
    background: linear-gradient(
      180deg,
      var(--green-50),
      var(--green-100)
    );
  }
}

</style>