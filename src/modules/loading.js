import { Game } from "modules/game";

const el = document.getElementById("loading");

const onload = () => {
  el.style.display = "none";
};

const setup = () => {
  window.addEventListener("load", onload);
};

const teardown = () => {
  window.removeEventListener("load", onload);
};

export const Loading = { setup, teardown };
