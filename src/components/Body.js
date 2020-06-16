import React from "react";
import Preview from "./Preview.js";
import CSSEditor from "./CssEditor.js";

class Body extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            elementsCss: {
                element: null,
                cssRules: []
            }
        };
    }

    setElementsCss = (elementsCss) => {
        this.setState({elementsCss: elementsCss});
    }

    render() {
        return (
            <div id="app_body">
                <div id="side_panel">
                    <CSSEditor elementsCss={this.state.elementsCss}/>
                </div>
                <div id="preview_container">
                    <Preview 
                        files={this.props.files} 
                        inspect={this.props.inspect}
                        elementsCss={this.setElementsCss}/>
                </div>
            </div>
        );
    }
}

export default Body;