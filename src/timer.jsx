import React from 'react';
import {render} from 'react-dom';

// 0埋め
function zp(num){
  const len = 2;
	return ( Array(len).join('0') + num ).slice( -len );
};

// 時間の表示
function Time(props) {

  const min = parseInt(props.seconds * (props.interval / 1000) / 60);
  const sec = parseInt(props.seconds * (props.interval / 1000)) % 60;
  const msec = props.seconds % (1000 / props.interval);

  return (
    <div>
      {(() => {
        return (
          <p className="time">{zp(min)} : {zp(sec)}&nbsp;
            <span className="msec">{zp(msec)}</span></p>
        );
      }
      )()}
    </div>
  )
}

// Lap の表示を行う
class Lap extends React.Component {

  renderTime(seconds, index, lap_time) {
    const min = parseInt(seconds * (this.props.interval / 1000) / 60);
    const sec = parseInt(seconds * (this.props.interval / 1000)) % 60;
    const msec = seconds % (1000 / this.props.interval);

    const min_lap = parseInt(lap_time * (this.props.interval / 1000) / 60);
    const sec_lap = parseInt(lap_time * (this.props.interval / 1000)) % 60;
    const msec_lap = lap_time % (1000 / this.props.interval);


    return (
      <div key={index}>
        {(() => {
          return <p className="lap-time">
            Lap {zp(index+1)}#&nbsp;  {zp(min)} : {zp(sec)}&nbsp;
            <span className="msec">{zp(msec)}</span>&nbsp;
            ({zp(min_lap)} : {zp(sec_lap)}&nbsp;
            <span className="msec">{zp(msec_lap)}</span>)</p>
        }
        )()}
      </div>
    );
  }

  render() {
    return (
      this.props.lap.map((s, i) => 
        this.renderTime(s, i, this.props.lap_time[i])
      )
    );
  }
}

// ストップウォッチのボタン制御と変数の管理が主
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      isStart: false,
      lap: [],
      lap_time: [],
      before: 0,
      interval: 10
    };
    this.timeClick = this.timeClick.bind(this);
    this.resetLapClick = this.resetLapClick.bind(this);
  }

  // 99:99:99 までを上限としている
  tick() {
    if (this.state.seconds < 5.94 * 1000000) {
      this.setState(state => ({
        seconds: state.seconds + 1
      }));
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // 大きさ指定 ダイアログで開いたとのみ効く
  componentWillMount() {
    window.resizeTo(300, 163);
  }

  // click start or stop button 
  timeClick() {
    this.setState(state => {
      if (this.state.isStart) {
        clearInterval(this.interval);
      } else {
        this.interval = setInterval(() => this.tick(), this.state.interval);
      }
      return { isStart: !state.isStart};
    });
  }

  // 状態によってリセットか、ラップの記録かが変化
  resetLapClick() {
    /* reset */
    if (!this.state.isStart) {
      this.setState(state => ({
        seconds: 0,
        before: 0,
        lap: [],
        lap_time: [],
      }));

      window.resizeTo(300, 163);
      
    /* Lap */
    } else {
      const lapLen = this.state.lap.length;
      if (lapLen < 99) {
        this.setState(state => ({
          lap: this.state.lap.concat(this.state.seconds - this.state.before),
          lap_time: this.state.lap_time.concat(this.state.seconds),
          before: this.state.seconds
        }));

        if (lapLen > 0) {
          window.resizeBy(0, 29);
        }
      }
    }
  }

  render() {
    return (
      <div className="stopWatch">
        <Time
          seconds={this.state.seconds}
          interval={this.state.interval}
        />
        <button className="button"
          onClick={this.timeClick}>{this.state.isStart ? 'Stop': 'Start'}</button>
        <button className="button"
          onClick={this.resetLapClick}>{this.state.isStart ? 'Lap': 'Reset'}</button>
        <div>
          <Lap
            lap={this.state.lap}
            lap_time={this.state.lap_time}
            interval={this.state.interval}
          />
        </div>
      </div>
    );
  }
}

render(
  <Timer />,
  document.getElementById('timer')
);
