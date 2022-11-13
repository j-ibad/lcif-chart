import React, {Suspense} from 'react';
import {BrowserRouter as Router, Routes as Switch, Route, Link, Navigate, useParams} from "react-router-dom";

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
            <Route path="/home" element={<Home/>} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/:mode" element={<LandingPage />} />
            <Route path="*" element={<PageNotFoundPage />} />
          </Switch>
        </Suspense>
      </main>
      <footer>
        {/* TODO */}
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
  let {mode} = useParams();
  let bodyElement;
  switch(mode || ''){
    case "":
      bodyElement = <div className="LandingPageBtnPane">
        <Link to="/login" className='btn login'>Login</Link>
        <Link to="/register" className='btn signup'>Sign Up</Link>
      </div>;
      break;
    case "register": bodyElement = <SignUp />; break;
    case "login": bodyElement = <Login />; break;
    default:
      return <PageNotFoundPage />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>LCIF Chart</h1>
        {bodyElement}
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
