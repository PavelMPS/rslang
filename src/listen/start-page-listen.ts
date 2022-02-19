import { renderGroupSelectionPage } from "../utilits/utilits";
import { renderTextbookPage } from "../textbook-page/textbook-page";

export async function startPageListen(): Promise<void> {
    const btnGameSprint = document.querySelector('.sprint-game') as HTMLElement;
    btnGameSprint.addEventListener('click', (): Promise<void> => renderGroupSelectionPage('sprint'));

    const btnGameAudiochallenge = document.querySelector('.audio-challenge') as HTMLElement;
    btnGameAudiochallenge.addEventListener('click', (): Promise<void> => renderGroupSelectionPage('audiochallenge'));

    const btnTextBook = document.querySelector('.textbook-button') as HTMLElement;
    btnTextBook.addEventListener('click', (): void => renderTextbookPage());
}
