import React from "react";
import ReactDOM from "react-dom";

class Preview extends React.Component {
    constructor(props) {
        super(props);
        this.outerIframe = React.createRef();
        this.innerIframe = React.createRef();
        this.outerHighlight = React.createRef();
        this.innerHighlight = React.createRef();
        this.outerIframeDoc = null;
        this.innerIframeDoc = null;
        this.currentHighlighted = null;

        this.Highlight = this.Highlight.bind(this);
        this.updateHighlightedPosition = this.updateHighlightedPosition.bind(this);
    }

    getBlobURL = (code, type) => {
        const blob = new Blob([code], {type});
        return URL.createObjectURL(blob);
    }

    Highlight(e) {
        if(this.props.inspect) {
            this.currentHighlighted = e.target;
            let rect = e.target.getBoundingClientRect();
            let style = window.getComputedStyle(e.target);
            this.outerHighlight.current.style.display = "block";
            this.outerHighlight.current.style.left = rect.left - parseInt(style.getPropertyValue("margin-left")) + "px";
            this.outerHighlight.current.style.top = rect.top - parseInt(style.getPropertyValue("margin-top")) + "px"; 
            this.outerHighlight.current.style.height = rect.height - (parseInt(style.getPropertyValue("border-top-width")) + parseInt(style.getPropertyValue("border-bottom-width"))) + "px";
            this.outerHighlight.current.style.width = rect.width - (parseInt(style.getPropertyValue("border-left-width")) + parseInt(style.getPropertyValue("border-right-width"))) + "px";
            
            this.outerHighlight.current.style.borderTopWidth = style.getPropertyValue("margin-top");
            this.outerHighlight.current.style.borderBottomWidth = style.getPropertyValue("margin-bottom");
            this.outerHighlight.current.style.borderLeftWidth = style.getPropertyValue("margin-left");
            this.outerHighlight.current.style.borderRightWidth = style.getPropertyValue("margin-right");
            
            this.outerHighlight.current.style.paddingTop = style.getPropertyValue("border-top-width");
            this.outerHighlight.current.style.paddingBottom = style.getPropertyValue("border-bottom-width");
            this.outerHighlight.current.style.paddingLeft = style.getPropertyValue("border-left-width");
            this.outerHighlight.current.style.paddingRight = style.getPropertyValue("border-right-width");
            
            this.innerHighlight.current.style.borderTopWidth = style.getPropertyValue("padding-top");
            this.innerHighlight.current.style.borderBottomWidth = style.getPropertyValue("padding-bottom");
            this.innerHighlight.current.style.borderLeftWidth = style.getPropertyValue("padding-left");
            this.innerHighlight.current.style.borderRightWidth = style.getPropertyValue("padding-right");
        } else this.removeHighlight();
    }

    handleClick = (e) => {
        if(this.props.inspect) {
            let el = e.target;
            if(el) {
                this.props.elementsCss({
                    element: el, 
                    cssRules: findCSSRules(el, this.innerIframeDoc)
                });
            }
            console.log(el);
        }
    }

    removeHighlight = () => {
        this.innerIframeDoc.removeEventListener("mouseover", this.Highlight);
        this.innerIframeDoc.removeEventListener("scroll", this.updateHighlightedPosition);
        this.innerIframeDoc.removeEventListener("mousedown", this.handleClick);
        this.outerHighlight.current.style.display = "none";
    }

    handleLoad = () => {
        this.outerIframeDoc = this.outerIframe.current.contentDocument;
        this
            .outerIframeDoc
            .removeChild(this.outerIframeDoc.firstElementChild);
        this.forceUpdate();
    }

    updateHighlightedPosition() {
        if(this.currentHighlighted) {
            let rect = this.currentHighlighted.getBoundingClientRect();
            let style = window.getComputedStyle(this.currentHighlighted);
            this.outerHighlight.current.style.left = rect.left - parseInt(style.getPropertyValue("margin-left")) + "px";
            this.outerHighlight.current.style.top = rect.top - parseInt(style.getPropertyValue("margin-top"))  + "px"; 
        }
    }

    handleInnerLoad(e) {
        this.innerIframeDoc = this.innerIframe.current.contentDocument;
        let styleLinks = this.innerIframeDoc.head.querySelectorAll("link");
        
        if(styleLinks.length && this.props.files.styleSheets.length) {
            let styleSheets = [...this.props.files.styleSheets];
            let name = "";
            let parts = [];
            let styleEl = null;
            styleLinks.forEach(el => {
                parts = el.attributes.href.value.trim().split("/");
                name = parts[parts.length - 1];
                
                for (let i = 0; i < styleSheets.length; i++) {
                    if (styleSheets[i].name === name) {
                        styleEl = document.createElement("style");
                        styleEl.id = el.attributes.href.value.trim();
                        styleEl.textContent = styleSheets[i].content;
                        el.parentNode.replaceChild(styleEl, el);
                        styleSheets.splice(i,1);
                        break;
                    }
                }
            });
        }
        this.outerIframeDoc.onmouseenter = () => {
            if(this.props.inspect) {
                this.innerIframeDoc.addEventListener("mousedown", this.handleClick);
                this.innerIframeDoc.addEventListener("mouseover", this.Highlight);
                this.innerIframeDoc.addEventListener("scroll", this.updateHighlightedPosition);
            }
        }
        this.outerIframeDoc.addEventListener("mouseleave", this.removeHighlight, true)
    }

    shouldComponentUpdate(nextProps) {
        if((nextProps.inspect !== this.props.inspect) || compareProps(nextProps, this.props)) return false;
        return true;
    }

    componentDidMount() {
        this
            .outerIframe
            .current
            .addEventListener("load", this.handleLoad);
    }

    componentWillUnmout() {
        this
            .outerIframe
            .current
            .removeEventListener("load", this.handleLoad);
    }

    render() {
        let bodyStyle = {
            margin: 0,
            padding: 0,
            height: "100%",
            width: "100%",
            overflow: "hidden"
        };
        let innerIframe = {
            border: "none",
            margin: 0,
            backgroundColor: "white"
        };
        let outerHighlighter = {
            position: "absolute",
            display: "none",
            border: "0 solid rgba(249, 175, 63, 0.69)",
            backgroundColor: "rgba(251, 245, 61, 0.7)",
            pointerEvents: "none"
        };
        let innerHighlighter = {
            height: "100%",
            width: "100%",
            border: "0 solid rgba(108, 210, 108, 0.78)",
            boxSizing: "border-box",
            backgroundColor: "rgba(99, 183, 255, 0.88)",
            pointerEvents: "none"
        };
        let innerIframeSource = (this.props.files.html === "") ? "about:blank": this.getBlobURL(this.props.files.html, "text/html");
         
        let iframeContent = (
            <html style={{height: "100%", width: "100%"}}>
                <head>
                    <title>Nikos</title>
                </head>
                <body style={bodyStyle}>
                    <iframe title="inner iframe" 
                            src={innerIframeSource} 
                            height="100%" 
                            width="100%" 
                            style={innerIframe}
                            onLoad={(e) => this.handleInnerLoad(e)}
                            ref={this.innerIframe}>
                    </iframe>
                    <div id="highlighter_outer" ref={this.outerHighlight} style={outerHighlighter}>
                        <div id="highlighter_inner" ref={this.innerHighlight} style={innerHighlighter}></div>
                    </div>
                </body>
            </html>
        );
        return (
            <iframe title="outer iframe" id="outer_iframe" ref={this.outerIframe} srcDoc="<!DOCTYPE html>">
                {this.outerIframeDoc && ReactDOM.createPortal(iframeContent, this.outerIframeDoc)}
            </iframe>
        );
    }
}

export default Preview;

function findCSSRules(el, doc) {
    let sheets = doc.styleSheets;
    let parent = el.parentNode;
    let cssRules = [];
    for (let i = 0; i < sheets.length; i++) {
        for (let j = 0; j < sheets[i].cssRules.length; j++) {
          sheets[i].cssRules[j].selectorText.split(",").forEach((selector) => {
            parent.querySelectorAll(":scope > "+selector.trim()).forEach((item) => {
              if (item === el) {
                //with order that appear inside the document
                //the order play role on some styles
                cssRules.unshift({
                    fileName: sheets[i].ownerNode.id,
                    css: sheets[i].cssRules[j]
                });
              }
            });
          });
        }
    }    
    //console.log(cssRules);
    return cssRules;
}

function compareProps(next, current) {
    if(next.files !== current.files) return false;
    return true;
}

/*

*/