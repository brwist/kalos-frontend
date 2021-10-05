import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import jsdom from 'jsdom';
// @ts-ignore
import Storage from 'dom-storage';
import { format } from 'date-fns';

const copyProps = (src: any, target: any) => {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props as any);
};

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
    log: (data: any[]) => {
      if (
        String(data).startsWith('<TestLog>') &&
        String(data).endsWith('</TestLog>')
      ) {
        let date = new Date();
        console.info(
          `[${format(date, 'hh:mm:ss')}:${date
            .getMilliseconds()
            .toString()
            .padStart(3, '0')}]`,
          String(data).replace('<TestLog>', '').replace('</TestLog>', ''),
          '\x1b[0m',
        );
      }
    },
    error: (data: any[]) => {
      if (String(data).includes('[mocha]')) {
        console.info(data);
        return;
      }

      let date = new Date();
      console.info(
        `[${format(date, 'hh:mm:ss')}:${date
          .getMilliseconds()
          .toString()
          .padStart(3, '0')}]`,
        '\x1b[31m',
        `[ERROR]`,
        data,
        '\x1b[0m',
      );
      if (String(data).includes('missing authorization token')) {
        console.warn(
          `[WARNING] Did you forget to set up a stub for an RPC (Possibly ${String(
            data,
          )
            .substring(
              String(data).indexOf('route') + 6,
              String(data).indexOf('requires'),
            )
            .replace('/', ' ')
            .replace('/', '.')
            .trim()})?`,
          '\x1b[0m',
        );
      }
    },
    warn: (data: any[]) => {
      let date = new Date();
      console.info(
        `[${format(date, 'hh:mm:ss')}:${date
          .getMilliseconds()
          .toString()
          .padStart(3, '0')}]`,
        '\x1b[33m',
        data,
        '\x1b[0m',
      );
    },
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
