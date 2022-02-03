import '../start-page/start-page.css';

export function renderStartPage() {
 const startPage = `
 <h1> ГЛАВНАЯ СТРАНИЦА</h1>
 `;
 const body = document.querySelector('.body') as HTMLElement;
 body.innerHTML = startPage;   
}