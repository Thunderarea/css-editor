import React from "react";
import Preview from "./Preview.js";
import CSSEditor from "./CssEditor.js"

class Body extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            elCss: {
                element: null,
                cssRules: []
            }
        };
    }

    sendCss = (elCss) => {
        this.setState({elCss: elCss});
    }

    render() {
        return (
            <div id="app_body">
                <div id="left">
                    <CSSEditor elementsCss={this.state.elCss}/>
                </div>
                <div id="preview_container">
                    <Preview 
                        files={this.props.files} 
                        inspect={this.props.inspect}
                        elementsCss={this.sendCss}/>
                </div>
            </div>
        );
    }
}

export default Body;