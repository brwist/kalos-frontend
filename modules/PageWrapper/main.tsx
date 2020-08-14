import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import StylesProvider from '@material-ui/styles/StylesProvider';
import customTheme from '../Theme/main';
import SideMenu, { Props } from '../SideMenu/main';
import './styles.less';

export const PageWrapper: FC<Props> = ({ children, ...props }) => (
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
