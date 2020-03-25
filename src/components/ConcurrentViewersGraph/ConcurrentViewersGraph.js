import React from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import "./ConcurrentViewersGraph.css";

export default class ConcurrentViewersGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: null
    };
  }

  getChartData() {
    var chartData = [];
    this.props.data.audience.map(value => {
        chartData.push({
          date: value[0],
          audience: value[1]
        });
    });
    this.setState({ chartData });
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
    return (
      <div className="concurrent-viewers-graph">
        <label>CONCURRENT VIEWERS</label>
        <ResponsiveContainer>
          <LineChart data={this.state.chartData}>
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
            <Tooltip />
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
