'use strict';

import React from 'react';
import axios from 'axios';
import throttle from 'lodash/throttle';
import * as s from "./style.css";

const RECORD_TO_DISPLAY = 30000;
const RECORD_HEIGHT = 40;
const PER_PAGE = 22;

export default class Virtualization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            start: 0,
            end: PER_PAGE,
        }
        this.loadMore = throttle(this.loadMore.bind(this), 300);
        this.pageYOffset = 0;
    }

    componentDidMount() {
        axios.get("/json/product-list.json").then(response=> {
            this.setState({list: response.data})
        });
        document.addEventListener("scroll", this.loadMore);
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this.loadMore);
    }

    //todo: finish with right count of num
    loadMore() {
        let start = this.state.start,
            end = this.state.end;
        const diff = window.pageYOffset - this.pageYOffset;
        const num = Math.floor(Math.abs(diff)/RECORD_HEIGHT)
        console.log(start, end, num)
        if (diff > 0) {
            // move down
            start += num;
            end += num;
            if(start > RECORD_TO_DISPLAY){
                start = RECORD_TO_DISPLAY - PER_PAGE;
                end = RECORD_TO_DISPLAY;
            }
        }
        else{
            start -= num;
            end -= num;
            if(start < 0){
                start = 0;
                end = PER_PAGE;
            }
        }
        this.setState({
            start: start,
            end: end,
        })
        this.pageYOffset = window.pageYOffset;
    }

    render() {
        const fields = ["productId", "productName", "productPrice", "productQuantity", "productHash"];
        return (
            <div>
                <h2>Virtualization</h2>
                <div style={{height: RECORD_TO_DISPLAY*RECORD_HEIGHT+"px"}}>
                    <table className={s.fixed}>
                        <thead>
                        <tr>
                            {fields.map((item, i)=> {
                                return (
                                    <th key={i}>{item}</th>
                                )
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.list.slice(this.state.start, this.state.end).map((item, i)=> {
                            return (
                                <tr key={i}>
                                    {fields.map((field, j)=> {
                                        return (
                                            <td key={j}>{item[field]}</td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}