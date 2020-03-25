import React from 'react';
import {AreaChart, XAxis, YAxis, Tooltip, Area} from 'recharts';

export default class CapacityOffloadGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartData : null
        }
    }

    getChartData() {
        const {data} = this.props;
        var chartData = [];
        for (var i in data.cdn) {
            // We suppose for now that cdn and p2p have the same timestamps in the same order
            chartData.push({
                'date': new Date(data.cdn[i][0]),
                'cdn' : data.cdn[i][1]/(10**9),
                'p2p' : data.p2p[i][1]/(10**9)
            })
        }
        this.setState({chartData})

    }

    componentDidMount() {
        this.getChartData();
    }
    render() {
        return (
            <AreaChart width={1000} height={300} data={this.state.chartData}>
                <XAxis dataKey="date"/>
                <YAxis tickFormatter={(label) => label ? `${label}\nGbps` : label}/>
                <Tooltip />
                <Area type='monotone' dataKey='cdn' stackId="1" stroke='#C42151' fill='#C42151' />
                <Area type='monotone' dataKey='p2p' stackId="1" stroke='#12A5ED' fill='#12A5ED' />
            </AreaChart>
        )
    }
}
