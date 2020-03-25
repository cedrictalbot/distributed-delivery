import React from "react";
import axios from "axios";
import cookie from "react-cookies";

import CapacityOffloadGraph from "../CapacityOffloadGraph/CapacityOffloadGraph";
import ConcurrentViewersGraph from "../ConcurrentViewersGraph/ConcurrentViewersGraph";
import Efficiency from "../Efficiency/Efficiency";

import "./GraphContainer.css";

export default class GraphContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataLoaded: false,
      bandwidthData: null,
      bandwidthMaxCdn: null,
      audienceData: null,
      sessionToken: cookie.load("sessionToken"),
      startIndex: 0,
      endIndex: null
    };

    this.handleUpdate = this.handleUpdate.bind(this);
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
    const today = Date.now();
    let data = {
      bandwidth: null,
      audience: null,
      bandwidthMaxCdn: null
    };
    try {
      data.bandwidth = await axios.post("http://localhost:3000/bandwidth", {
        session_token: this.state.sessionToken,
        from: today - 1209600000,
        to: today
      });
      data.bandwidthMaxCdn = await axios.post(
        "http://localhost:3000/bandwidth",
        {
          session_token: this.state.sessionToken,
          from: today - 1209600000,
          to: today,
          aggregate: "max"
        }
      );
      data.audience = await axios.post("http://localhost:3000/audience", {
        session_token: this.state.sessionToken,
        from: today - 1209600000,
        to: today
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

  handleUpdate({ startIndex, endIndex }) {
    //Without this update function, the XAxis ticks will disappear
    //when moving the brush
    this.setState({
      startIndex,
      endIndex
    });
  }

  render() {
    const {
      dataLoaded,
      bandwidthData,
      audienceData,
      bandwidthMaxCdn,
      startIndex,
      endIndex
    } = this.state;
    return (
      dataLoaded && (
        <div>
          <div className="graph-container">
            <CapacityOffloadGraph
              data={bandwidthData}
              maxCdn={bandwidthMaxCdn}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          </div>
          <div className="graph-container">
            <ConcurrentViewersGraph
              data={audienceData}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          </div>
          <div className="efficiency">
            <Efficiency data={audienceData} handleUpdate={this.handleUpdate} />
          </div>
        </div>
      )
    );
  }
}
