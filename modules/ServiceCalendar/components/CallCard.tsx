import React from 'react';
import { Event } from '@kalos-core/kalos-rpc/Event';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar";

interface props {
    card: Event.AsObject,
}

const CallCard = ({ card }:props) => {
  const { id, propertyId, customer, timeStarted, timeEnded, description, logTechnicianAssigned, logJobStatus } = card;
  return (
    <Card onClick={() => {
      if (customer) {
        const url = `https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall&id=${id}&property_id=${propertyId}&user_id=${customer.id}`;
        const win = window.open(url, '_blank');
        if (win) {
          win.focus();
        }
      }
    }}>
      <CardActionArea>
        <CardHeader
          avatar={<Avatar style={{backgroundColor: 'green'}}> </Avatar>}
          title="Status"
          subheader={`${timeStarted} - ${timeEnded}`}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            Customer: {customer?.businessname || `${customer?.firstname} ${customer?.lastname}`}<br />
            Technician: {logTechnicianAssigned}<br />
            {description}<br />
            {logJobStatus}
          </Typography>
        </CardContent>
      </CardActionArea>   
    </Card>
  );
};

export default CallCard;