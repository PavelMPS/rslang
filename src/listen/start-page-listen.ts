import { renderSprintPage } from "../sprint-game/sprint-game";

export async function startPageListen(): Promise<void> {
    const btnGameSprint = document.querySelector('.game1') as HTMLButtonElement;
    btnGameSprint.addEventListener('click', renderSprintPage);
}