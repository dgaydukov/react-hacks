'use strict';

/**
 *  WebApp layout component
 */

import React from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import EventMemoization from "../event-memoization";
import ReactVirtualization from "../react-virtualization";
import RedirectStrategy from "../redirect-strategy";


const Content = (props) => {
    return(
        <Switch>
            <Route path="/event-memoization" component={EventMemoization}/>
            <Route path="/react-virtualization" component={ReactVirtualization}/>
            <Route path='/redirect-strategy' render={() => (
                <RedirectStrategy {...props}/>
            )}/>
        </Switch>
    )
}

export default class Layout extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
    }

    render(){
        return(
            <div className="wrapper">
                <header>
                    <ul>
                        <li><Link to="/event-memoization">Event Memoization</Link></li>
                        <li><Link to="/react-virtualization">React Virtualization</Link></li>
                        <li><Link to="/redirect-strategy">Redirect Strategy</Link></li>
                    </ul>
                </header>
                <Content {...this.props}/>
            </div>
        )
    }
}