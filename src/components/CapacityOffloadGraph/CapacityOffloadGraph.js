import React from "react";
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";

import CustomTooltipCO from "./CustomTooltipCO/CustomTooltipCO";
import "./CapacityOffloadGraph.css";

export default class CapacityOffloadGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      maxCdnP2p: null
    };
  }

  getChartData() {
    //Transform the input data to be used by the chart
    const { data } = this.props;
    var chartData = [];
    var maxCdnP2p = 0;
    for (var i in data.cdn) {
      if (
        data.cdn[i][0] > this.props.startDate &&
        data.cdn[i][0] < this.props.endDate
      ) {
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
    }
    this.setState({ chartData, maxCdnP2p });
  }

  componentDidMount() {
    this.getChartData();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.endDate !== this.props.endDate ||
      prevProps.startDate !== this.props.startDate
    ) {
      this.getChartData();
    }
  }
  getTicks() {
    //Adds a tick per day, on the first value after midnight
    var ticks = [];
    var i = Math.min(this.props.startIndex, this.state.chartData.length - 1);
    var d = new Date(this.state.chartData[i].date);
    while (d.getHours() !== 0 && i < this.state.chartData.length) {
      d = new Date(this.state.chartData[i].date);
      i = i + 1;
    }
    const endDate = new Date(
      this.state.chartData[this.state.chartData.length - 1].date
    );
    // We suppose here timestamps are regular enough there will be a data everyday at the same time
    while (d < endDate) {
      ticks.push(d.getTime());
      d.setDate(d.getDate() + 1);
    }
    if (ticks.length === 0) {
      //This can only happen if we have only one day selected.
      //We will then set the date in the middle of the axis.
      i = Math.floor(this.state.chartData.length / 2);
      d = new Date(this.state.chartData[i].date);
      ticks.push(d.getTime());
    }
    return ticks;
  }

  render() {
    if (this.state.chartData.length === 0) {
      return (
        <div>
          There is no bandwidth data available for these dates, please pick
          another time interval
        </div>
      );
    }
    const ticks = this.getTicks();
    const maxCdn = (this.props.maxCdn / 10 ** 9).toFixed(2);
    const maxCdnP2p = this.state.maxCdnP2p
      ? this.state.maxCdnP2p.toFixed(2)
      : 0;
    return (
      <div className="capacity-offload-graph">
        <label className="graph-name-label">CAPACITY OFFLOAD</label>
        <ResponsiveContainer>
          <AreaChart data={this.state.chartData} syncId="charts">
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
            <YAxis
              tickFormatter={label => (label ? `${label}\nGbps` : label)}
            />
            <Tooltip content={<CustomTooltipCO />} />
            <Area
              type="monotone"
              dataKey="cdn"
              stackId="1"
              stroke="#C42151"
              strokeWidth={3}
              fill="#C42151"
            />
            <Area
              type="monotone"
              dataKey="p2p"
              stackId="1"
              stroke="#12A5ED"
              strokeWidth={3}
              fill="#12A5ED"
            />
            <ReferenceLine
              y={maxCdn}
              label={{
                value: `Maximum CDN contribution : ${maxCdn} Gbps`,
                position: "insideBottomLeft",
                style: { fontSize: "small" }
              }}
              stroke="#C42151"
              strokeDasharray="5 2"
            />
            <ReferenceLine
              y={maxCdnP2p}
              label={{
                value: `Maximum throughput : ${maxCdnP2p} Gbps`,
                position: "insideBottomRight",
                style: { fontSize: "small" }
              }}
              stroke="#3FCB7E"
              strokeDasharray="5 2"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
