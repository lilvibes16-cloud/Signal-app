import React, { useId } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

export default function Trend({ values, large = false }) {
  const gradientId = `trend-${useId().replace(/:/g, "")}`;
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <div
      className={large ? "trend large" : "trend"}
      role="img"
      aria-label="Illustrative demo momentum chart; synthetic values, not measured interest"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={values.map((value, i) => ({ day: i + 1, value }))}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff334d" stopOpacity=".4" />
              <stop offset="100%" stopColor="#ff334d" stopOpacity="0" />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#ff4056"
            strokeWidth={large ? 3 : 2}
            fill={`url(#${gradientId})`}
            isAnimationActive={!reducedMotion}
            animationDuration={650}
          />
          {large && (
            <Tooltip
              labelFormatter={(day) => `Demo day ${day}`}
              formatter={(value) => [value, "Synthetic index"]}
              contentStyle={{
                background: "#171922",
                border: "1px solid #35313a",
                borderRadius: 12,
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
