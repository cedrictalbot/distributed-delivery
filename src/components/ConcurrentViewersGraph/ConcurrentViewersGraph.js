import React from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
  Tooltip,
  Brush,
  AreaChart,
  Area
} from "recharts";

import CustomTooltipCV from "./CustomTooltipCV/CustomTooltipCV";
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
    var i = 0;
    var d = new Date(this.state.chartData[i].date);
    while (d.getHours() != 0 && i < this.state.chartData.length) {
      i = i + 1;
      d = new Date(this.state.chartData[i].date);
    }
    const endDate = new Date(
      this.state.chartData[this.state.chartData.length - 1].date
    );
    // We suppose here timestamps are regular enough there will be a data everyday at the same time
    while (d < endDate) {
      ticks.push(d.getTime());
      d.setDate(d.getDate() + 1);
    }
    return ticks;
  }

  render() {
    const ticks = this.getTicks();
    if (!this.state.chartData) {
      return null;
    }
    return (
      <div className="concurrent-viewers-graph">
        <label>CONCURRENT VIEWERS</label>
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
            <Brush>
              <AreaChart data={this.state.chartData}>
                <Area dataKey="audience" stroke="#3FCB7E" fill="#3FCB7E" />
              </AreaChart>
            </Brush>
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
