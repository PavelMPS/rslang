export async function getWords(group: number, page: number): Promise<IWord[]> {
  const response: Response = await fetch(`https://react-rslang-example.herokuapp.com/words?group=${group}&page=${page}`);
  const words: IWord[] = await response.json();
  return words;
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
  console.log(response);
  return response;
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

export async function getStatistics(userId: string | null): Promise<IStatistics> {
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
  const content = await response.json();
  console.log('create', content);
  return content;
};

export async function updateStatistics(userId: string | null, lernedWords: number, sprintStatistics: IGameStatistic, audiochallengeStatistics: IGameStatistic): Promise<IStatistics> {
  let token: string | null = '';
  if (localStorage.getItem('Your token')) {
    token = localStorage.getItem('Your token');
  }
  const statistics: IStatistics = { "learnedWords": lernedWords, "optional": { "sprint":  sprintStatistics, "audiochallenge": audiochallengeStatistics } };

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

// export async function getUserAggregatedWords(userId: string, page: number, group: number, filterOption: string ) {
//   let token: string | null = '';
//   let filter: string = '';
//   if (localStorage.getItem('Your token')) {
//     token = localStorage.getItem('Your token');
//   }
//   if (filterOption === 'learned') {
//     console.log('1');
//     filter = `{"$and":{"userWord.optional.isLerned": true}}}`;
//   } else if (filterOption === 'hard') {
//     console.log('2');
//     filter = `{"$and":{"userWord.difficulty": "hard"}}`;
//   }
//   const res = await fetch(`https://react-rslang-example.herokuapp.com/users/${userId}/aggregatedWords?group=${group}&page=${page}${filter}`, {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//   });
  
//   const content = await res.json();
//   console.log(content)
//   return content;
// }
