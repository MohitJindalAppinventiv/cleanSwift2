import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/index";
import {
  createArea,
  updateArea,
  selectIsSubmitting,
} from "@/store/slices/locationSlice";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api';
import type { Libraries } from "@react-google-maps/api";

// Google Maps API configuration and libraries
const Maps_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries:Libraries = ['places'];

// Map container styles
const containerStyle = {
  width: '100%',
  height: '400px',
};

// Default center position
const defaultCenter = {
  lat: -34.397,
  lng: 150.644,
};

interface Area {
  id: string;
  locationName: string;
  address?: string;
  range: number;
  isActive: boolean;
  lat?:number;
  lng?:number;
}

interface StoreProps {
  close: () => void;
  areaToEdit?: Area | null;
}

interface StoreFormData {
  storeName: string;
  serviceAreaKm?: number;
  address: string;
  lat: number | null;
  lng: number | null;
}

const StoreLocationPicker: React.FC<StoreProps> = ({
  close,
  areaToEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isSubmitting = useSelector(selectIsSubmitting);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: Maps_API_KEY,
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const [storeData, setStoreData] = useState<StoreFormData>({
    storeName: "",
    serviceAreaKm: undefined,
    address: "",
    lat: defaultCenter.lat,
    lng: defaultCenter.lng,
  });
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (areaToEdit) {
    setStoreData({
      storeName: areaToEdit.locationName,
      serviceAreaKm: areaToEdit.range,
      address: areaToEdit.address ?? "",
      lat: areaToEdit?.lat ?? defaultCenter.lat,  // <-- use actual lat/lng if provided
      lng: areaToEdit?.lng ?? defaultCenter.lng,
    });
    if (areaToEdit.lat && areaToEdit.lng) {
      setMarkerPosition({ lat: areaToEdit.lat, lng: areaToEdit.lng });
    }
  }
}, [areaToEdit]);
  

  // Update marker position and reverse geocode on map click
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newPosition = { lat, lng };

    setMarkerPosition(newPosition);
    setStoreData(prev => ({
      ...prev,
      lat,
      lng,
    }));

    reverseGeocode(lat, lng);
  }, []);

  // Reverse geocode to get an address from coordinates
  const reverseGeocode = (lat: number, lng: number) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setStoreData(prev => ({
          ...prev,
          address: results[0].formatted_address,
        }));
      } else {
        console.error("Geocoder failed due to:", status);
      }
    });
  };

useEffect(() => {
  if (areaToEdit) {
    setStoreData({
      storeName: areaToEdit.locationName,
      serviceAreaKm: areaToEdit.range,
      address: areaToEdit.address ?? "",
      lat: areaToEdit?.lat ?? defaultCenter.lat,  // <-- use actual lat/lng if provided
      lng: areaToEdit?.lng ?? defaultCenter.lng,
    });
    if (areaToEdit.lat && areaToEdit.lng) {
      setMarkerPosition({ lat: areaToEdit.lat, lng: areaToEdit.lng });
    }
  }
}, [areaToEdit]);

// On map load, use edit mode coords first
const onLoadMap = useCallback((map: google.maps.Map) => {
  setMap(map);

  if (areaToEdit?.lat && areaToEdit?.lng) {
    // Editing existing location → center map there
    const center = { lat: areaToEdit.lat, lng: areaToEdit.lng };
    map.panTo(center);
    setMarkerPosition(center);
    reverseGeocode(center.lat, center.lng);
  } else if (navigator.geolocation) {
    // Add new location → try user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.panTo(center);
        setMarkerPosition(center);
        setStoreData(prev => ({ ...prev, lat: center.lat, lng: center.lng }));
        reverseGeocode(center.lat, center.lng);
      },
      () => {
        // Fallback
        setMarkerPosition(defaultCenter);
        reverseGeocode(defaultCenter.lat, defaultCenter.lng);
      }
    );
  } else {
    // No geolocation
    setMarkerPosition(defaultCenter);
    reverseGeocode(defaultCenter.lat, defaultCenter.lng);
  }
}, [areaToEdit]);


  // Callback for the search box
  const onLoadSearchBox = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  // Callback for when a place is selected from the search box
  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        if (map) {
          map.panTo(newPosition);
          setMarkerPosition(newPosition);
          setStoreData(prev => ({ ...prev, lat: newPosition.lat, lng: newPosition.lng }));
          setStoreData(prev => ({ ...prev, address: place.formatted_address }));
        }
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeData.storeName.trim()) {
      setError("Store name is required");
      return;
    }
    if (!storeData.serviceAreaKm || storeData.serviceAreaKm <= 0) {
      setError("Service area must be a positive number");
      return;
    }
    if (!storeData.lat || !storeData.lng) {
      setError("Please select a location on the map");
      return;
    }

    setError(null);

    const payload = {
      locationName: storeData.storeName,
      coordinates: {
        latitude: storeData.lat,
        longitude: storeData.lng,
      },
      range: storeData.serviceAreaKm,
      address: storeData.address,
    };

    if (areaToEdit) {
      
      dispatch(updateArea({ id: areaToEdit.id, updatedData: payload }));
    } else {
      dispatch(createArea(payload));
    }
  };

  if (loadError) return <div>Error loading maps</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold mb-2">
        {areaToEdit ? "Edit Store Location" : "Add New Store Location"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Store Name: *</label>
          <input
            type="text"
            value={storeData.storeName}
            onChange={(e) =>
              setStoreData({ ...storeData, storeName: e.target.value })
            }
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your store name"
            required
          />

          <label className="block text-sm font-medium">Detected Address:</label>
          <div className="border rounded px-3 py-2 bg-gray-100 text-sm min-h-[40px]">
            {storeData.address || "No address detected yet"}
          </div>

          <label className="block text-sm font-medium">
            Service Area (in KM): *
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={storeData.serviceAreaKm || ""}
            onChange={(e) =>
              setStoreData({
                ...storeData,
                serviceAreaKm: Number(e.target.value),
              })
            }
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Service Area in Kilometers"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Location (Click on map or search to select):
          </label>
          
          <div style={{ position: 'relative', height: '400px' }}>
            {isLoaded ? (
              <>
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
                  center={markerPosition}
                  zoom={15}
                  onLoad={onLoadMap}
                  onClick={handleMapClick}
                >
                  <Marker position={markerPosition} />
                </GoogleMap>
              </>
            ) : (
              <div className="flex items-center justify-center h-[400px] border rounded bg-gray-100">
                <span>Loading map...</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"></span>
            )}
            {isSubmitting
              ? (areaToEdit ? "Updating..." : "Creating...")
              : (areaToEdit ? "Update Store" : "Create Store")
            }
          </button>
          <button
            type="button"
            onClick={close}
            disabled={isSubmitting}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreLocationPicker;

