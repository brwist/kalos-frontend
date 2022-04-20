const withLess = require('next-with-less');

module.exports = withLess({
  compiler: {
    externalDir: true,
  },
  lessLoaderOptions: {
    lessOptions: {
      math: 'always'
    }
  },
});
