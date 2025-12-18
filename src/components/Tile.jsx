import React from "react";
import Property from "./Property";

export default function Tile({
  name,
  percentageValue: initialPercentage = 0,
  properties = [],
  children,
  onPercentageChange,
  onPropertiesChange,
}) {
  const defaultProperties = [
    { label: "Trend", value: "+10%" },
    { label: "At AOI/Rejected", value: "+10%" },
    { label: "Touching EMA", value: "+5%" },
    { label: "Round Psychological Level", value: "+5%" },
    { label: "Rejection From Previous Structure", value: "+10%" },
    { label: "Candlestick Rejection From AOI", value: "+10%" },
    { label: "Break & Retest/Head & Shoulders Pattern", value: "+10%" },
  ];

  const propsToRender =
    properties && properties.length ? properties : defaultProperties;

  // track checked state per property index
  const [checkedMap, setCheckedMap] = React.useState(() =>
    propsToRender.map((p) => !!p.checked)
  );
  const [computedTotal, setComputedTotal] = React.useState(() =>
    initialPercentage === null || initialPercentage === undefined
      ? null
      : Number(initialPercentage || 0)
  );

  // helper to parse value like "+12%" or "-3%" into number 12 or -3
  const parsePercent = (str) => {
    if (typeof str === "number") return Number(str);
    const m = String(str).match(/([+-]?\d+(?:\.\d+)?)/);
    return m ? Number(m[1]) : 0;
  };

  const recompute = (nextCheckedMap) => {
    // For the Stop Loss tile we don't compute a percentage total
    if (String(name).trim().toLowerCase() === "stop loss & take profit") {
      setComputedTotal(null);
      onPercentageChange && onPercentageChange(null);
      return;
    }

    const total = nextCheckedMap.reduce((sum, checked, idx) => {
      if (!checked) return sum;
      return sum + parsePercent(propsToRender[idx].value);
    }, 0);
    setComputedTotal(total);
    onPercentageChange && onPercentageChange(total);
  };

  const handleToggle = (index, next) => {
    setCheckedMap((prev) => {
      const copy = prev.slice();
      copy[index] = next;
      recompute(copy);

      // inform parent about updated properties (include checked flags)
      if (onPropertiesChange) {
        const updated = propsToRender.map((p, i) => ({
          ...p,
          checked: !!copy[i],
        }));
        try {
          onPropertiesChange(updated);
        } catch (e) {
          // ignore parent errors
        }
      }

      return copy;
    });
  };

  // initialize computedTotal from any initial checked map (all false by default)
  React.useEffect(() => {
    recompute(checkedMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tile">
      <div className="tile-head">
        <div className="tile-name">{name}</div>
        <div className="tile-value">
          {computedTotal !== null && computedTotal !== undefined
            ? `${computedTotal}%`
            : ""}
        </div>
      </div>

      <div className="tile-body">
        {propsToRender.map((p, i) => (
          <Property
            key={i}
            label={p.label}
            value={p.value}
            checked={checkedMap[i]}
            onChange={(next) => handleToggle(i, next)}
          />
        ))}

        {/* allow consumers to pass additional custom children if needed */}
        {children}
      </div>
    </div>
  );
}
