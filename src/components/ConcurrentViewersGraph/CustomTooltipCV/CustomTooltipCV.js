import React from "react";
import "./CustomTooltipCV.css";

export default class CustomTooltipCV extends React.Component {
  formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
  }

  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;

      return (
        <div className="custom-tooltip">
          <p className="date">{this.formatDate(label)}</p>
          <p className="viewers">
            <label className="tooltip-label">Viewers :</label>
            {payload[0].value}
          </p>
        </div>
      );
    }

    return null;
  }
}
