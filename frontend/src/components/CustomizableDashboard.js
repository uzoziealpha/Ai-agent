import React from 'react';
import { BsGear } from 'react-icons/bs';
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

const CustomizableDashboards = () => {
  return (
    <div>
      <h3><BsGear /> Customizable Dashboards</h3>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: [{ i: '1', x: 0, y: 0, w: 2, h: 2 }] }}
        breakpoints={{ lg: 1200 }}
        cols={{ lg: 12 }}
      >
        <div key="1">Performance Chart</div>
        <div key="2">Sentiment Chart</div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default CustomizableDashboards;