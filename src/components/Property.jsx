import React, { useState } from "react";

function Property({ label, value, checked: checkedProp, onChange }) {
  // controlled when checkedProp is provided; otherwise local state
  const [internalChecked, setInternalChecked] = useState(false);
  const checked =
    typeof checkedProp === "boolean" ? checkedProp : internalChecked;

  return (
    <div className="property">
      <div className="property-left">
        <label className="property-label">{label}</label>
      </div>

      <div className="property-right">
        <div className={`property-value ${checked ? "on" : "off"}`}>
          {value}
        </div>
        <button
          aria-pressed={checked}
          className={`property-toggle ${checked ? "on" : "off"}`}
          onClick={() => {
            if (typeof checkedProp === "boolean") {
              // controlled: notify parent
              onChange && onChange(!checked);
            } else {
              // uncontrolled: update local state and notify parent
              setInternalChecked((s) => {
                const next = !s;
                onChange && onChange(next);
                return next;
              });
            }
          }}
          title={checked ? "On" : "Off"}
        >
          {/* track */}
          <span className="toggle-track-el" aria-hidden>
            {/* knob */}
            <span className={`toggle-knob-el ${checked ? "on" : "off"}`} />
          </span>
        </button>
      </div>
    </div>
  );
}

export default Property;
