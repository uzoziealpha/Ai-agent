import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

function Sidebar() {
  return (
    <List>
      <ListItem button>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Transactions" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Settings" />
      </ListItem>
    </List>
  );
}

export default Sidebar;