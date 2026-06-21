<script lang="ts">
   import Button from "./Button.svelte";

  type Props = {
    movementCount: number;
    pushCount: number;
    restart: () => void;
    goToNextLevel: () => void;
    goToLevelSelection: () => void;
  }

  let { movementCount, pushCount, restart, goToNextLevel, goToLevelSelection }: Props = $props();
</script>

<div class="victory-overlay">
  <section class="victory-card">
    <div class="victory-icon">🎉</div>

    <h2>Bravo !</h2>

    <p>
      Niveau terminé en
      <strong>{movementCount}</strong>
      mouvements et
      <strong>{pushCount}</strong>
      poussées.
    </p>

    <div class="victory-actions">
      <Button variant="secondary" onclick={restart}>
        ↻ Rejouer
      </Button>

      <Button variant="primary" onclick={goToNextLevel}>
        Niveau suivant ▶
      </Button>
    </div>

    <button class="victory-link" onclick={goToLevelSelection}>
      Choisir un autre niveau
    </button>
  </section>
</div>

<style>
.victory-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: grid;
  place-items: center;

  padding: 1.375rem;

  background:
    radial-gradient(circle at center, rgb(255 255 255 / 0.18), transparent 35%),
    color-mix(in srgb, var(--amber-950, #451a03) 42%, transparent);

  backdrop-filter: blur(5px);
}

.victory-card {
  width: 50rem;
  padding: 2rem 1.875rem 1.75rem;

  text-align: center;
  color: var(--amber-950);

  border-radius: 30px;
  border: 3px solid rgb(255 255 255 / 0.85);

  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.96), rgb(255 248 236 / 0.96));

  box-shadow:
    0 18px 0 color-mix(in srgb, var(--amber-950) 18%, transparent),
    0 28px 45px rgb(69 26 3 / 0.28),
    inset 0 0 0 2px rgb(146 64 14 / 0.12);

  animation: victory-pop 280ms cubic-bezier(.2, 1.4, .4, 1);
}

.victory-icon {
  width: 5rem;
  height: 5rem;
  margin: -4.2rem auto 0.625rem;

  display: grid;
  place-items: center;

  font-size: 3.2rem;

  border-radius: 50%;
  background:
    linear-gradient(
      180deg,
      var(--yellow-300),
      var(--amber-500)
    );

  border: 4px solid rgb(255 255 255 / 0.9);

  box-shadow:
    0 8px 0 var(--amber-800),
    0 14px 24px rgb(146 64 14 / 0.28);
}

.victory-card h2 {
  margin: 0 0 12px;

  font-size: 4rem;
  font-weight: 950;
  line-height: 1;

  color: var(--green-700);
  text-shadow: 0 3px 0 rgb(21 128 61 / 0.15);
}

.victory-card p {
  margin: 0 auto 1.5rem;
  width: 24rem;

  font-size: 1.2rem;
  font-weight: 650;
  line-height: 1.45;
}

.victory-card strong {
  color: var(--blue-600);
  font-size: 1.35em;
  font-weight: 950;
}

.victory-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.victory-link {
  margin-top: 1rem;

  border: 0;
  background: transparent;

  color: var(--amber-800);
  font-size: 1rem;
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 4px;

  cursor: pointer;
}

@keyframes victory-pop {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.88);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>