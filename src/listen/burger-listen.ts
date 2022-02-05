import { renderStatisticPage } from "../statistic-page/statistic-page";
import { renderTextbookPage } from "../textbook-page/textbook-page";

export function burgerListen(): void {
    const burgerContainer: HTMLElement | null = document.querySelector('.burger-menu__nav');
    burgerContainer?.addEventListener('click', (e: Event): void => {
        const target = e.target as HTMLElement;
        switch (target.id) {
            case 'burger-menu-item-1': 
               console.log('sprint');
               break;             
            case 'burger-menu-item-2': 
                console.log('audiochallenge');
                break;             
            case 'burger-menu-item-3': 
                renderTextbookPage();
                break;            
            case 'burger-menu-item-4': 
                renderStatisticPage();
                break;             
            case 'burger-menu-item-5': 
                console.log('About us page');
                break;             
        }
    })
}
