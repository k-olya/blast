// this is the module manager
// it tells other modules when to start and when to stop
import { Loading } from "modules/loading";
import { Gameplay } from "modules/gameplay";
import { on } from "ev";

const currentScene = "loading";

// decides what to do when loading is finished
const onload = () => {
  Loading.teardown();
  console.log("game loaded");
  Gameplay.setup();
};

const setup = () => {
  console.log("initializing game...");
  Loading.setup();

  // register event handlers
  on("load", onload);
};

const teardown = () => {};

export const SCENE_ENUM = ["loading", "playing", "gameover"];
export const Game = { setup, teardown };
