<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg" | "xl";
    onclick?: () => void;
    children?: Snippet;
  }

  let { variant = "primary", size = "md", onclick, children }: Props = $props();
</script>

<button class="{variant} {size}" {onclick}>
  {@render children?.()}
</button>

<style>
  button {
    min-height: var(--button-height);
    padding: 0 var(--button-padding-x);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    border-radius: var(--button-radius);
    border: 2px solid transparent;

    font-size: var(--button-font-size);
    font-weight: 800;
    line-height: 1;

    cursor: pointer;
    user-select: none;

    box-shadow:
      0 5px 0 var(--button-shadow-color),
      inset 0 2px 0 rgb(255 255 255 / 0.45);

    transition:
      transform 150ms ease,
      box-shadow 150ms ease,
      filter 150ms ease;

    &:hover {
      transform: translateY(-2px);
      filter: brightness(1.04);
    }

    &:active {
      transform: translateY(2px);
      box-shadow:
        0 2px 0 var(--button-shadow-color),
        inset 0 2px 0 rgb(255 255 255 / 0.35);
    }

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      transform: none;
    }

    &.primary {
      color: white;
      border-color: var(--blue-700);
      background: linear-gradient(180deg, var(--blue-400), var(--blue-600));
      --button-shadow-color: var(--blue-800);
    }

    &.secondary {
      color: var(--amber-950);
      border-color: color-mix(in srgb, var(--amber-800) 25%, transparent);
      background: linear-gradient(180deg, #fffdf7,#ffefd2);
      --button-shadow-color: color-mix(in srgb, var(--amber-950) 25%, transparent);
    }


    &.sm {
      --button-height: 2.35rem;
      --button-padding-x: 1rem;
      --button-font-size: 0.95rem;
      --button-radius: 0.75rem;
    }

    &.md {
      --button-height: 2.8rem;
      --button-padding-x: 1.35rem;
      --button-font-size: 1rem;
      --button-radius: 0.875rem;
    }

    &.lg {
      --button-height: 3.5rem;
      --button-padding-x: 1.75rem;
      --button-font-size: 1.45rem;
      --button-radius: 1rem;
    }

    &.xl {
      --button-height: 4rem;
      --button-padding-x: 2.35rem;
      --button-font-size: 2rem;
      --button-radius: 1.125rem;
    }
  }
</style>