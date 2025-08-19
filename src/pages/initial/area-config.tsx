// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   GoogleMap,
//   Marker,
//   StandaloneSearchBox,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import API from "@/api/endpoints/endpoint";
// import { useNavigate } from "react-router-dom";
// import { useAppSelector } from "@/hooks/redux";

// interface Area {
//   id: string;
//   locationName: string;
//   address: string;
//   range: number;
//   coordinates: {
//     latitude: number;
//     longitude: number;
//   };
// }

// const containerStyle = {
//   width: "100%",
//   height: "400px",
// };

// const defaultCenter = {
//   lat: 28.6139,
//   lng: 77.209,
// };

// const libraries = ["places"];

// export default function StoreLocationPage() {
//   const profileComplete = useAppSelector((state) => state.profileStatus);
//   console.log("profileComplete", profileComplete);

//   const [storeName, setStoreName] = useState("");
//   const [serviceRadius, setServiceRadius] = useState("");
//   const [marker, setMarker] = useState(defaultCenter);
//   const [detectedAddress, setDetectedAddress] = useState("");
//   const [locations, setLocations] = useState<Area[]>([]);
//   const mapRef = useRef<google.maps.Map | null>(null);
//   const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
//     if (event.latLng) {
//       const lat = event.latLng.lat();
//       const lng = event.latLng.lng();
//       setMarker({ lat, lng });
//     }
//   }, []);

//   const reverseGeocode = (lat: number, lng: number) => {
//     if (!window.google) return;
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//       if (status === "OK" && results && results.length > 0) {
//         setDetectedAddress(results[0].formatted_address);
//       } else {
//         setDetectedAddress("Unable to detect address");
//       }
//     });
//   };

//   useEffect(() => {
//     if (isLoaded && marker.lat && marker.lng) {
//       reverseGeocode(marker.lat, marker.lng);
//     }
//   }, [marker, isLoaded]);

//   const onPlacesChanged = () => {
//     const places = searchBoxRef.current?.getPlaces();
//     if (places && places.length > 0) {
//       const place = places[0];
//       const lat = place.geometry?.location?.lat();
//       const lng = place.geometry?.location?.lng();

//       if (lat && lng) {
//         const newPosition = { lat, lng };
//         setMarker(newPosition);
//         mapRef.current?.panTo(newPosition);
//         setDetectedAddress(place.formatted_address || "");
//       }
//     }
//   };

//   const fetchAreas = async () => {
//     try {
//       const response = await axiosInstance.get(API.GET_AREAS());
//       setLocations(response.data.areas || []);
//     } catch (error) {
//       console.error("Failed to fetch areas", error);
//     }
//   };

//   useEffect(() => {
//     fetchAreas();
//   }, []);

//   const handleAddLocation = async () => {
//     try {
//       await axiosInstance.post(API.ADMIN_CREATE_AREA(), {
//         locationName: storeName,
//         coordinates: {
//           latitude: marker.lat,
//           longitude: marker.lng,
//         },
//         range: Number(serviceRadius),
//         address: detectedAddress,
//       });

//       toast({ title: "Location added to map!" });
//       setStoreName("");
//       setServiceRadius("");
//       await fetchAreas(); // Refresh locations list
//     } catch (error) {
//       console.error("Add Error", error);
//       toast({ variant: "destructive", title: "Failed to add location" });
//     }
//   };

//   const handleSubmit = () => {
//     if (profileComplete.data.configurations.service) {
//       navigate("/");
//     } else {
//       navigate("/Serv");
//     }
//   };
//   if (loadError) return <div>Failed to load Google Maps</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4">
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-8">
//         {/* Heading */}
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Store Location Management
//           </h1>
//           <p className="text-gray-600">
//             Add your store location on the map and define a service radius to
//             serve customers.
//           </p>
//         </div>

//         {/* Add Store Form */}
//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold text-gray-700">Add New Store</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="storeName">Store Name</Label>
//               <Input
//                 id="storeName"
//                 value={storeName}
//                 onChange={(e) => setStoreName(e.target.value)}
//                 placeholder="Enter your store name"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="serviceRadius">Serviceable Radius (in KM)</Label>
//               <Input
//                 id="serviceRadius"
//                 type="number"
//                 value={serviceRadius}
//                 onChange={(e) => setServiceRadius(e.target.value)}
//                 placeholder="e.g., 5"
//               />
//             </div>
//           </div>

//           {/* Address Preview */}
//           <div className="space-y-2">
//             <Label>Detected Address</Label>
//             <div className="p-3 border rounded-md bg-gray-100 text-sm text-gray-700">
//               {detectedAddress}
//             </div>
//           </div>

//           {/* Map + Search */}
//           <div className="space-y-2">
//             <Label>Choose Store Location</Label>
//             <div className="relative border border-gray-300 rounded-md overflow-hidden shadow-sm">
//               {isLoaded ? (
//                 <>
//                   <StandaloneSearchBox
//                     onLoad={(ref) => (searchBoxRef.current = ref)}
//                     onPlacesChanged={onPlacesChanged}
//                   >
//                     <input
//                       type="text"
//                       placeholder="Search location..."
//                       style={{
//                         position: "absolute",
//                         top: 10,
//                         left: "50%",
//                         transform: "translateX(-50%)",
//                         width: "300px",
//                         padding: "8px 12px",
//                         borderRadius: "4px",
//                         zIndex: 10,
//                         boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
//                         border: "1px solid #ccc",
//                         fontSize: "14px",
//                       }}
//                     />
//                   </StandaloneSearchBox>

//                   <GoogleMap
//                     mapContainerStyle={containerStyle}
//                     center={marker}
//                     zoom={14}
//                     onClick={handleMapClick}
//                     onLoad={(map) => (mapRef.current = map)}
//                   >
//                     <Marker position={marker} />
//                   </GoogleMap>
//                 </>
//               ) : (
//                 <div className="flex justify-center items-center h-[400px]">
//                   Loading map...
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-4 pt-2">
//             <Button
//               onClick={handleAddLocation}
//               disabled={!storeName || !serviceRadius}
//             >
//               Add Areas
//             </Button>

//             <Button
//               variant="secondary"
//               onClick={handleSubmit}
//               disabled={locations.length === 0}
//             >
//               Next
//             </Button>
//           </div>
//         </div>

//         {/* Saved Locations */}
//         <div className="pt-4">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">
//             Saved Locations
//           </h2>
//           {locations.length === 0 ? (
//             <p className="text-gray-500">No store locations added yet.</p>
//           ) : (
//             <div className="grid gap-4">
//               {locations.map((loc) => (
//                 <div
//                   key={loc.id}
//                   className="border p-4 rounded-md shadow-sm space-y-1 bg-gray-50"
//                 >
//                   <h3 className="font-semibold text-gray-800">
//                     {loc.locationName}
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     Address: {loc.address}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Radius: {loc.range} km
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Lat: {loc.coordinates.latitude}, Lng:{" "}
//                     {loc.coordinates.longitude}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/api/axios/axiosInstance";
import API from "@/api/endpoints/endpoint";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import type { Libraries } from "@react-google-maps/api";
interface Area {
  id: string;
  locationName: string;
  address: string;
  range: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

const libraries:Libraries = ["places"];

export default function StoreLocationPage() {
  const profileComplete = useAppSelector((state) => state.profileStatus);
  console.log("profileComplete", profileComplete);

  const [storeName, setStoreName] = useState("");
  const [serviceRadius, setServiceRadius] = useState("");
  const [marker, setMarker] = useState(defaultCenter);
  const [detectedAddress, setDetectedAddress] = useState("");
  const [locations, setLocations] = useState<Area[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarker({ lat, lng });
    }
  }, []);

  const reverseGeocode = (lat: number, lng: number) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        setDetectedAddress(results[0].formatted_address);
      } else {
        setDetectedAddress("Unable to detect address");
      }
    });
  };

  useEffect(() => {
    if (isLoaded && marker.lat && marker.lng) {
      reverseGeocode(marker.lat, marker.lng);
    }
  }, [marker, isLoaded]);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();

      if (lat && lng) {
        const newPosition = { lat, lng };
        setMarker(newPosition);
        mapRef.current?.panTo(newPosition);
        setDetectedAddress(place.formatted_address || "");
      }
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axiosInstance.get(API.GET_AREAS());
      setLocations(response.data.areas || []);
    } catch (error) {
      console.error("Failed to fetch areas", error);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleAddLocation = async () => {
    try {
      await axiosInstance.post(API.ADMIN_CREATE_AREA(), {
        locationName: storeName,
        coordinates: {
          latitude: marker.lat,
          longitude: marker.lng,
        },
        range: Number(serviceRadius),
        address: detectedAddress,
      });

      toast({ title: "Location added to map!" });
      setStoreName("");
      setServiceRadius("");
      await fetchAreas(); // Refresh locations list
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };

      console.error("Add Error", error);
      toast({ variant: "destructive", title: "Failed to add location" });
    }
  };

  const handleSubmit = () => {
    if (profileComplete.data.configurations.service.isConfigured) {
      console.log("location  ", profileComplete);
      navigate("/");
    } else {
      navigate("/Serv");
    }
  };
  if (loadError) return <div>Failed to load Google Maps</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-8">
        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Store Location Management
          </h1>
          <p className="text-gray-600">
            Add your store location on the map and define a service radius to
            serve customers.
          </p>
        </div>

        {/* Add Store Form */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">Add New Store</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter your store name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceRadius">Serviceable Radius (in KM)</Label>
              <Input
                id="serviceRadius"
                type="number"
                value={serviceRadius}
                onChange={(e) => setServiceRadius(e.target.value)}
                min={1}
                placeholder="e.g., 5"
              />
            </div>
          </div>

          {/* Address Preview */}
          <div className="space-y-2">
            <Label>Detected Address</Label>
            <div className="p-3 border rounded-md bg-gray-100 text-sm text-gray-700">
              {detectedAddress}
            </div>
          </div>

          {/* Map + Search */}
          <div className="space-y-2">
            <Label>Choose Store Location</Label>
            <div className="relative border border-gray-300 rounded-md overflow-hidden shadow-sm">
              {isLoaded ? (
                <>
                  <StandaloneSearchBox
                    onLoad={(ref) => (searchBoxRef.current = ref)}
                    onPlacesChanged={onPlacesChanged}
                  >
                    <input
                      type="text"
                      placeholder="Search location..."
                      style={{
                        position: "absolute",
                        top: 10,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "300px",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        zIndex: 10,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                      }}
                    />
                  </StandaloneSearchBox>

                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={marker}
                    zoom={14}
                    onClick={handleMapClick}
                    onLoad={(map) => (mapRef.current = map)}
                  >
                    <Marker position={marker} />
                  </GoogleMap>
                </>
              ) : (
                <div className="flex justify-center items-center h-[400px]">
                  Loading map...
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              onClick={handleAddLocation}
              disabled={!storeName || !serviceRadius}
            >
              Add Areas
            </Button>

            <Button
              variant="secondary"
              onClick={handleSubmit}
              disabled={locations.length === 0}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Saved Locations */}
        <div className="pt-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Saved Locations
          </h2>
          {locations.length === 0 ? (
            <p className="text-gray-500">No store locations added yet.</p>
          ) : (
            <div className="grid gap-4">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="border p-4 rounded-md shadow-sm space-y-1 bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-800">
                    {loc.locationName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Address: {loc.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    Radius: {loc.range} km
                  </p>
                  <p className="text-sm text-gray-600">
                    Lat: {loc.coordinates.latitude}, Lng:{" "}
                    {loc.coordinates.longitude}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
