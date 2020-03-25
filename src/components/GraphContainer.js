import React from 'react';

import CapacityOffloadGraph from './CapacityOffloadGraph';
import ConcurrentViewersGraph from './ConcurrentViewersGraph';
import TimelineGraph from './TimelineGraph';


export default class GraphContainer extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <CapacityOffloadGraph />
                </div>
                <div>
                    <ConcurrentViewersGraph />
                </div>
                <div>
                    <TimelineGraph />
                </div>
            </div>
        )
    }
}