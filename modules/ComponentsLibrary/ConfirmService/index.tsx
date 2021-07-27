import React, { createContext, useContext, useState, useRef } from 'react';
import { Confirm } from '../Confirm';

export interface ConfirmOptions {
  catchOnCancel?: boolean;
  title?: string;
  description: string;
}

const ConfirmServiceContext = createContext<
  (options: ConfirmOptions) => Promise<void>
>(Promise.reject);

type ProviderProps = {
  children: JSX.Element;
};

export const ConfirmServiceProvider = ({
  children,
}: ProviderProps): JSX.Element => {
  const [ConfirmState, setConfirmState] = useState<ConfirmOptions | null>(null);

  const awaitingPromiseRef = useRef<{
    resolve: () => void;
    reject: () => void;
  }>();

  const openConfirm = (options: ConfirmOptions) => {
    setConfirmState(options);
    return new Promise<void>((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  };

  const handleClose = () => {
    if (ConfirmState?.catchOnCancel && awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject();
    }

    setConfirmState(null);
  };

  const handleConfirm = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }

    setConfirmState(null);
  };

  return (
    <>
      <ConfirmServiceContext.Provider value={openConfirm}>
        {children}
      </ConfirmServiceContext.Provider>

      <Confirm
        open={Boolean(ConfirmState)}
        title={ConfirmState?.title}
        onConfirm={handleConfirm}
        onClose={handleClose}
      >
        {ConfirmState?.description}
      </Confirm>
    </>
  );
};

export const useConfirm = () => useContext(ConfirmServiceContext);
