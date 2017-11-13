### WeakMap & event memoization

Suppose you have a component Button, that you call 10 times
```javascript
class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            counter: 0,
        }
    }

    onClick(i){
        this.setState({counter: i});
    }

    render(){
        return(
            <div>
                <div>{this.state.counter}</div>
                <div>
                    {[...new Array(10)].map((item,i)=> {
                        return (
                            <Button key={i} onClick={this.onClick.bind(this, i)} title={`click ${i}`}/>
                        )
                    })}
                </div>
            </div>
        )
    }
}

class Button extends PureComponent{
    render(){
        console.log("render Button")
        return(
            <button onClick={this.props.onClick}>{this.props.title}</button>
        )
    }
}
```
Despite ```Button``` is ```PureComponent```, whenever we click on it, we change state of the parent and, re-render all 10 buttons. That's happening because of this
```onClick={this.onClick.bind(this, i)}```. Every time we create new function. In order to avoid this, we have to use function memoization. The best approach is to use
WeakMap
```javascript
class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            counter: 1,
        }
        this.cache = new WeakMap();
        this.onClick = this.onClick.bind(this);
    }

    renderButton(i){
        const item = {id: i};
        if(this.cache.has(item)){
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


    onClick(i){
        this.setState({counter: i});
    }

    render(){
        return(
            <div>
                <h1>Main Page</h1>
                <div>{this.state.counter}</div>
                {[...new Array(10)].map((item,i)=>this.renderButton(i))}
            </div>
        )
    }
}

class Button extends PureComponent{
    render(){
        const {
            title,
            onClick,
            i
        } = this.props;
        console.log("render Button")
        return(
            <button onClick={()=>{onClick(i)}}>{title}</button>
        )
    }
}
```
Here we memoize every ```onClick``` event, and ```WeakMap``` also helps here to use it's internal gb clear functions.