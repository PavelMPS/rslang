import { renderStatisticPage } from "../statistic-page/statistic-page";

export function burgerListen(): void {
    const burgerContainer: HTMLElement | null = document.querySelector('.burger-menu__nav');
    burgerContainer?.addEventListener('click', (e: Event): void => {
        const target = e.target as HTMLElement;
        switch (target.textContent) {
            case 'Game1': 
               console.log('sprint');
               break;             
            case 'Game2': 
                console.log('audiochallenge');
                break;             
            case 'Textbook': 
                console.log('Textbook open');
                break;            
            case 'Statistics': 
                renderStatisticPage();
                break;             
            case 'About us': 
                console.log('About us page');
                break;             
        }
    })
}
