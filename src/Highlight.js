import React from "react";
import "./highlight.css"

class Highlight extends React.Component {
    constructor() {
        super();
        this.div = document.createElement("div");
        this.div.id = "highlighter";
        document.body.appendChild(this.div);
    }

    handleMouse = (e) => {
        let rect = e.target.getBoundingClientRect();
        //console.log(document.documentElement.scrollTop);
        
        //console.log(rect.top+" rect");
        //console.log(rect.left+" rect");
        
        
        
        this.div.style.height = rect.height +"px";
        this.div.style.width = rect.width+"px";
        this.div.style.left = rect.left+document.documentElement.scrollLeft+"px";
        this.div.style.top = rect.top+document.documentElement.scrollTop+"px";
    }

    componentDidMount() {
        document.addEventListener("mouseover", this.handleMouse);
    }

    render() {
        return (
            <div>
                <h1>Ok</h1>
                <h2>sec</h2>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
    }
}

export default Highlight;

//margin === border of my div

//stroke ???