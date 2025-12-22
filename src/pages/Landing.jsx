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
      name: "1D (Daily Context - Macro Bias)",
      percentageValue: 0,
      properties: [
        { label: "Trend", value: "+10%" },
        { label: "EMA Alignment", value: "+10%" },
        { label: "Supply/Demand zone", value: "+10%" },
      ],
    },
    {
      name: "4H (intermediate Context- Confirmatioon)",
      percentageValue: 0,
      properties: [
        { label: "Trend", value: "+10%" },
        { label: "Supply/Demand zone", value: "+10%" },
        { label: "BOS(Break Of Structure)", value: "+10%" },
      ],
    },
    {
      name: "1H (Execution prep - ICC Core)",
      percentageValue: 0,
      properties: [
        { label: "Trend", value: "+5%" },
        { label: "EMA Alignment", value: "+5%" },
        { label: "Round Psychological level", value: "+5%" },
        { label: "Correction/Retest", value: "+10%" },
        { label: "Order Block Filled", value: "10%" },
      ],
    },
    {
      name: "ENTRY SIGNAL",
      percentageValue: 0,
      properties: [
        { label: "SOS(Shift Of Structure)", value: "+5%" },
        { label: "EMA filter (15m,30m,1H)", value: "+5%" },
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
