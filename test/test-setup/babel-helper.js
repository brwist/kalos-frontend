export default () => {
  global.self = global;
  module.exports = global;

  require('@babel/register')({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    ignore: ['/node_modules/(?!@kalos-core)/', '*.proto'],
  });
};
