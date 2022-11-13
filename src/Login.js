import React from "react";
import api from "@/util/api";
import Session from "./util/Session";
import { Link, Navigate } from "react-router-dom";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      prompt: {
        status: null,
        msg: ''
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleChange(event){
    let key = event.target.name;
    let val = event.target.value;
    this.setState({[key]: val, prompt: {msg: '', status: null}});
  }

  onSubmit(event){
    event.preventDefault();
    
    this.setState({prompt: {msg: '', status: null}}, ()=>{
      api.post('/auth/login', this.state).then((res)=>{
        if(res?.data){
          if(res.data.status){
            this.setState({prompt: {status: true, msg: res.data.msg}});
            // TODO: Login
          }else{
            this.setState({prompt: {status: false, msg: res.data.msg}});
          }
        }
      }).catch((e)=>{
        this.setState({prompt: {status: false, msg: `An error has occured: ${e}`}});
      })
    });
  }

  render() {
    if(Session.getSession()){ return (<Navigate to="/home" />) }

    return (<div>
      <div style={{visibility: this.state.prompt.status !== null}}>
        {this.state.prompt.msg}
      </div>
      <form>
        <div>
          <div className="formGroup">
            <label>Username:</label>
            <input type="text" name="username" value={this.state.username} onInput={this.handleChange} autoComplete="username" required/>
          </div>
          <div className="formGroup">
            <label>Password:</label>
            <input type="password" name="password" value={this.state.password} onInput={this.handleChange} autoComplete="current-password" required/>
          </div>
        </div>
        <div>
          <button type="submit" className="btn" onClick={this.onSubmit}>Log In</button>
        </div>
        <div>
          <p>Don't have an account? <Link className='btn' to='/register'><b>Sign Up</b></Link></p>
        </div>
      </form>
    </div>)
  }
}