import { CssBaseline, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'; // Pages
import { Header } from './components/Header';
import { SideMenu } from './components/SideMenu';
import { Apps } from './components/apps/Apps';
import { Infras } from './components/infras/Infras';
import { Infra } from './components/infras/Infra';
import { CreateInfra } from './components/infras/CreateInfra';
import { App } from './components/apps/App';
import { CreateApp } from './components/apps/CreateApp';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    main: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
  }),
);

export const Main = () => {
  const classes = useStyles({});

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <CssBaseline />
        <Header />
        <SideMenu />
        <main className={classes.main}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path='/'>
              <Redirect to='/apps' />
            </Route>
            <Route exact path='/infras/create' component={CreateInfra} />
            <Route exact path='/infras/:infraId' render={(props) => <Infra infraId={props.match.params.infraId} />} />
            <Route exact path='/infras' component={Infras} />
            <Route exact path='/apps/create' component={CreateApp} />
            <Route exact path='/apps/:appId' render={(props) => <App appId={props.match.params.appId} />} />
            <Route exact path='/apps' component={Apps} />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
};
