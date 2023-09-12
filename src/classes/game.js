export class Game {
  static SCENE_ENUM = ["loading", "playing", "gameover"];

  scenes = { loading: undefined, playing: undefined, gameover: undefined };

  constructor() {
    console.log("initializing game...");
  }
}
