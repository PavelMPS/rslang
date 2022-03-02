export const sprintGame: ISprint = {
  gameOptions: ['SCORE: ', 'right-answer', 'wrong-answer', 'Your score is: ', 'Try again?', 'Question: '],
  gameOver: ['Don\'t despair!', 'Nice work!', 'You dont answer any question :('],
  gameMessages: ['nice!', 'good!', 'very good!', 'amazing!', 'excellent!', 'impressive!', 'godlike!'],
  difficult: 0,
  gameWords: [],
  page: 0,
  group: 0,
  count: 0,
  score: 0,
  answerSeries: 0,
  seriesTotalStatistics: 0,
  advanceScore: [10, 20, 30, 40, 50, 60, 70],
  rightAnswers: 0,
  allAnswers: 0,
  fromTextbook: true,
};

export const sprintDescription: string = `In this game you must choose rihgt answer.
  Click at that button you think right or press key left or right
  for choosing answer`;
