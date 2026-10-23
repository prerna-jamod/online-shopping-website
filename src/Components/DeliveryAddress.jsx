import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setOrder } from "../redux/orderSlice";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ==========================================
// FIX LEAFLET MARKER ICON
// ==========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ==========================================
// DEFAULT LOCATION - INDORE
// ==========================================

const defaultPosition = {
  lat: 22.7196,
  lng: 75.8577,
};

// ==========================================
// MAP CONTROLLER
// ==========================================

const MapController = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 16, {
        animate: true,
        duration: 1,
      });
    }
  }, [position, map]);

  return null;
};

// ==========================================
// LOCATION MARKER
// ==========================================

const LocationMarker = ({ position, setPosition, getAddress }) => {
  useMapEvents({
    click(e) {
      const newPosition = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };

      setPosition(newPosition);
      getAddress(newPosition);
    },
  });

  const handleDragEnd = (e) => {
    const marker = e.target;

    const newPosition = marker.getLatLng();

    const newPositionData = {
      lat: newPosition.lat,
      lng: newPosition.lng,
    };

    setPosition(newPositionData);
    getAddress(newPositionData);
  };

  if (!position) {
    return null;
  }

  return (
    <Marker
      position={[position.lat, position.lng]}
      draggable={true}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    />
  );
};

// ==========================================
// DELIVERY ADDRESS
// ==========================================

const DeliveryAddress = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================
  // REDUX
  // ==========================================

  const dispatch = useDispatch();

  // ==========================================
  // GET DATA FROM PREVIOUS PAGE
  // ==========================================

  const product = location.state?.product;

  const products = location.state?.products || [];

  const existingAddress = location.state?.address;

  const existingLocation = location.state?.location;

  const existingCoordinates = location.state?.coordinates;

  const editMode = location.state?.editMode || false;

  // ==========================================
  // PRODUCT / CART DATA
  // ==========================================

  const orderProducts =
    products.length > 0 ? products : product ? [product] : [];

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    fullName: existingAddress?.fullName || "",
    mobile: existingAddress?.mobile || "",
    email: existingAddress?.email || "",
    house: existingAddress?.house || "",
    street: existingAddress?.street || "",
    city: existingAddress?.city || "",
    state: existingAddress?.state || "",
    pincode: existingAddress?.pincode || "",
  });

  // ==========================================
  // SAVED ADDRESSES
  // ==========================================

  const [savedAddresses, setSavedAddresses] = useState([]);

  // ==========================================
  // CURRENT SELECTED ADDRESS
  // ==========================================

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // ==========================================
  // EDIT ADDRESS ID
  // ==========================================

  const [editingAddressId, setEditingAddressId] = useState(null);

  // ==========================================
  // SHOW FORM
  // ==========================================

  const [showForm, setShowForm] = useState(true);

  // ==========================================
  // MAP POSITION
  // ==========================================

  const [position, setPosition] = useState(
    existingCoordinates && existingCoordinates.lat && existingCoordinates.lng
      ? {
          lat: Number(existingCoordinates.lat),
          lng: Number(existingCoordinates.lng),
        }
      : defaultPosition,
  );

  // ==========================================
  // LOCATION TEXT
  // ==========================================

  const [locationText, setLocationText] = useState(existingLocation || "");

  // ==========================================
  // SEARCH
  // ==========================================

  const [searchText, setSearchText] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  // ==========================================
  // LOADING
  // ==========================================

  const [locationLoading, setLocationLoading] = useState(false);

  const [searchLoading, setSearchLoading] = useState(false);

  // ==========================================
  // GET ADDRESS FROM COORDINATES
  // ==========================================

  const getAddress = async (coordinates) => {
    try {
      setLocationLoading(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json&addressdetails=1`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to fetch address");
      }

      const data = await response.json();

      const address = data.address || {};

      const house = address.house_number || address.building || "";

      const street =
        address.road ||
        address.street ||
        address.neighbourhood ||
        address.suburb ||
        address.residential ||
        "";

      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.city_district ||
        "";

      const state = address.state || address.state_district || "";

      const pincode = address.postcode || "";

      setFormData((prev) => ({
        ...prev,
        house: house || prev.house,
        street: street || prev.street,
        city: city || prev.city,
        state: state || prev.state,
        pincode: pincode || prev.pincode,
      }));

      setLocationText(
        data.display_name ||
          `Latitude: ${coordinates.lat.toFixed(
            6,
          )}, Longitude: ${coordinates.lng.toFixed(6)}`,
      );
    } catch (error) {
      console.error("Reverse Geocoding Error:", error);

      setLocationText(
        `Latitude: ${coordinates.lat.toFixed(
          6,
        )}, Longitude: ${coordinates.lng.toFixed(6)}`,
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // ==========================================
  // LOAD SAVED ADDRESSES
  // ==========================================

  useEffect(() => {
    const storedAddresses = localStorage.getItem("savedAddresses");

    if (storedAddresses) {
      try {
        const parsedAddresses = JSON.parse(storedAddresses);

        if (Array.isArray(parsedAddresses)) {
          setSavedAddresses(parsedAddresses);
        }
      } catch (error) {
        console.error("Saved address error:", error);
      }
    }
  }, []);

  // ==========================================
  // INITIAL LOCATION
  // ==========================================

  useEffect(() => {
    if (editMode) {
      return;
    }

    if (existingAddress) {
      return;
    }

    if (existingLocation || existingCoordinates) {
      return;
    }

    getAddress(defaultPosition);
  }, [editMode, existingAddress, existingLocation, existingCoordinates]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ========================================
    // PINCODE
    // ========================================

    if (name === "pincode") {
      const onlyNumbers = value.replace(/\D/g, "");

      if (onlyNumbers.length <= 6) {
        setFormData((prev) => ({
          ...prev,
          pincode: onlyNumbers,
        }));
      }

      return;
    }

    // ========================================
    // MOBILE
    // ========================================

    if (name === "mobile") {
      const onlyNumbers = value.replace(/\D/g, "");

      if (onlyNumbers.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          mobile: onlyNumbers,
        }));
      }

      return;
    }

    // ========================================
    // OTHER FIELDS
    // ========================================

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SEARCH LOCATION
  // ==========================================

  const handleSearch = async () => {
    if (!searchText.trim()) {
      alert("Please enter a location to search.");
      return;
    }

    try {
      setSearchLoading(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchText,
        )}&addressdetails=1&limit=5`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();

      setSearchResults(data || []);
    } catch (error) {
      console.error("Search Error:", error);

      setSearchResults([]);

      alert("Unable to search location. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  // ==========================================
  // SEARCH RESULT SELECT
  // ==========================================

  const handleSearchResult = (result) => {
    const newPosition = {
      lat: Number(result.lat),
      lng: Number(result.lon),
    };

    setPosition(newPosition);

    setSearchText(result.display_name || "");

    setSearchResults([]);

    if (result.address) {
      const address = result.address;

      setFormData((prev) => ({
        ...prev,

        house: address.house_number || address.building || prev.house,

        street:
          address.road ||
          address.street ||
          address.neighbourhood ||
          address.suburb ||
          prev.street,

        city:
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          address.city_district ||
          prev.city,

        state: address.state || address.state_district || prev.state,

        pincode: address.postcode || prev.pincode,
      }));
    }

    setLocationText(result.display_name || "");
  };

  // ==========================================
  // CURRENT LOCATION
  // ==========================================

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support location.");
      return;
    }

    setLocationLoading(true);

    setLocationText("Getting your current location...");

    navigator.geolocation.getCurrentPosition(
      async (currentLocation) => {
        const currentPosition = {
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude,
        };

        setPosition(currentPosition);

        await getAddress(currentPosition);
      },

      (error) => {
        console.log("Location Error:", error);

        setLocationLoading(false);

        if (error.code === 1) {
          alert("Location permission denied. Please allow location access.");
        } else if (error.code === 2) {
          alert("Your location could not be detected.");
        } else if (error.code === 3) {
          alert("Location request timed out. Please try again.");
        } else {
          alert("Unable to get your current location.");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  // ==========================================
  // START ADD NEW ADDRESS
  // ==========================================

  const handleAddNewAddress = () => {
    setEditingAddressId(null);

    setSelectedAddressId(null);

    setShowForm(true);

    setFormData({
      fullName: "",
      mobile: "",
      email: "",
      house: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
    });

    setPosition(defaultPosition);

    setLocationText("");

    setSearchText("");

    setSearchResults([]);

    getAddress(defaultPosition);
  };

  // ==========================================
  // SELECT SAVED ADDRESS
  // ==========================================

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id);

    setEditingAddressId(null);

    setShowForm(false);

    setFormData({
      fullName: address.fullName || "",
      mobile: address.mobile || "",
      email: address.email || "",
      house: address.house || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
    });

    setLocationText(address.location || "");

    if (address.coordinates) {
      setPosition({
        lat: Number(address.coordinates.lat),
        lng: Number(address.coordinates.lng),
      });
    }
  };

  // ==========================================
  // EDIT SAVED ADDRESS
  // ==========================================

  const handleEditAddress = (address) => {
    setSelectedAddressId(address.id);

    setEditingAddressId(address.id);

    setShowForm(true);

    setFormData({
      fullName: address.fullName || "",
      mobile: address.mobile || "",
      email: address.email || "",
      house: address.house || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
    });

    setLocationText(address.location || "");

    if (address.coordinates) {
      setPosition({
        lat: Number(address.coordinates.lat),
        lng: Number(address.coordinates.lng),
      });
    }
  };

  // ==========================================
  // DELETE ADDRESS
  // ==========================================

  const handleDeleteAddress = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?",
    );

    if (!confirmDelete) {
      return;
    }

    const updatedAddresses = savedAddresses.filter(
      (address) => address.id !== id,
    );

    setSavedAddresses(updatedAddresses);

    localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));

    if (selectedAddressId === id) {
      setSelectedAddressId(null);

      setEditingAddressId(null);

      setShowForm(updatedAddresses.length === 0);
    }
  };

  // ==========================================
  // SAVE ADDRESS
  // ==========================================

  const saveAddress = () => {
    // ========================================
    // VALIDATION
    // ========================================

    if (
      !formData.fullName.trim() ||
      !formData.mobile.trim() ||
      !formData.email.trim() ||
      !formData.house.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      alert("Please fill all required address details.");

      return null;
    }

    if (formData.mobile.length !== 10) {
      alert("Please enter a valid 10 digit mobile number.");

      return null;
    }

    if (formData.pincode.length !== 6) {
      alert("Please enter a valid 6 digit pincode.");

      return null;
    }

    // ========================================
    // EDIT EXISTING ADDRESS
    // ========================================

    if (editingAddressId) {
      const updatedAddress = {
        id: editingAddressId,

        ...formData,

        location: locationText,

        coordinates: position,
      };

      const updatedAddresses = savedAddresses.map((address) =>
        address.id === editingAddressId ? updatedAddress : address,
      );

      setSavedAddresses(updatedAddresses);

      localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));

      setSelectedAddressId(editingAddressId);

      return updatedAddress;
    }

    // ========================================
    // ADD NEW ADDRESS
    // ========================================

    const newAddress = {
      id: Date.now().toString(),

      ...formData,

      location: locationText,

      coordinates: position,
    };

    const updatedAddresses = [...savedAddresses, newAddress];

    setSavedAddresses(updatedAddresses);

    localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));

    setSelectedAddressId(newAddress.id);

    return newAddress;
  };

  // ==========================================
  // CREATE ORDER ID
  // ==========================================

  const generateOrderId = () => {
    return "FASCO-" + Date.now().toString().slice(-8);
  };

  // ==========================================
  // SAVE & CONTINUE
  // ==========================================

  const handleContinue = (e) => {
    e.preventDefault();

    if (orderProducts.length === 0) {
      alert("No product selected.");
      return;
    }

    const savedAddress = saveAddress();

    if (!savedAddress) {
      return;
    }

    // ========================================
    // CREATE ORDER DATA FOR REDUX
    // ========================================

    const orderId = generateOrderId();

    const orderData = {
      id: orderId,

      orderId: orderId,

      products: orderProducts,

      product: orderProducts[0],

      address: savedAddress,

      location: savedAddress.location || locationText,

      coordinates: savedAddress.coordinates || position,

      totalPrice: totalPrice,

      discount: 0,

      deliveryCharge: 0,

      status: "Checkout Pending",

      paymentStatus: "Pending",

      refundStatus: "Not Applicable",

      orderDate: new Date().toISOString(),

      createdAt: new Date().toISOString(),
    };

    // ========================================
    // SAVE ORDER IN REDUX
    // ========================================

    dispatch(setOrder(orderData));

    // ========================================
    // SAVE LATEST ORDER IN LOCAL STORAGE
    // ========================================

    localStorage.setItem("latestOrder", JSON.stringify(orderData));

    // ========================================
    // GO TO CHECKOUT
    // ========================================

    navigate("/checkout", {
      state: {
        products: orderProducts,

        address: savedAddress,

        location: savedAddress.location || locationText,

        coordinates: savedAddress.coordinates || position,

        order: orderData,
      },
    });
  };

  // ==========================================
  // USE SELECTED SAVED ADDRESS
  // ==========================================

  const handleUseSavedAddress = (address) => {
    setSelectedAddressId(address.id);

    // ========================================
    // CREATE ORDER
    // ========================================

    if (orderProducts.length === 0) {
      alert("No product selected.");
      return;
    }

    const orderId = generateOrderId();

    const orderData = {
      id: orderId,

      orderId: orderId,

      products: orderProducts,

      product: orderProducts[0],

      address: address,

      location: address.location || "",

      coordinates: address.coordinates || null,

      totalPrice: totalPrice,

      discount: 0,

      deliveryCharge: 0,

      status: "Checkout Pending",

      paymentStatus: "Pending",

      refundStatus: "Not Applicable",

      orderDate: new Date().toISOString(),

      createdAt: new Date().toISOString(),
    };

    // ========================================
    // SAVE ORDER IN REDUX
    // ========================================

    dispatch(setOrder(orderData));

    // ========================================
    // SAVE LATEST ORDER
    // ========================================

    localStorage.setItem("latestOrder", JSON.stringify(orderData));

    // ========================================
    // GO TO CHECKOUT
    // ========================================

    navigate("/checkout", {
      state: {
        products: orderProducts,

        address: address,

        location: address.location || "",

        coordinates: address.coordinates || null,

        order: orderData,
      },
    });
  };

  // ==========================================
  // TOTAL PRICE
  // ==========================================

  const totalPrice = orderProducts.reduce((total, item) => {
    const price = Number(item.price) || 0;

    const quantity = Number(item.quantity) || 1;

    return total + price * quantity;
  }, 0);

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ======================================
            PAGE TITLE
        ====================================== */}

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">
            {editMode ? "Edit Delivery Address" : "Delivery Address"}
          </h1>
        </div>

        {/* ======================================
            SAVED ADDRESSES
        ====================================== */}

        {savedAddresses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">Saved Addresses</h2>

                <p className="text-sm text-gray-500 mt-1">
                  {savedAddresses.length} address
                  {savedAddresses.length !== 1 ? "es" : ""} saved
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddNewAddress}
                className="bg-black text-white px-5 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                + Add New Address
              </button>
            </div>

            {/* ADDRESS LIST */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {savedAddresses.map((address, index) => (
                <div
                  key={address.id}
                  className={`border rounded-xl p-5 transition ${
                    selectedAddressId === address.id
                      ? "border-black border-2 bg-gray-50"
                      : "border-gray-200"
                  }`}
                >
                  {/* ADDRESS HEADER */}

                  <div className="flex justify-between items-start gap-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="font-bold">{address.fullName}</h3>

                        <p className="text-sm text-gray-500 mt-1">
                          📱 {address.mobile}
                        </p>
                      </div>
                    </div>

                    {selectedAddressId === address.id && (
                      <span className="text-xs bg-black text-white px-3 py-1 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>

                  {/* ADDRESS DETAILS */}

                  <div className="mt-4 text-sm text-gray-600 leading-6">
                    <p>
                      <strong>Address:</strong> {address.house},{" "}
                      {address.street}
                    </p>

                    <p>
                      {address.city}, {address.state} - {address.pincode}
                    </p>

                    <p className="mt-1">📧 {address.email}</p>
                  </div>

                  {/* LOCATION */}

                  {address.location && (
                    <p className="mt-3 text-xs text-gray-400 line-clamp-2">
                      📍 {address.location}
                    </p>
                  )}

                  {/* BUTTONS */}

                  <div className="flex flex-wrap gap-2 mt-5">
                    <button
                      type="button"
                      onClick={() => handleUseSavedAddress(address)}
                      className="flex-1 min-w-[120px] bg-black text-white py-2.5 px-3 rounded-lg text-sm font-semibold hover:bg-gray-800"
                    >
                      Use Address
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEditAddress(address)}
                      className="border border-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-black hover:text-white transition"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="border border-red-500 text-red-500 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================
            ADD / EDIT FORM
        ====================================== */}

        {showForm && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT SIDE */}

            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              {/* FORM TITLE */}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingAddressId ? "Edit Address" : "Add New Address"}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Enter complete delivery details.
                  </p>
                </div>

                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingAddressId(null);
                    }}
                    className="border border-gray-300 px-4 py-2 rounded-lg text-sm"
                  >
                    Close
                  </button>
                )}
              </div>

              <form onSubmit={handleContinue}>
                {/* FULL NAME */}

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
                    required
                  />
                </div>

                {/* MOBILE + EMAIL */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Mobile Number *
                    </label>

                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      inputMode="numeric"
                      maxLength={10}
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
                      required
                    />
                  </div>
                </div>

                {/* HOUSE */}

                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-2">
                    House / Flat / Building *
                  </label>

                  <input
                    type="text"
                    name="house"
                    value={formData.house}
                    onChange={handleChange}
                    placeholder="House / Flat / Building"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
                    required
                  />
                </div>

                {/* STREET */}

                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-2">
                    Street / Area
                  </label>

                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Street / Area"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                {/* CITY / STATE / PINCODE */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      City *
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      State *
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Pincode *
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter Pincode"
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
                      required
                    />
                  </div>
                </div>

                {/* MAP */}

                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">
                    Select Delivery Location
                  </h2>

                  <div className="border rounded-xl p-4 bg-gray-50">
                    {/* SEARCH */}

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSearch();
                          }
                        }}
                        placeholder="Search your location..."
                        className="flex-1 border rounded-lg px-4 py-3 outline-none focus:border-black"
                      />

                      <button
                        type="button"
                        onClick={handleSearch}
                        disabled={searchLoading}
                        className="bg-black text-white px-5 py-3 rounded-lg font-semibold disabled:opacity-50"
                      >
                        {searchLoading ? "..." : "Search"}
                      </button>
                    </div>

                    {/* SEARCH RESULTS */}

                    {searchResults.length > 0 && (
                      <div className="bg-white border rounded-lg mt-2 shadow-md overflow-hidden">
                        {searchResults.map((result, index) => (
                          <button
                            type="button"
                            key={result.place_id || index}
                            onClick={() => handleSearchResult(result)}
                            className="w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-gray-100 text-sm"
                          >
                            📍 {result.display_name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* MAP */}

                    <div className="mt-4 overflow-hidden rounded-xl border">
                      <MapContainer
                        center={[position.lat, position.lng]}
                        zoom={13}
                        scrollWheelZoom={false}
                        dragging={true}
                        touchZoom={true}
                        doubleClickZoom={true}
                        style={{
                          width: "100%",
                          height: "400px",
                        }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <MapController position={position} />

                        <LocationMarker
                          position={position}
                          setPosition={setPosition}
                          getAddress={getAddress}
                        />
                      </MapContainer>
                    </div>

                    {/* CURRENT LOCATION */}

                    <button
                      type="button"
                      onClick={handleCurrentLocation}
                      disabled={locationLoading}
                      className="mt-4 w-full border-2 border-black rounded-lg py-3 font-semibold hover:bg-black hover:text-white transition disabled:opacity-50"
                    >
                      {locationLoading
                        ? "Getting Location..."
                        : "📍 Use My Current Location"}
                    </button>

                    {/* SELECTED LOCATION */}

                    {locationText && (
                      <div className="mt-4 p-4 bg-white border rounded-lg">
                        <p className="text-sm font-semibold">
                          Selected Delivery Location
                        </p>

                        <p className="mt-2 text-sm text-gray-600 break-words">
                          {locationText}
                        </p>

                        {position && (
                          <p className="mt-2 text-xs text-gray-400">
                            Latitude: {position.lat.toFixed(6)}
                            <br />
                            Longitude: {position.lng.toFixed(6)}
                          </p>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-3">
                      Search your location, click anywhere on the map, drag the
                      marker, or use your current location.
                    </p>
                  </div>
                </div>

                {/* SAVE / UPDATE BUTTON */}

                <button
                  type="submit"
                  className="w-full mt-8 bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                  {editingAddressId
                    ? "Update Address & Continue"
                    : "Save Address & Continue"}
                </button>
              </form>
            </div>

            {/* ORDER SUMMARY */}

            <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {orderProducts.length > 0 ? (
                <div className="space-y-5">
                  {orderProducts.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex gap-4 border-b pb-4"
                    >
                      <img
                        src={item.image || item.thumbnail || ""}
                        alt={item.name || item.title || "Product"}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">
                          {item.name || item.title || "Product"}
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          Qty: {item.quantity || 1}
                        </p>

                        <p className="font-semibold mt-2">
                          ₹{(Number(item.price) || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* TOTAL */}

                  <div className="flex justify-between pt-2 text-lg font-bold">
                    <span>Total</span>

                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No product selected.</p>
              )}
            </div>
          </div>
        )}

        {/* ======================================
            IF SAVED ADDRESS EXISTS BUT FORM
            IS CLOSED
        ====================================== */}

        {!showForm && savedAddresses.length > 0 && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleAddNewAddress}
              className="inline-block bg-black text-white px-4 py-2 rounded-md text-sm tracking-wide font-medium hover:bg-gray-800 transition"
            >
              + Add Another Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryAddress;
