import React from "react";


export default class Dialog extends React.Component {
  constructor(props){
    super(props);
    this.bgClickDismiss = this.bgClickDismiss.bind(this);
  }

  bgClickDismiss(e){
    let bgDiv = document.querySelector('.dialogContainer');
    if(e.target !== bgDiv) return;
    this.props.onCancel && this.props.onCancel();
  }
  
  render(){
    const dialogBgStyle = {
      position: 'fixed',
      left: 0, top: 0,
      background: '#00000040',
      width: '100vw',
      height: '100vh',
      padding: 0,
      margin: 0,
      display: (this.props.show) ? 'block' : 'none'
    };

    const dialogStyle = {
      width: '80vw',
      height: '80vh',
      background: '#f2f2f2',
      margin: '10vh 10vw',
      padding: '1em 5%',
      boxSizing: 'border-box'
    };

    return (<div className="dialogContainer" style={dialogBgStyle} onClick={this.bgClickDismiss}>
      <div style={dialogStyle}> {this.props.children} </div>
    </div>)
  }
  
}