import { getUserAggregatedWords } from "./api/api";
import { renderStartPage } from "./start-page/start-page";
import { renderTextbookPage } from "./textbook-page/textbook-page";

renderStartPage();

const id =localStorage.getItem('Your userId')
if (id)
getUserAggregatedWords(1, 2, id)

