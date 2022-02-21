type Statistic = {
  words: string;
  percent: string;
  wrongMessage: string;
  percentCoefficient: number;
  pageTitle: string;
  gameNames: Array<string>;
  tableOptions: Array<string>;
};

export const statisticOptions: Statistic = {
  words: 'words',
  percent: '%',
  wrongMessage: 'Please login or register/login for showing statistic!',
  percentCoefficient: 100,
  pageTitle: 'Statistics',
  gameNames: ['Sprint game', 'Audio Challenge'],
  tableOptions: ['New words', 'Right answers', 'The longest serie', 'Learned words count', 'Overall progress']
};
