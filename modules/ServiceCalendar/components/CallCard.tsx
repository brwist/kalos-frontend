import React from 'react';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { makeStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar";
import { colorsMapping, repeatsMapping } from '../constants';

const useStyles = makeStyles( theme => ({
  card: {
    margin: `${theme.spacing(1)}px 0`,
  },
  cardHeader: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  cardContent: {
    padding: `0 ${theme.spacing(2)}px ${theme.spacing(1)}px`,
  },
  colorIndicator: {
    display: 'block',
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
}));

interface props {
  card: Event.AsObject,
  reminder?: boolean,
}

interface colorProps {
  color: string,
}

const ColorIndicator = ({ color }:colorProps) => {
  const classes = useStyles();
  return (
    <span className={classes.colorIndicator} style={{ backgroundColor: color }} />
  );
};

const CallCard = ({ card, reminder }:props) => {
  const {
    id,
    propertyId,
    name,
    customer,
    timeStarted,
    timeEnded,
    description,
    logTechnicianAssigned,
    logJobNumber,
    logJobStatus,
    color,
    isAllDay,
    repeatType,
    dateEnded,
  } = card;
  const classes = useStyles();
  // @ts-ignore
  return (
    <Card
      className={classes.card}
      onClick={() => {
        if (customer) {
          const url = `https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall&id=${id}&property_id=${propertyId}&user_id=${customer.id}`;
          const win = window.open(url, '_blank');
          if (win) {
            win.focus();
          }
        }
      }}
    >
      <CardActionArea>
        <CardHeader
          className={classes.cardHeader}
          avatar={<ColorIndicator color={colorsMapping[logJobStatus] || colorsMapping[color]}/>}
          title={logJobStatus ? logJobStatus : null}
          subheader={isAllDay ? 'All Day Event' : `${timeStarted} - ${timeEnded}`}
          action={<Typography variant="caption">{logJobNumber}</Typography>}
        />
        <CardContent className={classes.cardContent}>
          {!reminder && (
            <Typography variant="body2" color="textSecondary" component="p">
              Customer: {customer?.businessname || `${customer?.firstname} ${customer?.lastname}`}
            </Typography>
          )}
          {logTechnicianAssigned !== "0" && logTechnicianAssigned !== "" ? (
            <Typography variant="body2" color="textSecondary" component="p">
              Technician: {logTechnicianAssigned}
            </Typography>
          ) : null}
          <Typography variant="body2" color="textSecondary" component="p">
            {name}
          </Typography>
          {repeatType ? (
            <Typography variant="body2" color="textSecondary" component="p">
              Repeats {repeatsMapping[repeatType]}
              {dateEnded ? ` until ${dateEnded}` : ' forever'}
            </Typography>
          ) : null}
          {description ? (
            <Typography variant="body2" color="textSecondary" component="p" dangerouslySetInnerHTML={{__html: description.replace( '\r\n', '<br />')}} />
          ) : null}
        </CardContent>
      </CardActionArea>   
    </Card>
  );
};

export default CallCard;