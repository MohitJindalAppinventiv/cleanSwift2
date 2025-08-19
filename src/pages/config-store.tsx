import StoreLocationPicker from "@/pages/area/StoreLocationPicker";
import React from "react";

export default function ConfigStore() {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Add Store Locations</h1>
      <StoreLocationPicker />
    </div>
  );
}
