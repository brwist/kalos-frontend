import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';
import { PrintParagraph } from '../PrintParagraph';
import './PrintHeader.module.css';

export interface Props {
  title?: string;
  subtitle?: ReactNode;
  withKalosAddress?: boolean;
  withKalosContact?: boolean;
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
  withKalosContact = false,
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
    <div>
      {withKalosAddress && (
        <PrintParagraph tag="h2" align="right" style={{ marginTop: 0 }}>
          Kalos Services
          <br />
          236 Hatteras Ave
          <br />
          Clermont FL 34711
        </PrintParagraph>
      )}
      {withKalosContact && (
        <PrintParagraph align="right" style={{ marginTop: 0 }}>
          offce@kalosforida.com
          <br />
          Phone: (352) 243-7088
          <br />
          Fax: (352) 404-6907
        </PrintParagraph>
      )}
    </div>
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
