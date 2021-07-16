export default () => {
  global.self = global as any;
  module.exports = global;

  require('@babel/register')({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    ignore: ['/node_modules/(?!@kalos-core)/', '*.proto'],
  });
};
