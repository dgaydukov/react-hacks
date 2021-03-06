'use strict';


import React, {PureComponent} from 'react';

class MemoRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 1,
        }
        this.cache = new WeakMap();
        this.onClick = this.onClick.bind(this);
    }

    renderButton(i) {
        const item = {id: i};
        if (this.cache.has(item)) {
            return this.cache.get(item)
        }
        const component = (
            <Button
                key={item.id}
                i={item.id}
                title={`click ${i}`}
                onClick={this.onClick}
            />
        )
        this.cache.set(item, component)
        return component
    }


    onClick(i) {
        this.setState({counter: i});
    }

    render() {
        return (
            <div>
                <h1>Main Page</h1>
                <div>{this.state.counter}</div>
                {[...new Array(10)].map((item, i)=>this.renderButton(i))}
            </div>
        )
    }
}

class Button extends PureComponent {
    render() {
        const {
            title,
            onClick,
            i
        } = this.props;
        console.log("render Button")
        return (
            <button onClick={()=>{onClick(i)}}>{title}</button>
        )
    }
}

export default MemoRender;