/**
 * @param  {string} output The string to output to the console.
 *
 * This is a wrapper for console.log to be used to clean up output from React components. This will display normally due to being wrapped in <TestLog>.
 * Any other log output will be supressed during testing.
 *
 */
export const Log = (...data: any[]) => {
  let map = data
    .flatMap(dataPiece => {
      if (typeof dataPiece === 'string') {
        return dataPiece;
      } else if (typeof dataPiece === 'object') {
        return JSON.stringify(dataPiece, null, 4);
      }
    })
    .join('');

  console.log('<TestLog>' + map + '</TestLog>'); // using commas instead of `` because then objects don't get flattened to [object]
};
