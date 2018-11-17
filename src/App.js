import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp, faAngleDoubleDown, faBed, faBrain } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment'

const SetTimer = ({ type, icon, value, handleClick }) => {
    return(
        <div className="section">
            <div className="card center-align">
                <span id="`${type}`-label" className="card-title">{type==="session" ? "Session" : "Break"} Length</span>
                    <div className="wrapper">  
                        <span id="break-length" className="length">{value}</span>
                    </div>
                <div className="card-content">
                    <div className="row">
                        <FontAwesomeIcon id="`${type}`-decrement" className="green-btn col s4 hoverable offset-s2" icon={ faAngleDoubleDown } size="3x" onClick={() => handleClick(false, `${type}Value`)} />
                        <FontAwesomeIcon id="`${type}`-increment" className="red-btn col s4 hoverable" icon={ faAngleDoubleUp } size="3x" onClick={() => handleClick(true, `${type}Value`)} /> 
                    </div>       
                    <FontAwesomeIcon icon={ icon } size="3x" />
                </div>
            </div>
        </div>
    )
}

const Timer = ({ icon, time, running, handleReset, handleStartStop }) => {
    return(
        <div class="container center">
            <div className="row">
                <FontAwesomeIcon icon={ icon } size="6x" />
            </div>
            <div className="row">
                <span id="time-left">{ time }</span>
            </div>
            <button id="start_stop" onClick={() => handleStartStop()}>{ running }</button>
            <button id="reset" onClick={() => handleReset()}>Reset</button>
        </div>
    )
}

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            breakValue: 5,
            sessionValue: 25,
            timerMode: "session",
            time: 25 * 60 * 1000,
            running: false,
            started: false 
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.time===0 && prevState.timerMode==="session") {
            this.setState({
                timerMode: "break",
                time: this.state.breakValue * 60 * 1000
            })
            this.audio.src="http://www.africanvulture.com/uploads/2/9/2/1/29211623/5_sec_crowd_cheer-mike_koenig-1562033255.mp3"
            this.audio.play()
        }
        if (prevState.time===0 && prevState.timerMode==="break") {
            this.setState({
                timerMode: "session",
                time: this.state.sessionValue * 60 * 1000 
            })
            this.audio.src="http://sfxcontent.s3.amazonaws.com/soundfx/BoxingBell.mp3"
            this.audio.play()
        }
    }
    handleSetTimer = (increment, type) => {
        if (this.state[type]===60 && increment) return;
        if (this.state[type]===1 && !increment) return;
        this.setState({
            [type]: this.state[type] + (increment ? 1 : -1)
        })
        if (this.state.time === 3600000 && increment && this.state.started === false) return;
        if (this.state.time === 60000 && !increment && this.state.started === false) return;
        if (this.state[type]===this.state.sessionValue && this.state.started === false){
            this.setState({
                time: this.state.time + (increment ? 60000 : -60000)
            })
        }
    }

    handleReset = () => {
        this.setState({
            breakValue: 5,
            sessionValue: 25,
            time: 25 * 60 * 1000,
            running: false,
            started: false
        })
        clearInterval(this.runTimer)
        this.audio.pause()
        
    }

    handleStartStop = () => {
        this.setState({
            running: !this.state.running
        })
        if (this.state.running){
            clearInterval(this.runTimer)
        }
        else{
        this.runTimer = setInterval(
                () => this.setState({
                    time: this.state.time - 1000
                }), 1000)
        this.setState({
            started: true
        })
            }
        }
    
  render() {
    return (
      <div className="container outer-container">
       <h1 className="center">Productivity Timer</h1>
        <div className="wrapper content-wrap">
          <div className="row">
            <div className="offset-m1 col s12 m5">
              <SetTimer type='break' icon={ faBed } value={this.state.breakValue} handleClick={this.handleSetTimer} />
            </div>
            <div className="col s12 m5">
              <SetTimer type='session' icon={ faBrain } value={this.state.sessionValue} handleClick={this.handleSetTimer} />
            </div>
          </div>
          <div>
              <Timer icon={this.state.timerMode === "session" ? faBrain : faBed} 
              time={this.state.time < 3600000 ? moment(this.state.time).format('mm:ss') : "60:00"} 
              running={this.state.running===true ? "Pause" : "Start"}
              handleReset={this.handleReset}
              handleStartStop={this.handleStartStop}
              />
          </div>
        </div>
        <audio id="beep" src="" ref={ref => this.audio = ref}/>
      </div>
    );
  }
}

export default App;
