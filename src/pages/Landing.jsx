import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Tile from "../components/Tile";
import Summary from "../components/Summary";

export default function Landing() {
  // state to hold tile data
  const [tiles, setTiles] = React.useState([
    {
      name: "WEEKLY",
      percentageValue: 0,
      properties: [
        { label: "Trend", value: "+10%" },
        { label: "At AOI/Rejected", value: "+10%" },
        { label: "Touching EMA", value: "+5%" },
        { label: "Round Psychological Level", value: "+5%" },
        { label: "Rejection From Previous Structure", value: "+10%" },
        { label: "Candlestick Rejection From AOI", value: "+10%" },
        { label: "Break & Retest/Head & Shoulders Pattern", value: "+10%" },
      ],
    },
    {
      name: "DAILY",
      percentageValue: 0,
      properties: [
        { label: "Trend", value: "+10%" },
        { label: "At AOI/Rejected", value: "+10%" },
        { label: "Touching EMA", value: "+5%" },
        { label: "Round Psychological Level", value: "+5%" },
        { label: "Rejection From Previous Structure", value: "+10%" },
        { label: "Candlestick Rejection From AOI", value: "+10%" },
        { label: "Break & Retest/Head & Shoulders Pattern", value: "+10%" },
      ],
    },
    {
      name: "4H",
      percentageValue: 0,
      properties: [
        { label: "Trend", value: "+10%" },
        { label: "At AOI/Rejected", value: "+10%" },
        { label: "Touching EMA", value: "+5%" },
        { label: "Round Psychological Level", value: "+5%" },
        { label: "Rejection From Previous Structure", value: "+10%" },
        { label: "Candlestick Rejection From AOI", value: "+10%" },
        { label: "Break & Retest/Head & Shoulders Pattern", value: "+10%" },
      ],
    },
    {
      name: "2H, 1H, 30m",
      percentageValue: 0,
      properties: [
        { label: "Trend", value: "+10%" },
        { label: "Touching EMA", value: "+5%" },
        { label: "Break & Retest/Head & Shoulders Pattern", value: "+10%" },
      ],
    },
    {
      name: "ENTRY SIGNAL",
      percentageValue: 0,
      properties: [
        { label: "SOS", value: "+10%" },
        { label: "Engulfing Candlestick(30m,1H,2H,4H)", value: "+10%" },
      ],
    },
    {
      name: "Stop Loss & Take Profit",
      percentageValue: null,
      properties: [
        { label: "Stop Loss", value: "" },
        { label: "Take Profit", value: "" },
      ],
    },
  ]);

  // handler to update tile percentage value
  const handleTileChange = (index, newPercentage) => {
    setTiles((prev) => {
      const copy = prev.slice();
      copy[index] = { ...copy[index], percentageValue: newPercentage };
      return copy;
    });
  };

  // handler to update tile properties (checked flags)
  const handlePropertiesChange = (index, updatedProperties) => {
    setTiles((prev) => {
      const copy = prev.slice();
      copy[index] = { ...copy[index], properties: updatedProperties };
      return copy;
    });
  };

  return (
    <div className="landing-container">
      <Header />

      <div className="brand">
        <h2>Trade Checklist</h2>
        <p>Evaluate your trades across multiple timeframes</p>
      </div>

      <div className="tile-container">
        {tiles.map((t, i) => (
          <Tile
            key={i}
            name={t.name}
            percentageValue={t.percentageValue}
            properties={t.properties}
            onPercentageChange={(newTotal) => handleTileChange(i, newTotal)}
            onPropertiesChange={(updated) => handlePropertiesChange(i, updated)}
          />
        ))}
      </div>

      {/* Summary shows per-tile percentages and overall average */}
      <div style={{ margin: "0 8% 16px" }}>
        <Summary tiles={tiles} />
      </div>

      <Footer />
    </div>
  );
}
