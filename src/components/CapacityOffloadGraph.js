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
                'date': data.cdn[i][0],
                'cdn' : data.cdn[i][1]/(10**9),
                'p2p' : data.p2p[i][1]/(10**9)
            })
        }
        this.setState({chartData})

    }

    componentDidMount() {
        this.getChartData();
    }

    getTicks() {
        if (!this.state.chartData) {
            return []
        }
        var ticks = [];
        var d = new Date(this.state.chartData[0].date);
        const endDate = new Date(this.state.chartData[this.state.chartData.length - 1].date)
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
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return (
            <AreaChart width={1000} height={300} data={this.state.chartData}>
                <XAxis 
                    dataKey="date" 
                    tickFormatter={(label) =>{
                        const d = new Date(label);
                        return(`${d.getDate()} ${months[d.getMonth()]}`)
                    }}
                    ticks = {ticks}
                />
                <YAxis tickFormatter={(label) => label ? `${label}\nGbps` : label}/>
                <Tooltip />
                <Area type='monotone' dataKey='cdn' stackId="1" stroke='#C42151' fill='#C42151' />
                <Area type='monotone' dataKey='p2p' stackId="1" stroke='#12A5ED' fill='#12A5ED' />
            </AreaChart>
        )
    }
}
