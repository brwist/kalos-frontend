import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import jsdom from 'jsdom';
import Storage from 'dom-storage';

const copyProps = (src, target) => {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
};

const setUpDomEnvironment = () => {
  const { JSDOM } = jsdom;
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
  });
  const { window } = dom;

  global.window = window;
  global.document = window.document;
  global.navigator = {
    userAgent: 'node.js',
  };
  global.console = {
    log: console.log, // In case we need fine-grained control over this, we can have it later
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
  };
  copyProps(window, global);
};

export default () => {
  global.localStorage = new Storage(null, { strict: true });
  global.sessionStorage = new Storage(null, { strict: true });

  setUpDomEnvironment();

  Enzyme.configure({ adapter: new Adapter() });
};
