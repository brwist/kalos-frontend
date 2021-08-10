/*
    ! This module is a temporary test to show off how to construct proper unit tests. 
*/

import { User } from '@kalos-core/kalos-rpc/User';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { UserClientService } from '../../../helpers';
import { Loader } from '../../Loader/main';
import { Button } from '../Button';
import { Modal } from '../Modal';
interface Props {}

export const Test: FC<Props> = () => {
  const [user, setUser] = useState<User>(new User());
  const [loaded, setLoaded] = useState<boolean>();
  const [displayingUser, setDisplayingUser] = useState<boolean>();
  const handleSetDisplayingUser = useCallback(
    (isDisplaying: boolean) => setDisplayingUser(isDisplaying),
    [setDisplayingUser],
  );
  const load = useCallback(async () => {
    // Just loading a quick user to show everyone how to mock

    let req = new User();
    req.setFirstname('Mary');
    req.setLastname('Orr');

    // ? Here was the old stuff that was crashing it if you want to see that and maybe test against the failure using stubs
    // let req = new User();
    // req.setFirstname('Justin');
    // req.setLastname('Farrell');
    let res: User | undefined;
    try {
      res = await UserClientService.Get(req);
    } catch (err) {
      console.error(
        `An error occurred while getting a user from the User Client Service: ${err}`,
      );
    }
    if (!res) {
      console.error(`No user to use for the info table. Returning.`);
      return;
    }
    setUser(res);
    setLoaded(true);
  }, [setUser, setLoaded]);
  useEffect(() => {
    load();
  }, [load]);
  return !loaded ? (
    <Loader />
  ) : (
    <>
      <Button
        label="Click to See User Name"
        onClick={() => handleSetDisplayingUser(true)}
      />
      {displayingUser && (
        <Modal
          open={displayingUser}
          onClose={() => handleSetDisplayingUser(false)}
        >
          <>{`The user is ${user.getFirstname()} ${user.getLastname()}`}</>
        </Modal>
      )}
    </>
  );
};
