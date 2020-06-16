import React from 'react';
import CSSRule from "./CssRule.js"
import '../styles/cssEditor.css';

class CSSEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "", //to change when set it to "<empty>"
            items: []
        };
        this.key = 0;
    }

    removeChild = (id) => {
        let items = [...this.state.items];
        items = items.filter(item => item.id !== id);
        this.setState({items: items});
    }

    getElementsDescription = () => {
        let description = "";
        if(this.props.elementsCss.element) {
            let el = this.props.elementsCss.element;
            description = el.tagName.toLowerCase();
            description+= (el.id) ? "#"+el.id : "";
            el.classList.forEach(class_name => {
                description+="."+class_name;
            });
        }
        return description;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.elementsCss !== this.props.elementsCss) {
            var items = [];
            let newItem = null;
            nextProps.elementsCss.cssRules.forEach(rule => {
                newItem = {
                    id: ++this.key,
                    fileName: rule.fileName,
                    selector: rule.css.selectorText,
                    style: rule.css.style.cssText,
                    styleObject: rule.css.style
                };
                items.unshift(newItem);
            });
            this.setState({items: items});
            return false;
        } else if ((nextState.value === this.state.value) && (nextState.items === this.state.items)) return false;
        return true;
    }

    render() {
        
        
        return (
            <div id="css_editor">
                <div id="inspected_element">{this.getElementsDescription()}</div>
                <div className="css_rules">
                    {this
                        .state
                        .items
                        .map(item => {
                            return <CSSRule
                                key={item.id}
                                fileName={item.fileName}
                                selector={item.selector}
                                style={item.style}
                                styleObject={item.styleObject}
                                remove={this.removeChild}
                                id={item.id}/>;
                        })}
                </div>
            </div>
        );
    }
}

export default CSSEditor;

/*
style rule = (
  selector {
    declaration = (
      property: value
    )
  }
)

<form id="as_form" onSubmit= {(e) => this.handleSubmit(e)}>
                    <input
                        type="text"
                        id="search_add_field"
                        name="search_add_field"
                        placeholder="Type and press enter"
                        value={this.state.value}
                        onChange=
                        {(e) => this.setState({value: e.target.value})}/>
                    <input type="submit" value="Add"/>
                </form>
*/

/*handleSubmit(e) {
        e.preventDefault();
        if (this.state.value.trim()) {
            const newItem = {
                id: ++this.key,
                value: this.state.value
            };
            let items = [...this.state.items];
            items.unshift(newItem);
            this.setState({value: "", items: items});
        }
    }*/
