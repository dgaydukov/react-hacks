'use strict';

import React from 'react';
import axios from 'axios'
import * as s from "./style.css";

const RECORD_NUMBER = 100;

export default class RenderAll extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list: []
        }
    }

    componentDidMount(){
        axios.get("/json/product-list.json").then(response=>{
            this.setState({list: response.data})
        })
    }

    render(){
        const fields = ["productId","productName","productPrice","productQuantity","productHash"]
        return(
            <div>
                <h2>RenderAll</h2>
                <table>
                    <thead>
                        <tr>
                            {fields.map((item,i)=>{
                                return(
                                    <th key={i} className={s.th}>{item}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.list.slice(0, RECORD_NUMBER).map((item,i)=>{
                            return(
                                <tr key={i}>
                                    {fields.map((field,j)=>{
                                        return(
                                            <td key={j} className={s.td}>{item[field]}</td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}