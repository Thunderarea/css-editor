import React from "react";
import Header from "./Header.js";
import Body from "./Body.js";
import "../styles/app.css";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            files: {
                html: "", //html text
                styleSheets: [] //file and cssText of file
            },
            inspect: false
        };
    }

    setFiles = (files) => {
        this.setState({files: files});
    }

    setInspect = (newValue) => {
        this.setState({inspect: newValue});
    }

    render() {
        return (
            <div id="app_container">
                <Header setFiles={this.setFiles} setInspect={this.setInspect}/>
                <Body files={this.state.files} inspect={this.state.inspect}/>
            </div>
        );
    }
}

export default App;
