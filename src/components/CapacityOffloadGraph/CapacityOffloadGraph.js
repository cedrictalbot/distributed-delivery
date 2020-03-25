import React from "react";
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ReferenceLine
} from "recharts";

import CustomTooltip from "../CustomTooltip/CustomTooltip";
import "./CapacityOffloadGraph.css";

export default class CapacityOffloadGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: null,
      maxCdnP2p: null
    };
  }

  getChartData() {
    const { data } = this.props;
    var chartData = [];
    var maxCdnP2p = 0;
    for (var i in data.cdn) {
      // We suppose for now that cdn and p2p have the same timestamps in the same order
      var cdn = data.cdn[i][1] / 10 ** 9;
      var p2p = data.p2p[i][1] / 10 ** 9;
      if (cdn + p2p > maxCdnP2p) {
        maxCdnP2p = cdn + p2p;
      }
      chartData.push({
        date: data.cdn[i][0],
        cdn: cdn,
        p2p: p2p
      });
    }
    this.setState({ chartData, maxCdnP2p });
  }

  componentDidMount() {
    this.getChartData();
  }

  getTicks() {
    if (!this.state.chartData) {
      return [];
    }
    var ticks = [];
    var d = new Date(this.state.chartData[0].date);
    const endDate = new Date(
      this.state.chartData[this.state.chartData.length - 1].date
    );
    // We suppose here timestamps are regular enough there will be a data everyday at the same time
    // Another option would be to take the closest timestamp to 12AM
    while (d < endDate) {
      ticks.push(d.getTime());
      d.setDate(d.getDate() + 1);
    }
    return ticks;
  }

  render() {
    const ticks = this.getTicks();
    const maxCdn = (this.props.maxCdn / 10 ** 9).toFixed(2);
    const maxCdnP2p = this.state.maxCdnP2p
      ? this.state.maxCdnP2p.toFixed(2)
      : 0;
    return (
      <div className="capacity-offload-graph">
        <label>CAPACITY OFFLOAD</label>
        <AreaChart width={1600} height={300} data={this.state.chartData}>
          <XAxis
            dataKey="date"
            tickFormatter={label => {
              const d = new Date(label);
              return `${d.getDate()} ${d.toLocaleString("en-US", {
                month: "short"
              })}`;
            }}
            ticks={ticks}
          />
          <YAxis tickFormatter={label => (label ? `${label}\nGbps` : label)} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cdn"
            stackId="1"
            stroke="#C42151"
            fill="#C42151"
          />
          <Area
            type="monotone"
            dataKey="p2p"
            stackId="1"
            stroke="#12A5ED"
            fill="#12A5ED"
          />
          <ReferenceLine
            y={maxCdn}
            label={{
              value: `Maximum CDN contribution : ${maxCdn} Gbps`,
              position: "insideBottomLeft"
            }}
            stroke="#C42151"
            strokeDasharray="5 2"
          />
          <ReferenceLine
            y={maxCdnP2p}
            label={{
              value: `Maximum throughput : ${maxCdnP2p} Gbps`,
              position: "insideBottomRight"
            }}
            stroke="#3FCB7E"
            strokeDasharray="5 2"
          />
        </AreaChart>
      </div>
    );
  }
}