import { Loading } from "modules/loading";

const currentScene = "loading";

const setup = () => {
  console.log("initializing game...");
  Loading.setup();
};

export const SCENE_ENUM = ["loading", "playing", "gameover"];
export const Game = { setup };
