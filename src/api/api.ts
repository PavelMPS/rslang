import { filters, optionFilter } from "../constants/constants";
import { renderStatisticPage } from "../statistic-page/statistic-page";
import { createStatistic } from "../utilits/utilits";

export async function getWords(group: number, page: number): Promise<IWord[]> {
  const response: Response = await fetch(`https://react-rslang-example.herokuapp.com/words?group=${group}&page=${page}`);
  const words: IWord[] = await response.json();
  return words;
}

export async function getWord(wordId: string): Promise<IWord> {
  const response: Response = await fetch(`https://react-rslang-example.herokuapp.com/words/${wordId}`);
  const word: IWord = await response.json();
  return word;
}

export async function getUserWord(userId: string | null, wordId: string): Promise<Response> {
  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  const response: Response = await fetch(`https://react-rslang-example.herokuapp.com/users/${userId}/words/${wordId}`, {
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
  const response: Response = await fetch(`https://react-rslang-example.herokuapp.com/users/${userId}/words`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });
  const content = await response.json();

  return content;
}

export async function createUserWord(userId: string | null, wordId: string, difficult: string, lerned: boolean, rightAnswers: number, allAnswers: number, answersForIsLerned: number): Promise<IUserWord> {
  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  const word: IUserWord = { "difficulty": difficult, "optional": {"isLerned": lerned, "rightAnswers": rightAnswers, "allAnswers": allAnswers, "answersForIsLerned": answersForIsLerned} };
  const rawResponse = await fetch(`https://react-rslang-example.herokuapp.com/users/${userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(word)
  });
  const content = await rawResponse.json();

  return content;
};

export async function updateUserWord(userId: string | null, wordId: string, difficult: string, lerned: boolean, rightAnswers: number, allAnswers: number, answersForIsLerned: number): Promise<IUserWord> {
  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  const word: IUserWord = { "difficulty": difficult, "optional": {"isLerned": lerned, "rightAnswers": rightAnswers, "allAnswers": allAnswers, "answersForIsLerned": answersForIsLerned} };

  const rawResponse = await fetch(`https://react-rslang-example.herokuapp.com/users/${userId}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(word)
  });
  const content = await rawResponse.json();

  return content;
};

export async function getStatistics(userId: string | null) {
  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  const response = await fetch(`https://react-rslang-example.herokuapp.com/users/${userId}/statistics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });
  const currentDate: Date = new Date();        
            const day =  currentDate.getDate();
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();             
  switch (response.status) {
    case 401:
      if (userId) {
        console.log('create new token');
        await getNewToken(userId);
         
        break;
      }     
    case 404: 
      if (userId)
      await createStatistic(userId, year, month, day);
      break;
    case 200: 
      const content: IStatistics = await response.json();
      if (content.optional.year === year&& content.optional.month === month && content.optional.day === day) {
        console.log('1date = 2date');
        console.log(content);
        return content;
      } else {
        console.log('last else')
        if (userId)   
        await createStatistic(userId, year, month, day);
        break;
      }
  }
};

export async function updateStatistics(userId: string | null, lernedWords: number, sprintStatistics: IGameStatistic, audiochallengeStatistics: IGameStatistic, year: number, month: number, day: number): Promise<IStatistics> {
  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  const statistics: IStatistics = { "learnedWords": lernedWords, "optional": { "sprint":  sprintStatistics, "audiochallenge": audiochallengeStatistics, "year": year, "month": month, "day": day,  } };

  const rawResponse = await fetch(`https://react-rslang-example.herokuapp.com/users/${userId}/statistics`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(statistics)
  });
  const content = await rawResponse.json();
  console.log('update', content);
  return content;
};

// export async function getUser(user) {
//   const rawResponse = await fetch('https://react-rslang-example.herokuapp.com/users/${userId}', {
//     method: 'GET',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//   });
//   const content = await rawResponse.json();

//   return content;
// };

export async function getUserAggregatedWords(filterOption: string, group?: number, page?: number) {
  let token: string | null = '';
  let filter: string = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  let userId: string | null = '';
  if (localStorage.getItem('Your userId')) {
    userId = localStorage.getItem('Your userId');
  }
  if (filterOption === optionFilter.learned) {
    filter = filters.learned;
  } else if (filterOption === optionFilter.hard) {
    filter = filters.hard;
  } else if (filterOption === optionFilter.noLearned) {
    filter = filters.noLearned;
  } else if (filterOption === optionFilter.wordsPerPage) {
    filter = `{"$and": [{"group": ${group}}, {"page": ${page}}]}&wordsPerPage=20`;
  }
  const res = await fetch(`https://react-rslang-example.herokuapp.com/users/${userId}/aggregatedWords?filter=${filter}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  
  const content = await res.json();
  console.log('contentAgregated',content)
  return content;
}

async function getNewToken(userId: string): Promise<void> {
  let refreshToken: string = '';
  if (localStorage.getItem('Your refreshToken')) {
    refreshToken = localStorage.getItem('Your refreshToken') as string;
  }
  console.log(refreshToken)
  const res = await fetch(`https://react-rslang-example.herokuapp.com/users/${userId}/tokens`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${refreshToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  console.log('res', res)
  const content: any = await res.json();
  console.log(content)
  localStorage.setItem('Your token', content.token);
  localStorage.setItem('Your refreshToken', content.refreshToken);
}