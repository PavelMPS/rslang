export async function getWords(group, page): Promise<IWord[]> {
  const response: Response = await fetch(`https://react-rslang-example.herokuapp.com/words?group=${group}&page=${page}`);
  const words: IWord[] = await response.json();
  return words;
}
