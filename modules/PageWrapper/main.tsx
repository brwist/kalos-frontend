import React, { FC, useEffect, useState } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import StylesProvider from '@material-ui/styles/StylesProvider';
import customTheme from '../Theme/main';
import SideMenu, { Props } from '../SideMenu/main';
import './styles.less';

export const PageWrapper: FC<Props> = ({ children, ...props }) => {
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
    <StylesProvider injectFirst>
      <ThemeProvider theme={customTheme.lightTheme}>
        <div>
          <div className="PageWrapperMenu">
            <SideMenu {...props} />
          </div>
          <div className="PageWrapperContent">{children}</div>
        </div>
      </ThemeProvider>
    </StylesProvider>
  );
};
