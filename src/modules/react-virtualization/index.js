'use strict';


import React from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import RenderAll from './render-all';
import Virtualization from './virtualization';

const BASE_PATH = 'react-virtualization';

const Header = () => {
    return(
        <header>
            <ul>
                <li><Link to={`/${BASE_PATH}/render-all`}>render-all</Link></li>
                <li><Link to={`/${BASE_PATH}/virtualization`}>virtualization</Link></li>
            </ul>
        </header>
    )
}

const Content = (props) => {
    return(
        <Switch>
            <Route path={`/${BASE_PATH}/render-all`} component={RenderAll}/>
            <Route path={`/${BASE_PATH}/virtualization`} component={Virtualization}/>
        </Switch>
    )
}

export default class ReactVirtualization extends React.Component{
    render(){
        return(
            <div className="wrapper">
                <h1>ReactVirtualization</h1>
                <Header/>
                <Content {...this.props}/>
            </div>
        )
    }
}