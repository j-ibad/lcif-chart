import React from "react";
import api from "@/util/api";
import Session from "./util/Session";
import { Navigate, useNavigate } from "react-router-dom";
import AddEntryForm from "./AddEntryForm";
import styles from './Home.module.css';
import { DateUtil } from '@/util/Helpers'


export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(!Session.getSession()){ return (<Navigate to="/login"/>)}

    return (<div>
      <NavBar />
      <EntryChart />
    </div>)
  }
}



export function NavBar() {
  let history  = useNavigate();
  function logout() {
		api.post('/auth/logout').then().catch().then(()=>{
      history('/login?logout=success');
    });
  }

  return (<nav>
    <button type="button" onClick={logout}>Logout</button>
  </nav>);
}



export class EntryChart extends React.Component {
  constructor(props) {
    super(props);
    let startDate = DateUtil.startOfMonth(DateUtil.now());
    let endDate = DateUtil.endOfMonth(startDate);
    this.state = {
      entries: [],
      startDate,
      endDate,
      selectedEntry: -1,
      loading: false,
      showEntryForm: false,
      prompt: {status: null, msg: ''}
    };


    this.handleChange = this.handleChange.bind(this);
    this.selectEntry = this.selectEntry.bind(this);
    this.onEntrySubmit = this.onEntrySubmit.bind(this);
    this.onEntryCancel = this.onEntryCancel.bind(this);
  }


  handleChange(event){
    let key = event.target.name;
    let val = event.target.value;
    this.setState({[key]: val, prompt: {msg: '', status: null}}, ()=>{
      if(key === 'startDate' || key === 'endDate'){
        this.refreshEntries();
      }
    });
  }


  refreshEntries(){
    let params = {startDate: this.state.startDate, endDate: this.state.endDate};
    this.setState({loading: true});
    api.post('/entry/getEntries', params).then((res)=>{
      if(res?.data){
        this.setState({prompt: {status: res.data.status, msg: res.data.msg || ''}, entries: res.data.entries});
      }
    }).catch((e)=>{}).then(()=>{
      this.setState({loading: false});
    })
  }


  componentDidMount(){this.refreshEntries();}

  selectEntry(i){ this.setState({selectedEntry: i, showEntryForm: true}); }

  onEntrySubmit(){
    this.refreshEntries();
    this.setState({showEntryForm: false});
  }

  onEntryCancel(){
    this.setState({showEntryForm: false});
  }


  render() {
    return (<div className={styles.EntryChart}>
      <div>
        <div>
          <label>Start:</label>
          <input type="date" name="startDate" value={this.state.startDate} onInput={this.handleChange} required/>
        </div>
        <div>
          <label>End:</label>
          <input type="date" name="endDate" value={this.state.endDate} onInput={this.handleChange} required/>
        </div>
      </div>
      {(this.state.loading && "Loading...") || ""}
      <div>
        <p style={{fontSize: '0.85em'}}> Showing entries between {this.state.startDate} and {this.state.endDate}</p>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th title="Blood Pressure">BP</th>
                <th>Pulse</th>
                <th title="Weight">Wght</th>
                <th title="Glucose">Glu</th>
                <th>Fast (H)</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {this.state.entries?.map((e, i)=>(<tr key={i} onClick={()=>{this.selectEntry(i);}}>
                <td>{e.date || '-' }</td>
                <td>{e.time || '-'}</td>
                <td>{e.bp_systolic || '-'}/{e.bp_diastolic || '-'}</td>
                <td>{e.pulse || '-'}</td>
                <td>{e.weight || '-'}</td>
                <td>{e.glucose || '-'}</td>
                <td>{e.if_hrs || '-'}</td>
                <td style={{textAlign: 'left'}}>{e.comments || ''}</td>
              </tr>))}
            </tbody>
          </table>
        </div>
        
        <div className="btnPane right" style={{position: 'fixed', right: '5vw', bottom: '1em'}}>
          <button type="button"onClick={()=>{this.selectEntry(-1);}} className="btn btnSuccess" style={{fontSize: '1em'}}>Add</button>
        </div>
      </div>

      <div>
        <AddEntryForm show={this.state.showEntryForm} entry={this.state.entries[this.state.selectedEntry] || null} onCancel={this.onEntryCancel} onSubmit={this.onEntrySubmit}/>
      </div>
    </div>)
  }
}