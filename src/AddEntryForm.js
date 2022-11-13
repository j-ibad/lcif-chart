import React from "react";
import api from "@/util/api";
import { Navigate } from "react-router-dom";
import { DateUtil } from '@/util/Helpers'
import Dialog from "@/Dialog";
import '@/AddEntryForm.css'


export default class AddEntryForm extends React.Component {
  constructor(props) {
    super(props);
    let defaultEntry = {
      orig_date: '',
      orig_time: '',
      date: '',
      time: '',
      bp_systolic: '',
      bp_diastolic: '',
      pulse: '',
      weight: '',
      glucose: '',
      if_hrs: '',
      comments: '',
    };
    this.state = {
      entry: Object.assign({}, defaultEntry, {date: DateUtil.now(), time: DateUtil.nowTime()}),
      defaultEntry,
      prompt: {
        msg: '',
        status: null
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.delete = this.delete.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidUpdate(prevProps){
    if(this.props.entry !== prevProps.entry){
      let entry = Object.assign({}, this.props.entry || this.state.defaultEntry);
      if(this.props.entry){
        [entry.orig_date, entry.orig_time] = [entry.date, entry.time];
      }else{
        [entry.date, entry.time] = [DateUtil.now(), DateUtil.nowTime()];
      }
      this.setState({entry});
    }

    // TODO: Update state to passed in props
  }

  handleChange(event){
    let key = event.target.name;
    let val = event.target.value;
    let entry = Object.assign(this.state.entry, {[key]: val});
    
    this.setState({entry, prompt: {msg: '', status: null}});
  }


  cancel(){ this.props.onCancel && this.props.onCancel(); }


  delete(event){
    event.preventDefault();
    this.setState({prompt: {msg: '', status: null}}, ()=>{
      api.post('/entry/delete', {date: this.state.entry.orig_date, time: this.state.entry.orig_time}).then((res)=>{
        if(res?.data){
          this.setState({prompt: {status: res.data.status, msg: res.data.msg}}, ()=>{
            if(res.data.status){
              this.props.onSubmit && this.props.onSubmit();
            }
          });
        }
      }).catch((e)=>{
        this.setState({prompt: {status: false, msg: `An error has occured: ${e}`}});
      })
    });
  }


  onSubmit(event){
    event.preventDefault();
    this.setState({prompt: {msg: '', status: null}}, ()=>{
      // Submit registration post request
      api.post('/entry/upsert', this.state.entry).then((res)=>{
        if(res?.data){
          this.setState({prompt: {status: res.data.status, msg: res.data.msg}}, ()=>{
            if(res.data.status){
              this.props.onSubmit && this.props.onSubmit();
            }
          });
        }
      }).catch((e)=>{
        this.setState({prompt: {status: false, msg: `An error has occured: ${e}`}});
      })
    });
  }


  isNew(){return this.state.entry.orig_date === '';}


  render() {
    return (<Dialog show={this.props.show} onCancel={this.cancel}>
      <div className="AddEntryForm">
        <div style={{visibility: this.state.prompt.status !== null}}>
          {this.state.prompt.msg}
        </div>
        {/*<p>{JSON.stringify(this.state.entry)}</p><br/>
        <p>{DateUtil.now()}</p>*/}
        <form>
          <div>
            <div>
              <label>Date:</label>
              <input type="date" name="date" value={this.state.entry.date} onInput={this.handleChange} required/>
            </div>
            <div>
              <label>Time:</label>
              <input type="time" name="time" value={this.state.entry.time} onInput={this.handleChange} required/>
            </div>
          </div>

          <div>
            <div className="formGroup">
              <label>Blood Pressure:</label>
              <input type="number" name="bp_systolic" min="0" step="1" value={this.state.entry.bp_systolic} onInput={this.handleChange} required/>
              <span> / </span>
              <input type="number" name="bp_diastolic" min="0" step="1" value={this.state.entry.bp_diastolic} onInput={this.handleChange} required/>
            </div>
            <div className="formGroup">
              <label>Pulse:</label>
              <input type="number" name="pulse" min="0" step="1" value={this.state.entry.pulse} onInput={this.handleChange} required/>
            </div>
            <div className="formGroup">
              <label>Weight:</label>
              <input type="number" name="weight" min="0" step=".01" value={this.state.entry.weight} onInput={this.handleChange} required/>
            </div>
            <div className="formGroup">
              <label>Glucose:</label>
              <input type="number" name="glucose" min="0" step="1" value={this.state.entry.glucose} onInput={this.handleChange} required/>
            </div>
          </div>

          <div>
            <div className="formGroup">
              <label>Intermittent Fasting:</label>
              <input type="number" name="if_hrs" min="0" value={this.state.entry.if_hrs} onInput={this.handleChange} required/>
            </div>
            <div className="formGroup">
              <label>Comments:</label>
              <textarea name="comments" value={this.state.entry.comments} onInput={this.handleChange} required/>
            </div>
          </div>

          <div className="btnPane">
            <button type="button" className="btn btnCaution" onClick={this.cancel}>Cancel</button>
            {this.isNew() || <button type="button" className="btn btnDanger" onClick={this.delete}>Delete</button>}
            <button type="submit" className="btn btnSuccess" onClick={this.onSubmit}>{(this.isNew()) ? 'Add' : 'Update'}</button>
          </div>
        </form>
      </div>
    </Dialog>)
  }
}