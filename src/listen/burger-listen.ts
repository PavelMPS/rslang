import { renderStartPage } from "../start-page/start-page";
import { renderStatisticPage } from "../statistic-page/statistic-page";
import { renderTextbookPage } from "../textbook-page/textbook-page";
import { renderGroupSelectionPage, resetGame } from "../utilits/utilits";
import { timerId } from "../sprint-game/sprint-game";
import { sprint, audiochallenge } from '../constants/constants';

export function burgerListen(): void {
    const burgerContainer: HTMLElement | null = document.querySelector('.burger-menu__nav');
    burgerContainer?.addEventListener('click', (e: Event): void => {
        clearInterval(timerId);
        const target = e.target as HTMLElement;
        switch (target.id) {
            case 'burger-menu-item-0':
                renderStartPage();
                break;
            case 'burger-menu-item-1':
                resetGame(sprint);
                renderGroupSelectionPage(sprint);
                break;             
            case 'burger-menu-item-2': 
                resetGame(audiochallenge);
                renderGroupSelectionPage(audiochallenge);
                break;             
            case 'burger-menu-item-3': 
                renderTextbookPage();
                break;
            case 'burger-menu-item-4':
                renderStatisticPage();
                break;
            case 'burger-menu-item-5':
                renderAboutUsBlock();
                break;
        }
        if (target.id === 'burger-menu-item-3' || target.id === 'burger-menu-item-4' ||
            target.id === 'burger-menu-item-5') {
            const footer = document.querySelector('.footer') as HTMLElement;
            footer.classList.remove('disabled');
        }
    })
}
