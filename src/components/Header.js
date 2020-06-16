import React from "react";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inspect: false
        };
    }

    handleFileChange = (e) => {
        let filesList = e.target.files;
        const length = filesList.length;
        if (length !== 0) {
            var files = {
                html: "",
                styleSheets: []
            };
            var i = 0;
            var reader = new FileReader();

            reader.onload = () => {
                let text = reader.result;
                if (filesList[i].type === "text/html") 
                    files.html = text;
                else if (filesList[i].type === "text/css") 
                    files.styleSheets.push({name: filesList[i].name, content: text});
                else ;//send a message to user about what type of file can upload
                if (++i < length) 
                    reader.readAsText(filesList[i]);
                else 
                    this
                        .props
                        .setFiles(files);
                }
            reader.readAsText(filesList[i]);
        }
    }

    handleInspect = () => {
        let newValue = !this.state.inspect;
        this
            .props
            .setInspect(newValue);
        this.setState({inspect: newValue});
    }

    render() {
        return (
            <div id="app_header">
                <div>
                    <input type="file" multiple onChange={(e) => this.handleFileChange(e)}/>
                </div>
                <div id="inspect" onClick={this.handleInspect}>
                    <svg
                        
                        width="1em"
                        height="100%"
                        viewBox="0 0 16 16"
                        fill= {(this.state.inspect) ? "white" : "currentColor"}
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            d="M1.5 3A1.5 1.5 0 0 1 3 1.5h10A1.5 1.5 0 0 1 14.5 3v5a.5.5 0 0 1-1 0V3a.5.5 0 0 0-.5-.5H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1H3A1.5 1.5 0 0 1 1.5 13V3z"/>
                        <path
                            fillRule="evenodd"
                            d="M11.5 6a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 1 0V6.5H11a.5.5 0 0 0 .5-.5z"/>
                        <path
                            fillRule="evenodd"
                            d="M5.646 5.646a.5.5 0 0 0 0 .708l8 8a.5.5 0 0 0 .708-.708l-8-8a.5.5 0 0 0-.708 0z"/>
                    </svg>
                </div>
            </div>
        );
    }
}

export default Header;