import { arrayOf } from "./util";

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
  #width: number;
  #height: number;
  #grid: Tile[];
  #hero: number;
  #boxes: number[];
  #heroDirection: Direction;
  #history: [Direction, Move][];

  constructor() {
    this.#width = $state(0);
    this.#height = $state(0);
    this.#grid = $state([]);
    this.#hero = $state(-1);
    this.#boxes = $state([]);
    this.#heroDirection = $state(Direction.South);
    this.#history = [];
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


  load(lines: string[]) {
    this.#height = lines.length;
    this.#width = Math.max(...lines.map(line => line.length));
    this.#grid = arrayOf(this.#width * this.#height, Tile.Empty);
    this.#hero = -1;
    this.#boxes = [];
    this.#heroDirection = Direction.South;
    this.#history = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        let index = i * this.#width + j;
        switch(line[j]) {
          case '#':
            this.#grid[index] = Tile.Wall;
            break;
          case '.':
            this.#grid[index] = Tile.Target;
            break;
          case '$':
            this.#boxes.push(index);
            break;
          case '*':
            this.#grid[index] = Tile.Target;
            this.#boxes.push(index);
            break;
          case '@':
            this.#hero = index;
            break;
          case '+':
            this.#hero = index;
            this.#grid[index] = Tile.Target;
        }
      }
    }

    const seen = this.#grid.map(() => false);
    const stack = [this.#hero];
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (seen[current] || this.#grid[current] === Tile.Wall) {
        continue;
      }
      seen[current] = true;
      if (this.#grid[current] === Tile.Empty) {
        this.#grid[current] = Tile.Ground;
      }
      stack.push(current-1);
      stack.push(current+1);
      stack.push(current-this.#width);
      stack.push(current+this.#width);      
    }
  }

  move(dir: Direction) {
    const currentDir = this.#heroDirection;
    const res = this.#move(dir);
    if (res !== Move.Nothing) {
      this.#history.push([currentDir, res]);
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
    return Move.Push;
  }

  undo() {
    if (this.#history.length > 0) {
      const [prevDir, move] = this.#history.pop()!;
      const currentDir = this.#heroDirection;
      const delta =
        currentDir === Direction.North
        ? -this.#width
        : currentDir === Direction.South
        ? this.#width
        : currentDir === Direction.West
        ? -1
        : 1;
      this.#heroDirection = prevDir;
      this.#hero -= delta;
      if (move === Move.Push) {
        const idx = this.#boxes.indexOf(this.#hero+2*delta);
        this.#boxes[idx] -= delta;
      }
    }
  }

  isLevelFinished() {
    return this.#boxes.every(box => this.#grid[box] === Tile.Target)
  }
}