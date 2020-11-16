import React from 'react';
import {Viewer} from 'resium';


export interface MapProps {
  allowFullScreen?: boolean;
  showMousePosition?: boolean;
  // projection?: Proj;
  center?: [number, number];
  zoom?: number;
}

export const Map: React.FC<MapProps> = (props) => {
	return(<Viewer/>);
};
