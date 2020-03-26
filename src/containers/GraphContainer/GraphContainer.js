import React from "react";
import axios from "axios";
import cookie from "react-cookies";

import CapacityOffloadGraph from "../../components/CapacityOffloadGraph/CapacityOffloadGraph";
import ConcurrentViewersGraph from "../../components/ConcurrentViewersGraph/ConcurrentViewersGraph";
import Efficiency from "../../components/Efficiency/Efficiency";

import "./GraphContainer.css";

export default class GraphContainer extends React.Component {
  constructor(props) {
    super(props);

    const today = Date.now();
    this.state = {
      dataLoaded: false,
      bandwidthData: null,
      bandwidthMaxCdn: null,
      audienceData: null,
      sessionToken: cookie.load("sessionToken"),
      startIndex: 0,
      endIndex: null,
      startDate: today - 1209600000,
      endDate: today
    };

    this.handleBrushUpdate = this.handleBrushUpdate.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentDidMount() {
    if (!this.dataLoaded) {
      if (!this.state.sessionToken) {
        axios
          .post("http://localhost:3000/auth", {
            identifiant: "urtoob",
            password: "ToobRU"
          })
          .then(res => {
            const sessionToken = res.data.session_token;
            cookie.save("sessionToken", sessionToken);
            this.setState({ sessionToken });
            this.getData();
          })
          .catch(err => {
            // handle error
            console.log(err);
          });
      } else {
        this.getData();
      }
    }
  }

  async getData() {
    let data = {
      bandwidth: null,
      audience: null,
      bandwidthMaxCdn: null
    };
    try {
      data.bandwidth = await axios.post("http://localhost:3000/bandwidth", {
        session_token: this.state.sessionToken,
        from: this.state.startDate,
        to: this.state.endDate
      });
      data.bandwidthMaxCdn = await axios.post(
        "http://localhost:3000/bandwidth",
        {
          session_token: this.state.sessionToken,
          from: this.state.startDate,
          to: this.state.endDate,
          aggregate: "max"
        }
      );
      data.audience = await axios.post("http://localhost:3000/audience", {
        session_token: this.state.sessionToken,
        from: this.state.startDate,
        to: this.state.endDate
      });
    } catch (err) {
      console.log(err);
    }
    this.setState({
      dataLoaded: true,
      bandwidthData: data.bandwidth.data,
      audienceData: data.audience.data,
      bandwidthMaxCdn: data.bandwidthMaxCdn.data.cdn,
      endIndex: data.audience.data.audience.length - 1
    });
  }

  componentWillUnmount() {
    if (this.state.sessionToken) {
      axios.post("http://localhost:3000/logout", {
        session_token: this.state.sessionToken
      });
    }
    cookie.remove("sessionToken");
  }

  handleBrushUpdate({ startIndex, endIndex }) {
    //Without this update function, the XAxis ticks will disappear
    //when moving the brush
    this.setState({
      startIndex,
      endIndex
    });
  }

  handleStartDateChange = startDate => {
    startDate.setHours(0,0,0);
    document.getElementById("period-choices").value = "";
    this.setState({
      startDate: startDate.getTime(),
      endDate: Math.max(this.state.endDate, startDate.getTime())
    });
  };

  handleEndDateChange = endDate => {
    endDate.setHours(23,59,59);
    document.getElementById("period-choices").value = "";
    this.setState({
      startDate: Math.min(this.state.startDate, endDate.getTime()),
      endDate: endDate.getTime()
    });
  };

  handleSelectChange = event => {
    const value = event.target.value;
    var d = new Date();
    const todayTimestamp = d.getTime();
    switch(value) {
      case "month":
        d.setMonth(d.getMonth() - 1)
        this.setState({
          startDate: d.getTime(),
          endDate: todayTimestamp
        })
        break;
      case "week":
        d.setDate(d.getDate() - 7)
        this.setState({
          startDate: d.getTime(),
          endDate: todayTimestamp
        })
        break;
      case "day":
        d.setDate(d.getDate() - 1)
        this.setState({
          startDate: d.getTime(),
          endDate: todayTimestamp
        })
        break;
      default:
        break;
    }
  }
  render() {
    const {
      dataLoaded,
      bandwidthData,
      audienceData,
      bandwidthMaxCdn,
      startIndex,
      endIndex,
      startDate,
      endDate
    } = this.state;
    return (
      dataLoaded && (
        <div>
          <div className="select-container">
            <select id="period-choices" defaultValue="month" onChange={this.handleSelectChange}>
              <option value=""></option>
              <option value="month">Last month</option>
              <option value="week">Last week</option>
              <option value="day">Last day</option>
            </select>
          </div>
          <div className="graph-container">
            <CapacityOffloadGraph
              data={bandwidthData}
              maxCdn={bandwidthMaxCdn}
              startIndex={startIndex}
              endIndex={endIndex}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <div className="graph-container">
            <ConcurrentViewersGraph
              data={audienceData}
              startIndex={startIndex}
              endIndex={endIndex}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <div className="efficiency">
            <Efficiency
              data={audienceData}
              handleBrushUpdate={this.handleBrushUpdate}
              handleStartDateChange={this.handleStartDateChange}
              handleEndDateChange={this.handleEndDateChange}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      )
    );
  }
}
