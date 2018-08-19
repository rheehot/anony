import React from "react";
import {
    Alert,
    Button
} from "react-bootstrap";
import "./AlertDismissable.scss";


export default class AlertDismissable extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleDismiss = this.handleDismiss.bind(this);
      this.handleShow = this.handleShow.bind(this);
  
      this.state = {
        show: false,
        style: "warning",   // success, warning, danger, info
        message: "",
        width: "200px",
      };


      tp.view.AlertDismissable = this;
    }
  
    handleDismiss() {
      this.setState({ show: false, message: "" });
      if(typeof this.onClose === "function"){
        this.onClose();
        this.onClose = undefined;
      }
    }
  
    handleShow({message, style="warning", width="200px", onClose}) {
      this.setState({
        show: true,
        message,
        style,
        width,
      });
      this.onClose = onClose;
    }
  
    render() {
      if (this.state.show) {
        return (
          <div>
            <div className="modal_div"></div>
            <Alert bsStyle={this.state.style} style={{width: this.state.width}} onDismiss={this.handleDismiss}>
              <p>
                {this.state.message}
              </p>
              <p>
                {/* <Button bsStyle="danger">Take this action</Button>
                <span> or </span> */}
                <Button bsStyle={this.state.style} onClick={this.handleDismiss}>Close</Button>
              </p>
            </Alert>
          </div>
        );
      }else{
        return null;
      }
    }
}