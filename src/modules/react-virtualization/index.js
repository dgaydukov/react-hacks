'use strict';


import React from 'react';
import RenderAll from './render-all';

export default class ReactVirtualization extends React.Component{
    render(){
        return(
            <div>
                <h1>ReactVirtualization</h1>
                <RenderAll/>
            </div>
        )
    }
}