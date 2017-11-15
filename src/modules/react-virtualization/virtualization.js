'use strict';

import React from 'react';
import axios from 'axios';
import throttle from 'lodash/throttle';
import * as s from "./style.css";

const RECORD_TO_DISPLAY = 30000;
const RECORD_HEIGHT = 40;
const PER_PAGE = 20;

export default class Virtualization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            start: 0,
            end: PER_PAGE,
        }
        this.loadMore = throttle(this.loadMore.bind(this), 300);
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

    loadMore() {
        const height = document.body.scrollHeight - window.pageYOffset - document.body.offsetHeight;
        console.log(height)
        if (height < 200) {
            // this.setState({
            //     start: this.state.end,
            //     end: this.state.end + PER_PAGE,
            // })
        }
    }

    render() {
        const fields = ["productId", "productName", "productPrice", "productQuantity", "productHash"];
        return (
            <div>
                <h2>Virtualization</h2>
                <div style={{height: RECORD_TO_DISPLAY*RECORD_HEIGHT+"px"}}>
                    <table>
                        <thead>
                        <tr>
                            {fields.map((item, i)=> {
                                return (
                                    <th key={i} className={s.th}>{item}</th>
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
                                            <td key={j} className={s.td}>{item[field]}</td>
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