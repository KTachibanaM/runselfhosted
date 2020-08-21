import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import AppsIcon from '@material-ui/icons/Apps';
import DomainIcon from '@material-ui/icons/Domain';
import React from 'react';
import { NavLink } from 'react-router-dom';

class NavLinkMui extends React.Component<any> {
  render() {
      const { forwardedRef, to, ...props } = this.props
      return <NavLink {...props} ref={forwardedRef} to={to} />
  }
}

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
  }),
);

export const SideMenu: React.FunctionComponent = () => {
  const classes = useStyles({});
  return (
    <Drawer
      className={classes.drawer}
      variant='permanent'
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <List>
        <ListItem button component={NavLinkMui} to='/apps'>
          <ListItemIcon>
            <AppsIcon />
          </ListItemIcon>
          <ListItemText primary='Apps' />
        </ListItem>
        <ListItem button component={NavLinkMui} to='/infras'>
          <ListItemIcon>
            <DomainIcon />
          </ListItemIcon>
          <ListItemText primary='Infrastructures' />
        </ListItem>
      </List>
    </Drawer>
  );
};
