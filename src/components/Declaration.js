import React from "react";
import {preventKeyDefault, onBlur, clickEditable} from "./CssEditorFunctions.js";

class Declaration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            decClass: "",
            startComment: " ",
            endComment: "",
            checked: true
        };
        this.DecProperty = React.createRef();
        this.DecValue = React.createRef();
        this.Checkbox = React.createRef();
    }

    propertyKeyListener(e) {
        if (preventKeyDefault(e) === 13) {
            let target = e.target;
            (target.textContent.trim())
                ? this.focusEditableElement(this.DecValue.current)
                : target.blur();
        }
    }

    valueKeyListener(e) {
        let key = preventKeyDefault(e);
        if (key === 13) {
            let target = e.target;
            (target.textContent.trim())
                ? this
                    .props
                    .nextDec(this.props.id)
                : this.focusEditableElement(this.DecProperty.current);
        } else if (key === 186) 
            this.props.nextDec(this.props.id);
        }
    
    handleMouse(nextState) {
        this
            .props
            .EnDisCheckbox(nextState);
    }

    handleBlur(e, value) {
        if (value) {
            if (onBlur(e) && (e.relatedTarget !== this.DecProperty.current)) 
                this.props.remove(this.props.id);
            }
        else {
            if (onBlur(e) || ((e.relatedTarget !== this.DecValue.current) && !this.DecValue.current.textContent.trim())) 
                this.props.remove(this.props.id);
            }
        }

    focusEditableElement = (el) => {
        el.setAttribute("contentEditable", "true");
        el.focus();
    }

    handleCheckChange(e) {
        let target = e.target;
        console.log(target.checked);
        if (target.checked) {
            this.setState({decClass: "", startComment: " ", endComment: "", checked: true});
        } else {
            this.setState({decClass: "is_comment", startComment: " /*", endComment: "*/", checked: false});
        }
    }

    componentDidMount() {
        this.focusEditableElement(this.DecProperty.current);
    }

    componentDidUpdate() {
        this.Checkbox.current.checked = this.state.checked;
    }

    render() {
        if (this.props.focused) 
            this.focusEditableElement(this.DecProperty.current);
        return (
            <li className={"css_declaration" + this.state.decClass}>
                <span className="space_and_comments start">{this.state.startComment}</span>
                <input
                    className="comment"
                    type="checkbox"
                    onMouseEnter={(e) => this.handleMouse(false)}
                    onMouseLeave={(e) => this.handleMouse(true)}
                    onChange={(e) => this.handleCheckChange(e)}
                    ref={this.Checkbox}/>
                <span
                    className="dec_property"
                    spellCheck="false"
                    contentEditable="false"
                    ref={this.DecProperty}
                    onKeyDown={(e) => this.propertyKeyListener(e)}
                    onBlur={(e) => this.handleBlur(e, false)}
                    onMouseDown={(e) => clickEditable(e)}>
                        {this.props.property}
                    </span>
                <span>:&nbsp;</span>
                <span
                    className="dec_value"
                    spellCheck="false"
                    contentEditable="false"
                    ref={this.DecValue}
                    onKeyDown={(e) => this.valueKeyListener(e)}
                    onBlur={(e) => this.handleBlur(e, true)}
                    onMouseDown={(e) => clickEditable(e)}>
                        {this.props.value}
                    </span>
                <span>;</span>
                <span className="space_and_comments end">{this.state.endComment}</span>
            </li>
        );
    }
}

export default Declaration;