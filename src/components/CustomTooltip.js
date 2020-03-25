import React from 'react';
import './CustomTooltip.css';

export default class CustomTooltip extends React.Component {
    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute:'numeric' })
    }

    render() {
        const { active } = this.props;
    
        if (active) {
            const { payload, label } = this.props;
            const p2p = payload[1].value;
            const cdn = payload[0].value;
            const total = p2p + cdn;
            const spikeReduction = total ? p2p * 100 / (total) : 0;
            return (
                <div className="custom-tooltip">
                    <div>
                        <p className="date">{this.formatDate(label)}</p>
                        <p className="p2p"><label className="tooltip-label">P2P :</label>{`${p2p.toFixed(2)} Gbps`}</p>
                        <p className="cdn"><label className="tooltip-label">CDN :</label>{`${cdn.toFixed(2)} Gbps`}</p>
                    </div>
                    <div className="additional-data">
                        <p className="total">{`Total : ${total.toFixed(2)} Gbps`}</p>
                        <p className="spike-reduction">{`Spike reduction : ${spikeReduction.toFixed(1)}%`}</p>
                    </div>
                </div>
            );
        }
    
        return null;
    }
}
