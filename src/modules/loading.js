import { Game } from "modules/game";
import { emit } from "ev";

const el = document.getElementById("loading");

const onload = () => {
  el.style.display = "none";
  emit("load");
};

const setup = () => {
  window.addEventListener("load", onload);
};

const teardown = () => {
  window.removeEventListener("load", onload);
};

export const Loading = { setup, teardown };
