'use strict';


import React from 'react';
import SimpleRender from "./simple-render";
import MemoRender from "./memo-render";

export default class EventMemoization extends React.Component{
    render(){
        return(
            <div>
                <h1>EventMemoization</h1>
                <h4>SimpleRender: every click rerender 10 times</h4>
                <SimpleRender/>
                <h4>MemoRender: click's don't rerender</h4>
                <MemoRender/>
            </div>
        )
    }
}