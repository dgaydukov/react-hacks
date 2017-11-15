'use strict';

/*
 * React Router
 * Connect redux state to all routes
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect, Provider } from 'react-redux';
import store from "./redux/store";
import Layout from "./modules/layout/layout"

const Router = (props) => {
    return (
        <BrowserRouter>
            <Layout {...props}/>
        </BrowserRouter>
    )
};
const mapStateToProps = store => (
    {
        user: store.userState.user,
    }
);

const mapDispatchToProps = dispatch => (
    {
        dispatch: dispatch,
    }
)


const ConnectedRouter = connect(mapStateToProps, mapDispatchToProps)(Router);

const ReduxRouter = () =>(
    <Provider store={store}>
        <ConnectedRouter />
    </Provider>
)

export default ReduxRouter;