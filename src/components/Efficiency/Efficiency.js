import React from "react";
import {
  BarChart,
  Bar,
  Brush,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

import "./Efficiency.css";

export default class Efficiency extends React.Component {
  // We create an invisible graph that will allow us to change the width of the Brush component
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
      return value;
    });
    this.setState({ chartData });
  }

  componentDidMount() {
    this.getChartData();
  }

  render() {
    return (
      <div className="efficiency-container">
        <ResponsiveContainer>
          <BarChart
            data={this.state.chartData}
            syncId="charts"
            margin={{
              left: 0,
              right: 0,
              bottom: 0,
              top: 0
            }}
          >
            <Bar dataKey="measurement" maxBarSize={0} />
            <Brush stroke="#1D874D" onChange={this.props.handleUpdate}>
              <AreaChart data={this.state.chartData}>
                <Area dataKey="audience" stroke="#3FCB7E" fill="#3FCB7E" />
              </AreaChart>
            </Brush>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
