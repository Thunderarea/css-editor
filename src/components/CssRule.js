import React from "react";
import Declaration from "./Declaration.js"
import {preventKeyDefault, onBlur, clickEditable} from "./CssEditorFunctions.js";

class CSSRule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            items: [],
            focusSwitch: false
        };
        this.key = 0;
        this.focusedID = false;
    }

    handleMouseDown(e) {
        const target = e.target;
        if ((target.classList.contains("css_rule") || target.classList.contains("css_declarations")) && (document.activeElement.classList.contains("dec_property") && !document.activeElement.textContent.trim())) 
            e.preventDefault();
        }
    
    handleMouseUp(e) {
        const target = e.target;
        if (target.classList.contains("css_rule") || target.classList.contains("css_declarations")) {
            e.preventDefault();
            if (document.activeElement.classList.contains("dec_property") && !document.activeElement.textContent.trim()) 
                document.activeElement.blur();
            else 
                this.addDeclaration();
            }
        }

    selectorKeyListener(e) {
        if (preventKeyDefault(e) === 13) {
            let target = e.target;
            if (target.textContent.trim()) 
                (this.state.items.length)
                    ? this.focusNext(this.state.items[0].id)
                    : this.addDeclaration();
            else 
                target.blur();
            }
        }

    focusNext = (next) => {
        this.focusedID = next;
        this.setState({
            focusSwitch: !this.state.focusSwitch
        });
    }

    initializeDeclarations = () => {
        let newItem = null, dec = [];
        let items = [];
        
        this.props.style.split(";").forEach(declaration => {
            if(declaration !== "") {
                dec = declaration.split(":");
                newItem = {
                    id: this.key++,
                    property: dec[0].trim(),
                    value: dec[1].trim()
                };
                items.push(newItem);
            }
        });
        this.setState({items: items});
    }

    addDeclaration = () => {
        let items = [...this.state.items];
        const newItem = {
            id: this.key,
            property: "",
            value: ""
        };
        this.key++;
        items.push(newItem);
        this.setState({items: items});
    }

    removeDeclaration = (id) => {
        let items = [...this.state.items];
        items = this
            .state
            .items
            .filter(item => item.id !== id);
        this.setState({items: items});
    }

    nextDeclaration = (currentID) => {
        let items = this.state.items;
        let length = items.length;
        for (let i = 0; i < length; i++) {
            if (items[i].id === currentID) {
                (++i < length)
                    ? this.focusNext(this.state.items[i].id)
                    : this.addDeclaration();
                break;
            }
        }
    }

    EnDisCheckbox = (nextState) => {
        this.setState({disabled: nextState});
    }

    handleBlur(e) {
        if (onBlur(e)) 
            this.props.remove(this.props.id);
        }
    
    componentDidUpdate() {
        this.focusedID = false;
    }

    componentDidMount() {
        this.initializeDeclarations();
    }

    render() {
        let disabled = (this.state.disabled)
            ? "disabled"
            : "enabled";
        let focused;

        return (
            <div
                className="css_rule"
                onMouseUp=
                {(e) => this.handleMouseUp(e)}
                onMouseDown=
                {(e) =>this.handleMouseDown(e)}>
                <div className="css_file">{this.props.fileName}</div>
                <div className="css_selector_container">
                    <span
                        className="css_selector"
                        spellCheck="false"
                        contentEditable="false">
                        {this.props.selector}
                    </span>
                    <span>&nbsp;&#123;</span>
                </div>
                <ol className={"css_declarations " + disabled}>
                    {this
                        .state
                        .items
                        .map((item, i) => {
                            focused = (this.focusedID === item.id);
                            return <Declaration
                                key={item.id}
                                id={item.id}
                                property={item.property}
                                value={item.value}
                                focused={focused}
                                styleObject={this.props.styleObject}
                                nextDec={this.nextDeclaration}
                                EnDisCheckbox={this.EnDisCheckbox}
                                remove={this.removeDeclaration}/>;
                        })}
                </ol>
                <span>&#125;</span>
            </div>
        );
    }
}

export default CSSRule;

/**
 * from the css selector
 *  onKeyDown={(e) => this.selectorKeyListener(e)}
    onBlur={(e) => this.handleBlur(e)}
    onMouseDown={(e) => clickEditable(e)}
 */