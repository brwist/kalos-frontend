import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import jsdom from 'jsdom';
// @ts-ignore
import Storage from 'dom-storage';

const copyProps = (src: any, target: any) => {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props as any);
};

const oldLog = console.log;

const setUpDomEnvironment = () => {
  const { JSDOM } = jsdom;
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
  });
  const { window } = dom;

  global.window = window as any;
  global.document = window.document;
  global.navigator = {
    userAgent: 'node.js',
  } as Navigator;
  global.console = {
    log: (output: any) => {
      let out = output.replace('<TestLog>', '');
      out = out.replace('</TestLog>', '');
      output.startsWith('<TestLog>') && output.endsWith('</TestLog>')
        ? oldLog(out)
        : undefined;
    }, // In case we need fine-grained control over this, we can have it later
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
  } as Console;
  copyProps(window, global);
};

export default () => {
  global.localStorage = new Storage(null, { strict: true });
  global.sessionStorage = new Storage(null, { strict: true });

  setUpDomEnvironment();

  Enzyme.configure({ adapter: new Adapter() });
};
