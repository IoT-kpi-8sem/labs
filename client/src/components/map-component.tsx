'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { AgentMessageDto } from '@/lib/types';

// Fix Leaflet marker icon issue in Next.js
const defaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const getCarIcon = (color: string) =>
  L.icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg fill="${color}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 31.445 31.445" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M7.592,16.86c-1.77,0-3.203,1.434-3.203,3.204s1.434,3.204,3.203,3.204c1.768,0,3.203-1.434,3.203-3.204 S9.36,16.86,7.592,16.86z M7.592,21.032c-0.532,0-0.968-0.434-0.968-0.967s0.436-0.967,0.968-0.967 c0.531,0,0.966,0.434,0.966,0.967S8.124,21.032,7.592,21.032z"></path> <path d="M30.915,17.439l-0.524-4.262c-0.103-0.818-0.818-1.418-1.643-1.373L27.6,11.868l-3.564-3.211 c-0.344-0.309-0.787-0.479-1.249-0.479l-7.241-0.001c-1.625,0-3.201,0.555-4.468,1.573l-4.04,3.246l-5.433,1.358 c-0.698,0.174-1.188,0.802-1.188,1.521v1.566C0.187,17.44,0,17.626,0,17.856v2.071c0,0.295,0.239,0.534,0.534,0.534h3.067 c-0.013-0.133-0.04-0.26-0.04-0.396c0-2.227,1.804-4.029,4.03-4.029s4.029,1.802,4.029,4.029c0,0.137-0.028,0.264-0.041,0.396 h8.493c-0.012-0.133-0.039-0.26-0.039-0.396c0-2.227,1.804-4.029,4.029-4.029c2.227,0,4.028,1.802,4.028,4.029 c0,0.137-0.026,0.264-0.04,0.396h2.861c0.295,0,0.533-0.239,0.533-0.534v-1.953C31.449,17.68,31.21,17.439,30.915,17.439z M20.168,12.202l-10.102,0.511L12,11.158c1.051-0.845,2.357-1.305,3.706-1.305h4.462V12.202z M21.846,12.117V9.854h0.657 c0.228,0,0.447,0.084,0.616,0.237l2.062,1.856L21.846,12.117z"></path> <path d="M24.064,16.86c-1.77,0-3.203,1.434-3.203,3.204s1.434,3.204,3.203,3.204c1.769,0,3.203-1.434,3.203-3.204 S25.833,16.86,24.064,16.86z M24.064,21.032c-0.533,0-0.967-0.434-0.967-0.967s0.434-0.967,0.967-0.967 c0.531,0,0.967,0.434,0.967,0.967S24.596,21.032,24.064,21.032z"></path> </g> </g> </g></svg>
    `)}`,
    iconSize: [24, 24],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

const getRoadStateIcon = (roadState: string) => {
  const colors = {
    Good: 'green',
    Bad: 'red',
    Normal: 'yellow',
    Ok: 'blue',
  };

  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${
      colors[roadState as keyof typeof colors] || 'gray'
    }; width: 8px; height: 8px; border-radius: 50%;"></div>`,
  });
};

const getClientColor = (clientId: string) => {
  const colors = [
    'red',
    'blue',
    'green',
    'purple',
    'orange',
    'yellow',
    'cyan',
    'magenta',
    'lime',
    'pink',
  ];

  const charCodeSum = clientId
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return colors[charCodeSum % colors.length];
};

L.Marker.prototype.options.icon = defaultIcon;

interface MapComponentProps {
  actualClientsData: AgentMessageDto[];
  allMessages: AgentMessageDto[];
}

export default function MapComponent({
  actualClientsData,
  allMessages,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(2);

  // Update map center when new messages arrive
  useEffect(() => {
    if (actualClientsData.length > 0) {
      const latestMessage = actualClientsData.at(-1)!;
      setCenter([latestMessage.gps.Lat, latestMessage.gps.Lng]);
      setZoom(13); // Zoom in when we have data

      if (mapRef.current) {
        mapRef.current.flyTo(
          [latestMessage.gps.Lat, latestMessage.gps.Lng],
          13,
          {
            duration: 2,
          }
        );
      }
    }
  }, [actualClientsData]);

  const clientGroups = actualClientsData.reduce((groups, message) => {
    if (!groups[message.clientId]) {
      groups[message.clientId] = [];
    }
    groups[message.clientId].push(message);
    return groups;
  }, {} as Record<string, AgentMessageDto[]>);

  return (
    <div className='h-[50vh] w-full rounded-lg overflow-hidden'>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {allMessages.map((message, index) => {
          if (!message.roadState) return null;

          return (
            <Marker
              key={index}
              position={[message.gps.Lat, message.gps.Lng]}
              icon={getRoadStateIcon(message.roadState)}
            />
          );
        })}
        {Object.entries(clientGroups).map(([clientId, clientMessages]) => {
          const positions = clientMessages.map(
            (msg) => [msg.gps.Lat, msg.gps.Lng] as [number, number]
          );

          const clientColor = getClientColor(clientId);

          return clientMessages.map((message) => (
            <div key={`${message.gps.Lat}-${message.gps.Lng}`}>
              <Marker
                position={[message.gps.Lat, message.gps.Lng]}
                icon={getCarIcon(clientColor)}
              >
                <Popup>
                  <div>
                    <h3 className='font-bold'>Client: {clientId}</h3>
                    <p>Lat: {message.gps.Lat.toFixed(6)}</p>
                    <p>Lng: {message.gps.Lng.toFixed(6)}</p>
                    <p>Time: {new Date(message.time).toLocaleString()}</p>
                    <p>
                      Accelerometer: x=
                      {message.accelerometer.X.toFixed(2)}, y=
                      {message.accelerometer.Y.toFixed(2)}, z=
                      {message.accelerometer.Z.toFixed(2)}
                    </p>
                  </div>
                </Popup>
              </Marker>

              {/* Path line */}
              {positions.length > 1 && (
                <Polyline
                  positions={positions}
                  color='#3B82F6'
                  weight={3}
                  opacity={0.7}
                />
              )}
            </div>
          ));
        })}
      </MapContainer>
    </div>
  );
}
