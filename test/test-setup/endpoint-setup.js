import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT); // Needed to setup the auth token

export { u };
