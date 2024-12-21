import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { Eye, EyeOff } from 'lucide-react';

const TabSwitchTimeline = ({ violences, startDate, endDate }) => {
  // Convert timestamps into data points for the scatter plot
  const transformData = () => {
    return violences.cursorViolence.tabSwitchTimestamps.map((event) => ({
      timestamp: new Date(event.timestamp).getTime(),
      value: event.tab === 'hidden' ? 0 : 1,
      state: event.tab,
      color: event.tab === 'hidden' ? '#ef4444' : '#22c55e',
    }));
  };

  const data = transformData();
  const examStart = new Date(startDate).getTime();
  const examEnd = new Date(endDate).getTime();

  const formatXAxis = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const { timestamp, state } = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="text-sm">{new Date(timestamp).toLocaleTimeString()}</p>
        <p className="text-sm font-semibold flex items-center gap-1">
          {state === 'hidden' ? (
            <>Tab Hidden <EyeOff className="w-4 h-4" /></>
          ) : (
            <>Tab Visible <Eye className="w-4 h-4" /></>
          )}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Tab Switch Timeline</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-green-500" /> Visible
          </span>
          <span className="flex items-center gap-1">
            <EyeOff className="w-4 h-4 text-red-500" /> Hidden
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <ScatterChart width={800} height={200} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis
            type="number"
            dataKey="timestamp"
            domain={[examStart, examEnd]}
            tickFormatter={formatXAxis}
            name="Time"
          />
          <YAxis
            type="number"
            domain={[-0.5, 1.5]}
            ticks={[0, 1]}
            tickFormatter={(value) => (value === 0 ? 'Hidden' : 'Visible')}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0.5} stroke="#ddd" strokeDasharray="3 3" />
          <Scatter
  data={data}
  name="Tab Switch"
  fill="#ff0000"
  shape={({ cx, cy, payload }) => {
    // Set the Y-position for "Visible" and "Hidden" states
    const adjustedCy = payload.state === 'hidden' ? 0.7 : 0.3; // Hidden at the bottom, Visible at the top

    return (
      <g>
        <circle cx={cx} cy={adjustedCy * 180} r={6} fill={payload.color} /> {/* Adjust the cy value for visibility */}
        {/* <text x={cx + 10} y={adjustedCy * 180 + 20} fill="#333" fontSize={10}>
          {payload.state}
        </text> */}
      </g>
    );
  }}
/>

        </ScatterChart>
      </div>

      <div className="mt-4 border-t pt-4">
        <h3 className="font-semibold mb-2">Summary:</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li className="flex items-center gap-2">• Total tab switches: {violences.cursorViolence.cursorCount}</li>
          <li className="flex items-center gap-2">• First switch: {new Date(data[0]?.timestamp).toLocaleTimeString()}</li>
          <li className="flex items-center gap-2">• Last switch: {new Date(data[data.length - 1]?.timestamp).toLocaleTimeString()}</li>
        </ul>
      </div>
    </div>
  );
};

export default TabSwitchTimeline;
