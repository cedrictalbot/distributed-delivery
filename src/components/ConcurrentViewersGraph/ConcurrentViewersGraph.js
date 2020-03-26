import React from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import CustomTooltipCV from "./CustomTooltipCV/CustomTooltipCV";
import "./ConcurrentViewersGraph.css";

export default class ConcurrentViewersGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: []
    };
  }

  getChartData() {
    var chartData = [];
    this.props.data.audience.map(value => {
      if (value[0] > this.props.startDate && value[0] < this.props.endDate) {
        chartData.push({
          date: value[0],
          audience: value[1]
        });
      }
      return value;
    });
    this.setState({ chartData });
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
    var ticks = [];
    var i = this.props.startIndex;
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
          There is no audience data available for these dates, please pick
          another time interval
        </div>
      );
    }
    const ticks = this.getTicks();
    return (
      <div className="concurrent-viewers-graph">
        <label className="graph-name-label">CONCURRENT VIEWERS</label>
        <ResponsiveContainer>
          <LineChart data={this.state.chartData} syncId="charts">
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
            <YAxis />
            <Tooltip content={<CustomTooltipCV />} />
            <Line
              type="monotone"
              dataKey="audience"
              stroke="#DDA02A"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
