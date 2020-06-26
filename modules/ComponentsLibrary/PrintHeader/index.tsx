import React, { FC, ReactNode } from 'react';
import './styles.css';

export interface Props {
  title: string;
  subtitle?: ReactNode;
  logo?: string;
}

interface SubtitleItemProps {
  label: string;
  value: ReactNode;
}

export const PrintHeader: FC<Props> = ({ title, subtitle }) => (
  <div className="PrintHeader">
    <img
      src="https://app.kalosflorida.com/app/assets/images/kalos-logo-new.png"
      alt="Kalos Service"
      className="PrintHeader_logo"
    />
    <div className="PrintHeader_content">
      <div className="PrintHeader_title">{title}</div>
      {subtitle && <div className="PrintHeader_subtitle">{subtitle}</div>}
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
