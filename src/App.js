import React, {Suspense} from 'react';
import {BrowserRouter as Router, Routes as Switch, Route, Link, Navigate} from "react-router-dom";

import logo from './logo.svg';
import './App.css';
import Session from './util/Session';
const SignUp = React.lazy(()=>import('@/SignUp'));
const Login = React.lazy(()=>import('@/Login'));
const Home = React.lazy(()=>import('@/Home'));

const env = (process.env.NODE_ENV || '').trim();


function App() {
  return (<div>
    <Router>
      <main>
        <Suspense fallback={null}>
          <Switch>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="*" element={<AppSwitch />} />
          </Switch>
        </Suspense>
      </main>
      <footer>
        Environment: {env}
      </footer>
    </Router>
  </div>);
}


function AppSwitch(){
  if(!Session.getSession()){ return (<Navigate to="/login"/>)}

  return (<React.Fragment>
    <Switch>
      <Route path="/home" element={<Home/>} />
      <Route path="*" element={<PageNotFoundPage />} />
    </Switch>
  </React.Fragment>)
}


function LandingPage() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function PageNotFoundPage(){
  return (<div>
    <p>Page Not Found ._.</p>
  </div>)
}

export default App;
