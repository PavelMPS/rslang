import { getUserAggregatedWords } from "./api/api";
import { renderStartPage } from "./start-page/start-page";
import { renderTextbookPage } from "./textbook-page/textbook-page";

renderStartPage();

export async function getNewToken(userId: string): Promise<void> {
  let refreshToken: string = '';
  if (localStorage.getItem('Your refreshToken')) {
    refreshToken = localStorage.getItem('Your refreshToken') as string;
  }
  console.log(refreshToken)
  const res: Response = await fetch(`https://react-rslang-example.herokuapp.com/users/${userId}/tokens`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${refreshToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  console.log('res', res)
  const content = await res.json();
  console.log(content)
  localStorage.setItem('Your token', content.token);
  localStorage.setItem('Your refreshToken', content.refreshToken);
}

getNewToken('	6210b7ded266500016ff6ee2');
