import React, { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { loadCharityReport, usd } from '../../../helpers';

interface Props {
  month: string;
  onClose?: () => void;
}

const useStyles = makeStyles(theme => ({
  table: {
    marginBottom: theme.spacing(0.25),
  },
}));

export const CharityReport: FC<Props> = ({ month, onClose }) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({ items: [] });
  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadCharityReport(month);
    setData(data);
    console.log({ data });
    setLoading(false);
  }, [setLoading, setData]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const subtitle = useMemo(
    () => format(new Date(month.replace('%', '01')), 'MMMM yyyy'),
    [month],
  );
  return (
    <div>
      <SectionBar
        title="Charity Report"
        subtitle={subtitle}
        asideContent={
          <>{onClose && <Button label="Close" onClick={onClose} />}</>
        }
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          <InfoTable
            columns={[
              { name: 'Residential Service Total' },
              { name: usd(data.residentialServiceTotal) },
            ]}
            className={classes.table}
          />
          <InfoTable
            columns={[
              { name: 'Residential AOR Total' },
              { name: usd(data.residentialAorTotal) },
            ]}
            className={classes.table}
          />
          <InfoTable
            columns={[
              { name: 'Technician' },
              { name: 'Contribution' },
              { name: 'Average Hourly' },
            ]}
            //@ts-ignore
            data={data.items.map(
              //@ts-ignore
              ({ technician, contribution, averageHourly }) => [
                { value: technician },
                { value: usd(contribution) },
                { value: usd(averageHourly) },
              ],
            )}
          />
        </>
      )}
    </div>
  );
};
