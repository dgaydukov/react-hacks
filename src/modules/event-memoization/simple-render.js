'use strict';

import React, {PureComponent} from 'react';

class SimpleRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
        }
    }

    onClick(i) {
        this.setState({counter: i});
    }

    render() {
        return (
            <div>
                <div>{this.state.counter}</div>
                <div>
                    {[...new Array(10)].map((item, i)=> {
                        return (
                            <Button key={i} onClick={this.onClick.bind(this, i)} title={`click ${i}`}/>
                        )
                    })}
                </div>
            </div>
        )
    }
}

class Button extends PureComponent {
    render() {
        console.log("render Button");
        return (
            <button onClick={this.props.onClick}>{this.props.title}</button>
        )
    }
}

export default SimpleRender;