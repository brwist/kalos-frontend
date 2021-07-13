// The path to the components library from test/modules/ComponentsLibrary/(module name)
export const COMPONENTS_LIBRARY_PATH_FROM_TEST =
  '../../../../modules/ComponentsLibrary';

export const MODULES_PATH_FROM_TEST = '../../../modules';

export const SETUP_PATH_FROM_TEST_MODULES = '../../test-setup';

type Scope = ['ComponentsLibrary', 'Modules'];
/**
 * @param  {string} name  The name of the module or component
 * @param  {keyofScope} scope  The scope which the call is being done in
 *
 * ! The scope would be "ComponentsLibrary" if the import is being done from 'test/modules/ComponentsLibrary/ModuleName'.
 * ! It would be 'Modules' if the import is being done from 'test/modules/ModuleName'.
 */
export const GetPathFromName = (name: string, scope: keyof Scope) => {
  switch (scope) {
    case 'ComponentsLibrary':
      return `${COMPONENTS_LIBRARY_PATH_FROM_TEST}/${name}`;
    case 'Modules':
      return `${MODULES_PATH_FROM_TEST}/${name}`;
    default:
      console.error('Could not get path from name: The scope is not valid.');
  }
};
