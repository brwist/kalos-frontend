import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';
import { PrintParagraph } from '../PrintParagraph';
import './styles.css';

export interface Props {
  title?: string;
  subtitle?: ReactNode;
  logo?: string;
  withKalosAddress?: boolean;
  bigLogo?: boolean;
}

interface SubtitleItemProps {
  label: string;
  value: ReactNode;
}

export const PrintHeader: FC<Props> = ({
  title,
  subtitle,
  withKalosAddress = false,
  bigLogo = false,
}) => (
  <div className="PrintHeader">
    <div className={clsx('PrintHeader_logo', { bigLogo })} />
    <div className="PrintHeader_content">
      {title && (
        <PrintParagraph tag="h1" align="center" style={{ marginTop: 0 }}>
          {title}
        </PrintParagraph>
      )}
      {subtitle && <PrintParagraph align="center">{subtitle}</PrintParagraph>}
    </div>
    {withKalosAddress && (
      <PrintParagraph tag="h2" align="right" style={{ marginTop: 0 }}>
        Kalos Services
        <br />
        236 Hatteras Ave
        <br />
        Clermont FL 34711
      </PrintParagraph>
    )}
  </div>
);

export const PrintHeaderSubtitleItem: FC<SubtitleItemProps> = ({
  label,
  value,
}) => (
  <span className="PrintHeader_subtitle_item">
    {label} <strong>{value}</strong>
  </span>
);
