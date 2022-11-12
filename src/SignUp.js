import React from "react";
import api from "@/util/api";
import { Link } from "react-router-dom";

const pwdRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_-]).{8,}$/g

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      fname: '',
      lname: '',
      prompt: {
        msg: '',
        status: null
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
      // Validation
      for(let k of ['username', 'password', 'confirmPassword', 'fname', 'lname']){
        if(this.state[k].trim().length == 0){
          this.setState({prompt: {
            msg: `The '${k}' field is required.`,
            status: false
          }});
          return;
        }
      }
      if(!this.state.password.match(pwdRegex)){
        this.setState({prompt: {
          msg: 'Passwords must be at least 8 characters long and contain at least one of the following: 1 Uppercase. 1 Lowercase, 1 Numerical, 1 Special Character.',
          status: false
        }});
        return;
      }
      if(this.state.password !== this.state.confirmPassword){
        this.setState({prompt: {
          msg: 'Passwords do not match.',
          status: false
        }});
        return;
      }
  
      // Submit registration post request
      api.post('/auth/register', this.state).then((res)=>{
        if(res?.data){
          this.setState({prompt: {status: res.data.status, msg: res.data.msg}});
        }
      }).catch((e)=>{
        this.setState({prompt: {status: false, msg: `An error has occured: ${e}`}});
      })
    });
  }

  render() {
    return (<div>
      <div style={{visibility: this.state.prompt.status !== null}}>
        {this.state.prompt.msg}
      </div>
      <form>
        <div>
          <div>
            <label>Username:</label>
            <input type="text" name="username" value={this.state.username} onInput={this.handleChange} autoComplete="username" required/>
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={this.state.password} onInput={this.handleChange} autoComplete="new-password" required/>
          </div>
          <div>
            <label>Confirm Password:</label>
            <input type="password" name="confirmPassword" value={this.state.confirmPassword} onInput={this.handleChange} autoComplete="off" required/>
          </div>
        </div>
        <div>
          <div>
            <label>First Name:</label>
            <input type="text" name="fname" value={this.state.fname} onInput={this.handleChange} autoComplete="name" required/>
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" name="lname" value={this.state.lname} onInput={this.handleChange} autoComplete="family-name" required/>
          </div>
        </div>
        <div>
          <button type="submit" className="btn" onClick={this.onSubmit}>Sign Up</button>
        </div>
        <div>
          <p>Already have an account? <Link className='btn' to='/login'><b>Log in</b></Link></p>
        </div>
      </form>
    </div>)
  }
}