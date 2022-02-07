import { renderGroupSelectionPage } from "../audiochallenge-page/audiochallenge-page";

export async function startPageListen(): Promise<void> {
    const btnGameSprint = document.querySelector('.game1') as HTMLButtonElement;
    btnGameSprint.addEventListener('click', (): Promise<void> => renderGroupSelectionPage('sprint'));

    const btnGameAudiochallenge = document.querySelector('.game2') as HTMLButtonElement;
    btnGameAudiochallenge.addEventListener('click', (): Promise<void> => renderGroupSelectionPage('audiochallenge'));
}
