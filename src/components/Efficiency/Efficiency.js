import React from "react";
import {
  BarChart,
  Bar,
  Brush,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

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
    //Transform the input data to be used by the chart
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

  render() {
    return (
      <div className="main-container">
        <label>EFFICIENCY</label>
        <div className="efficiency-container">
          <DatePicker
            selected={this.props.startDate}
            onChange={this.props.handleStartDateChange}
            dateFormat="d MMMM yyyy"
          />
          <div className="brush-container">
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
                <Brush stroke="#1D874D" onChange={this.props.handleBrushUpdate}>
                  <AreaChart data={this.state.chartData}>
                    <Area dataKey="audience" stroke="#3FCB7E" fill="#3FCB7E" />
                  </AreaChart>
                </Brush>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <DatePicker
            selected={this.props.endDate}
            onChange={this.props.handleEndDateChange}
            dateFormat="d MMMM yyyy"
          />
        </div>
      </div>
    );
  }
}
