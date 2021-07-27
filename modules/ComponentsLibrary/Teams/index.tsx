import React, { FC, useState, useCallback, useEffect } from 'react';
import './styles.less';

type Style = {};

interface Props extends Style {}

export const Teams: FC<Props> = () => {
  const load = useCallback(() => {}, []);
  useEffect(() => load(), [load]);
  return <></>;
};
