import { arrayOf } from "@gbagan/utils";

export enum Tile {
  Empty, Wall, Target, Ground
}

export enum Direction {
  North, South, West, East
}

enum Move {
  Push, Move, Nothing
}

export class Board {
  readonly #width: number;
  readonly #height: number;
  readonly #grid: readonly Tile[];
  #hero: number;
  #boxes: number[];
  #heroDirection: Direction;
  #history: [Direction, Direction, Move][];
  #pushCount: number;

  constructor(lines: string[]) {
    this.#height = lines.length;
    this.#width = Math.max(...lines.map(line => line.length));
    this.#hero = $state.raw(-1);
    this.#heroDirection = $state.raw(Direction.South);
    this.#history = [];
    this.#pushCount = $state.raw(0);

    const grid = arrayOf(this.#width * this.#height, Tile.Empty);
    const boxes = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        let index = i * this.#width + j;
        switch(line[j]) {
          case '#':
            grid[index] = Tile.Wall;
            break;
          case '.':
            grid[index] = Tile.Target;
            break;
          case '$':
            boxes.push(index);
            break;
          case '*':
            grid[index] = Tile.Target;
            boxes.push(index);
            break;
          case '@':
            this.#hero = index;
            break;
          case '+':
            this.#hero = index;
            grid[index] = Tile.Target;
        }
      }
    }

    const seen = grid.map(() => false);
    const stack = [this.#hero];
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (seen[current] || grid[current] === Tile.Wall) {
        continue;
      }
      seen[current] = true;
      if (grid[current] === Tile.Empty) {
        grid[current] = Tile.Ground;
      }
      stack.push(current-1);
      stack.push(current+1);
      stack.push(current-this.#width);
      stack.push(current+this.#width);      
    }
    
    this.#grid = grid;
    this.#boxes = $state(boxes);
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  get grid(): readonly Tile[] {
    return this.#grid;
  }

  get hero() {
    return this.#hero;
  }

  get heroDirection() {
    return this.#heroDirection;
  }

  get boxes(): readonly number[] {
    return this.#boxes;
  }

  get pushCount(): number {
    return this.#pushCount;
  }

  move(dir: Direction) {
    const currentDir = this.#heroDirection;
    const res = this.#move(dir);
    if (res !== Move.Nothing) {
      this.#history.push([currentDir, dir, res]);
    }
  }

  #move(dir: Direction) {
    this.#heroDirection = dir;

    const delta =
      dir === Direction.North
      ? -this.#width
      : dir === Direction.South
      ? this.#width
      : dir === Direction.West
      ? -1
      : 1;

    const next = this.#hero + delta;
    if (this.#grid[next] === Tile.Wall) {
      return Move.Nothing;
    }
    const nextBoxIdx = this.#boxes.indexOf(next);
    if (nextBoxIdx === -1) {
      this.#hero = next;
      return Move.Move;
    }
    const next2 = next + delta;
    if (this.#grid[next2] === Tile.Wall || this.boxes.includes(next2)) {
      return Move.Nothing;
    }
    this.#hero = next;
    this.#boxes[nextBoxIdx] = next2;
    this.#pushCount++;
    return Move.Push;
  }

  undo() {
    if (this.#history.length > 0) {
      const [prevDir, nextDir, move] = this.#history.pop()!;
      const delta =
        nextDir === Direction.North
        ? -this.#width
        : nextDir === Direction.South
        ? this.#width
        : nextDir === Direction.West
        ? -1
        : 1;
      this.#heroDirection = prevDir;
      this.#hero -= delta;
      if (move === Move.Push) {
        const idx = this.#boxes.indexOf(this.#hero+2*delta);
        this.#boxes[idx] -= delta;
        this.#pushCount--;
      }
    }
  }

  isLevelCompleted() {
    return this.#boxes.every(box => this.#grid[box] === Tile.Target)
  }
}