import React from "react";
import axios from "axios";
import cookie from "react-cookies";

import CapacityOffloadGraph from "../CapacityOffloadGraph/CapacityOffloadGraph";
import ConcurrentViewersGraph from "../ConcurrentViewersGraph/ConcurrentViewersGraph";

export default class GraphContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataLoaded: false,
      bandwidthData: null,
      bandwidthMaxCdn: null,
      audienceData: null,
      sessionToken: cookie.load("sessionToken")
    };
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
      bandwidthMaxCdn: data.bandwidthMaxCdn.data.cdn
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

  render() {
    const {
      dataLoaded,
      bandwidthData,
      audienceData,
      bandwidthMaxCdn
    } = this.state;
    return (
      dataLoaded && (
        <div>
          <div>
            <CapacityOffloadGraph
              data={bandwidthData}
              maxCdn={bandwidthMaxCdn}
            />
            <ConcurrentViewersGraph data={audienceData} />
          </div>
        </div>
      )
    );
  }
}
