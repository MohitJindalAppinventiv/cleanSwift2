// // // import React from 'react'
// // // import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

// // // const containerStyle = {
// // //   width: '400px',
// // //   height: '400px',
// // // }

// // // const center = {
// // //   lat: -3.745,
// // //   lng: -38.523,
// // // }
// // // const apikey=import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// // // console.log(apikey);

// // // function MyComponent() {
// // //   const { isLoaded } = useJsApiLoader({
// // //     id: 'google-map-script',
// // //     googleMapsApiKey: apikey,
// // //   })

// // //   const [map, setMap] = React.useState(null)

// // //   const onLoad = React.useCallback(function callback(map) {
// // //     // This is just an example of getting and using the map instance!!! don't just blindly copy!
// // //     const bounds = new window.google.maps.LatLngBounds(center)
// // //     map.fitBounds(bounds)

// // //     setMap(map)
// // //   }, [])

// // //   const onUnmount = React.useCallback(function callback(map) {
// // //     setMap(null)
// // //   }, [])

// // //   return isLoaded ? (
// // //     <GoogleMap
// // //       mapContainerStyle={containerStyle}
// // //       center={center}
// // //       zoom={10}
// // //       onLoad={onLoad}
// // //       onUnmount={onUnmount}
// // //     >
// // //       {/* Child components, such as markers, info windows, etc. */}
// // //       <></>
// // //     </GoogleMap>
// // //   ) : (
// // //     <></>
// // //   )
// // // }

// // // export default React.memo(MyComponent)



// // import React, { useRef, useEffect, useState } from 'react';
// // import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';

// // const containerStyle = {
// //   width: '100%',
// //   height: '500px', // Adjusted for better visibility
// // };

// // const center = {
// //   lat: -34.397,
// //   lng: 150.644,
// // };

// // const apikey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// // const libraries = ['places'];

// // function MyComponent() {
// //   const { isLoaded } = useJsApiLoader({
// //     id: 'google-map-script',
// //     googleMapsApiKey: apikey,
// //     libraries: libraries,
// //   });

// //   const [map, setMap] = useState(null);
// //   const [searchBox, setSearchBox] = useState(null);
// //   const [marker, setMarker] = useState(null);
// //   const searchBoxRef = useRef(null);

// //   const onLoadMap = React.useCallback(function callback(map) {
// //     setMap(map);
// //   }, []);

// //   const onUnmountMap = React.useCallback(function callback(map) {
// //     setMap(null);
// //   }, []);

// //   const onLoadSearchBox = (ref) => {
// //     setSearchBox(ref);
// //   };

// //   const onPlacesChanged = () => {
// //     if (searchBox) {
// //       const places = searchBox.getPlaces();
// //       if (places.length === 0) {
// //         return;
// //       }
// //       const place = places[0];
// //       const newCenter = {
// //         lat: place.geometry.location.lat(),
// //         lng: place.geometry.location.lng(),
// //       };

// //       // Center the map on the selected location
// //       map.panTo(newCenter);

// //       // Create or update a marker
// //       if (marker) {
// //         marker.setMap(null); // Remove previous marker
// //       }
// //       const newMarker = new window.google.maps.Marker({
// //         position: newCenter,
// //         map: map,
// //         title: place.name,
// //       });
// //       setMarker(newMarker);
// //     }
// //   };

// //   useEffect(() => {
// //     if (isLoaded && map) {
// //       // You can add additional logic here, for example,
// //       // to automatically set a marker on the initial center.
// //     }
// //   }, [isLoaded, map]);

// //   return isLoaded ? (
// //     <div style={{ position: 'relative', width: '100%', height: '500px' }}>
// //       <StandaloneSearchBox
// //         onLoad={onLoadSearchBox}
// //         onPlacesChanged={onPlacesChanged}
// //       >
// //         <input
// //           type="text"
// //           placeholder="Search for a location..."
// //           style={{
// //             boxSizing: `border-box`,
// //             border: `1px solid transparent`,
// //             width: `240px`,
// //             height: `32px`,
// //             padding: `0 12px`,
// //             borderRadius: `3px`,
// //             boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
// //             fontSize: `14px`,
// //             outline: `none`,
// //             textOverflow: `ellipses`,
// //             position: 'absolute',
// //             top: '10px',
// //             left: '50%',
// //             transform: 'translateX(-50%)',
// //             zIndex: '10',
// //           }}
// //           ref={searchBoxRef}
// //         />
// //       </StandaloneSearchBox>
// //       <GoogleMap
// //         mapContainerStyle={containerStyle}
// //         center={center}
// //         zoom={10}
// //         onLoad={onLoadMap}
// //         onUnmount={onUnmountMap}
// //       >
// //         {/* You could also render markers as child components here */}
// //         {/* Example: <Marker position={markerPosition} /> */}
// //       </GoogleMap>
// //     </div>
// //   ) : (
// //     <div style={containerStyle}>Loading Map...</div>
// //   );
// // }

// // export default React.memo(MyComponent);

// import React, { useState, useCallback } from 'react'
// import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

// const containerStyle = {
//   width: '100%',
//   height: '500px',
// }

// const center = {
//   lat: -3.745,
//   lng: -38.523,
// }

// const apikey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
// console.log(apikey)

// function MyComponent() {
//   const { isLoaded } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: apikey,
//   })

//   const [map, setMap] = useState(null)
//   const [markerPosition, setMarkerPosition] = useState(center) // State to hold the marker's position

//   const onLoad = useCallback(function callback(map) {
//     // Optional: fit the map bounds to the center
//     const bounds = new window.google.maps.LatLngBounds(center)
//     map.fitBounds(bounds)
//     setMap(map)
//   }, [])

//   const onUnmount = useCallback(function callback() {
//     setMap(null)
//   }, [])

//   // Function to handle map clicks
//   const handleMapClick = useCallback((event) => {
//     const newPosition = {
//       lat: event.latLng.lat(),
//       lng: event.latLng.lng(),
//     }
//     setMarkerPosition(newPosition) // Update the marker's position
//     console.log('New marker position:', newPosition)
//   }, [])

//   return isLoaded ? (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={center}
//       zoom={10}
//       onLoad={onLoad}
//       onUnmount={onUnmount}
//       onClick={handleMapClick} // Add the click handler to the map
//     >
//       {/* The Marker component. Its position is controlled by the markerPosition state. */}
//       <Marker position={markerPosition} />
//     </GoogleMap>
//   ) : (
//     <div style={containerStyle}>Loading Map...</div>
//   )
// }

// export default React.memo(MyComponent)


// import React, { useState, useCallback } from 'react';
// import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';

// const containerStyle = {
//   width: '100%',
//   height: '500px',
// };

// const center = {
//   lat: -34.397, // Example center
//   lng: 150.644,
// };

// const apikey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// const libraries = ['places']; // Add the places library for search functionality

// function MyComponent() {
//   const { isLoaded } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: apikey,
//     libraries: libraries, // Pass the libraries array here
//   });

//   const [map, setMap] = useState(null);
//   const [markerPosition, setMarkerPosition] = useState(center);
//   const [searchBox, setSearchBox] = useState(null);

//   const onLoadMap = useCallback(function callback(map) {
//     const bounds = new window.google.maps.LatLngBounds(center);
//     map.fitBounds(bounds);
//     setMap(map);
//   }, []);

//   const onUnmountMap = useCallback(function callback() {
//     setMap(null);
//   }, []);

//   const handleMapClick = useCallback((event) => {
//     const newPosition = {
//       lat: event.latLng.lat(),
//       lng: event.latLng.lng(),
//     };
//     setMarkerPosition(newPosition);
//     console.log('New marker position from click:', newPosition);
//   }, []);

//   const onLoadSearchBox = (ref) => {
//     setSearchBox(ref);
//   };

//   const onPlacesChanged = () => {
//     if (searchBox) {
//       const places = searchBox.getPlaces();
//       if (places.length === 0) {
//         return;
//       }
//       const place = places[0];
//       const newCenter = {
//         lat: place.geometry.location.lat(),
//         lng: place.geometry.location.lng(),
//       };

//       // Update the map center and the marker position
//       map.panTo(newCenter);
//       setMarkerPosition(newCenter);
//       console.log('New marker position from search:', newCenter);
//     }
//   };

//   return isLoaded ? (
//     <div style={{ position: 'relative', width: '100%', height: '500px' }}>
//       <StandaloneSearchBox
//         onLoad={onLoadSearchBox}
//         onPlacesChanged={onPlacesChanged}
//       >
//         <input
//           type="text"
//           placeholder="Search for a location..."
//           style={{
//             boxSizing: `border-box`,
//             border: `1px solid transparent`,
//             width: `240px`,
//             height: `32px`,
//             padding: `0 12px`,
//             borderRadius: `3px`,
//             boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
//             fontSize: `14px`,
//             outline: `none`,
//             textOverflow: `ellipses`,
//             position: 'absolute',
//             top: '10px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             zIndex: '10',
//           }}
//         />
//       </StandaloneSearchBox>
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={10}
//         onLoad={onLoadMap}
//         onUnmount={onUnmountMap}
//         onClick={handleMapClick}
//       >
//         <Marker position={markerPosition} />
//       </GoogleMap>
//     </div>
//   ) : (
//     <div style={containerStyle}>Loading Map...</div>
//   );
// }

// export default React.memo(MyComponent);

import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: -34.397,
  lng: 150.644,
};

const apikey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apikey,
    libraries: libraries,
  });

  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(center);
  const [searchBox, setSearchBox] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(10); // State for zoom level

  const onLoadMap = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmountMap = useCallback(function callback() {
    setMap(null);
  }, []);

  const handleMapClick = useCallback((event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newPosition);
    console.log('New marker position from click:', newPosition);
  }, []);

  const onLoadSearchBox = (ref) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places.length === 0) {
        return;
      }
      const place = places[0];
      const newCenter = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      
      map.panTo(newCenter);
      setMarkerPosition(newCenter);
      setZoomLevel(15); // Optionally set a specific zoom level on search
      console.log('New marker position from search:', newCenter);
    }
  };

  // Zoom control functions
  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 1, 20)); // Limit max zoom
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 1, 2)); // Limit min zoom
  };

  return isLoaded ? (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      <StandaloneSearchBox
        onLoad={onLoadSearchBox}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Search for a location..."
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '10',
          }}
        />
      </StandaloneSearchBox>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoomLevel} // Use the state variable for zoom
        onLoad={onLoadMap}
        onUnmount={onUnmountMap}
        onClick={handleMapClick}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
      
      {/* Zoom control buttons */}
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: '10' }}>
        <button onClick={handleZoomIn} style={{ display: 'block', marginBottom: '5px' }}>+</button>
        <button onClick={handleZoomOut} style={{ display: 'block' }}>-</button>
      </div>
    </div>
  ) : (
    <div style={containerStyle}>Loading Map...</div>
  );
}

export default React.memo(MyComponent);