// The path to the components library from test/modules/ComponentsLibrary/(module name)
export const COMPONENTS_LIBRARY_PATH_FROM_TEST =
  '../../../../modules/ComponentsLibrary';

export const MODULES_PATH_FROM_TEST = '../../../modules';
export const MODULES_PATH_FROM_TOP_TEST = '../../modules';

export const SETUP_PATH_FROM_TEST_MODULES = '../../test-setup';

type Scope = ['ComponentsLibrary', 'Modules', 'TopLevel'];
/**
 * @param  {string} name  The name of the module or component
 * @param  {keyofScope} scope  The scope which the call is being done in
 * @param  {boolean} includeIndex Whether to add /index to the end of the path (useful for components)
 * ! The scope would be "ComponentsLibrary" if the import is being done from 'test/modules/ComponentsLibrary/ModuleName'.
 * ! It would be 'Modules' if the import is being done from 'test/modules/ModuleName'.
 */
export const GetPathFromName = (
  name: string,
  scope: keyof Scope,
  includeIndex?: boolean,
) => {
  switch (scope) {
    case 'ComponentsLibrary':
      return `${COMPONENTS_LIBRARY_PATH_FROM_TEST}/${name}${
        includeIndex ? '/index' : ''
      }`;
    case 'Modules':
      return `${MODULES_PATH_FROM_TEST}/${name}${includeIndex ? '/index' : ''}`;
    case 'TopLevel':
      return `${`${MODULES_PATH_FROM_TOP_TEST}/${name}${
        includeIndex ? '/index' : ''
      }`}`;
    default:
      console.error('Could not get path from name: The scope is not valid.');
  }
};
/**
 * @param  {string} output The string to output to the console.
 *
 * This is a wrapper for console.log to be used to clean up output from React components. This will display normally due to being wrapped in <TestLog>.
 * Any other log output will be supressed during testing.
 *
 */
export const Log = (output: string) => {
  console.log(`<TestLog>${output}</TestLog>`);
};
