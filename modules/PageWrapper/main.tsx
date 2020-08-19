import React, { FC, useEffect, useState } from 'react';
import SideMenu, { Props as SideMenuProps } from '../SideMenu/main';
import { StyledPage } from './styled';
import './styles.less';

export interface PageWrapperProps {
  padding?: number;
  withHeader?: boolean;
}
type Props = PageWrapperProps & SideMenuProps;

export const PageWrapper: FC<Props> = ({
  children,
  padding = 0,
  withHeader = false,
  ...props
}) => {
  const [initiated, setInitiated] = useState<boolean>(false);
  useEffect(() => {
    if (!initiated) {
      setInitiated(true);
      const oldSideMenu = document.getElementsByClassName('main-header')[0];
      if (oldSideMenu) {
        oldSideMenu.remove();
      }
    }
  }, [initiated, setInitiated]);
  return (
    <StyledPage>
      <div>
        {withHeader && (
          <div className="PageWrapperMenu">
            <SideMenu {...props} />
          </div>
        )}
        <div
          className="PageWrapperContent"
          style={{ padding: `${padding}rem` }}
        >
          {children}
        </div>
      </div>
    </StyledPage>
  );
};
