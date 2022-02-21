import { loginUser } from "../authorization-block/authorization";
import { filters, optionFilter } from "../constants/constants";
import { createStatistic } from "../utilits/utilits";

const path: string = 'https://react-rslang-example.herokuapp.com';

export async function getWords(group: number, page: number): Promise<IWord[]> {
  const response: Response = await fetch(`${path}/words?group=${group}&page=${page}`);
  return  await response.json();
}

export async function getWord(wordId: string): Promise<IWord> {
  const response: Response = await fetch(`${path}/words/${wordId}`);
  return await response.json();
}

export async function getUserWord(userId: string | null, wordId: string): Promise<Response> {
  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  const response: Response = await fetch(`${path}/users/${userId}/words/${wordId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  }); 
  return response;
}

export async function getUserWords(): Promise<IUserWord[]> {
  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  let userId: string | null = '';
  if (localStorage.getItem('Your userId')) {
    userId = localStorage.getItem('Your userId');
  }
  const response: Response = await fetch(`${path}/users/${userId}/words`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });
  return await response.json();
}

export async function createUserWord(userId: string | null, wordId: string, difficult: string, lerned: boolean, rightAnswers: number, allAnswers: number, answersForIsLerned: number): Promise<IUserWord> {
  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  const word: IUserWord = { "difficulty": difficult, "optional": {"isLerned": lerned, "rightAnswers": rightAnswers, "allAnswers": allAnswers, "answersForIsLerned": answersForIsLerned} };
  const rawResponse = await fetch(`${path}/users/${userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(word)
  });
  return await rawResponse.json();
};

export async function updateUserWord(userId: string | null, wordId: string, difficult: string, lerned: boolean, rightAnswers: number, allAnswers: number, answersForIsLerned: number): Promise<IUserWord> {
  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  const word: IUserWord = { "difficulty": difficult, "optional": {"isLerned": lerned, "rightAnswers": rightAnswers, "allAnswers": allAnswers, "answersForIsLerned": answersForIsLerned} };
  const rawResponse = await fetch(`${path}/users/${userId}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(word)
  });
  return await rawResponse.json();
};

export async function getStatistics(userId: string | null): Promise<IStatistics | undefined> {
  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  const response = await fetch(`${path}/users/${userId}/statistics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });
  const currentDate: Date = new Date();        
  const day: number =  currentDate.getDate();
  const month: number = currentDate.getMonth();
  const year: number = currentDate.getFullYear();             
  switch (response.status) {
    case 401:
      if (userId && localStorage.getItem('Your refreshToken')) {
        console.log('relogin');
        const pass:string | null = localStorage.getItem('password');
        const email: string | null = localStorage.getItem('email');
        console.log(pass, email);
        if (pass && email)
        await reLogin({ "email": email, "password": pass});
        break;
      }     
    case 404: 
      if (userId)
      await createStatistic(userId, year, month, day);
      break;
    case 200: 
      const content: IStatistics = await response.json();
      if (content.optional.year === year&& content.optional.month === month && content.optional.day === day) {
        return content;
      } else {
        if (userId)   
        await createStatistic(userId, year, month, day);
        break;
      }
  }
}

export async function updateStatistics(userId: string | null, lernedWords: number, sprintStatistics: IGameStatistic, audiochallengeStatistics: IGameStatistic, year: number, month: number, day: number): Promise<IStatistics> {
  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  const statistics: IStatistics = { "learnedWords": lernedWords, "optional": { "sprint":  sprintStatistics, "audiochallenge": audiochallengeStatistics, "year": year, "month": month, "day": day, } };
  const rawResponse = await fetch(`${path}/users/${userId}/statistics`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(statistics)
  });
  return await rawResponse.json();
};

export async function getUserAggregatedWords(filterOption: string, group?: number): Promise<IAgregetedWord[]> {
  let token: string | null = '';
  let filter: string = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  let userId: string | null = '';
  if (localStorage.getItem('Your userId')) {
    userId = localStorage.getItem('Your userId');
  }
  if (filterOption === optionFilter.hard) {
    filter = filters.hard;
  } else if (filterOption === optionFilter.noLearned) {
    filter = `group=${group}&filter={"$or": [{"userWord":null}, {"userWord.optional.isLerned": false}]}&wordsPerPage=3600`;
  }
  const res = await fetch(`${path}/users/${userId}/aggregatedWords?${filter}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }); 
  const content: IAgregetedWordArr = await res.json();
  console.log(content);
  return content[0].paginatedResults;
}

async function getNewToken(userId: string): Promise<void> {
  let refreshToken: string = '';
  if (localStorage.getItem('Your refreshToken')) {
    refreshToken = localStorage.getItem('Your refreshToken') as string;
  }
  const res: Response = await fetch(`${path}/users/${userId}/tokens`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${refreshToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const content: IUserInfo = await res.json();
  localStorage.setItem('Name', content.name);
  localStorage.setItem('Message', content.message);
  localStorage.setItem('Your token', content.token);
  localStorage.setItem('Your userId', content.userId);
  localStorage.setItem('Your refreshToken', content.refreshToken);
}

async function reLogin(user: ISignUser): Promise<void> {
  const userId: string | null= localStorage.getItem('Your userId');
  const rawResponse: Response = await fetch(`${path}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  const content = await rawResponse.json();
  localStorage.setItem('Name', content.name);
      localStorage.setItem('Message', content.message);
      localStorage.setItem('Your token', content.token);
      localStorage.setItem('Your refreshToken', content.refreshToken);
      localStorage.setItem('Your userId', content.userId);
  console.log('relogin', rawResponse);
}