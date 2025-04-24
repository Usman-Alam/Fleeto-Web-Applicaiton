"use client";

import { useState, useEffect } from "react";
import HomeHero from "@components/HomeHero";
import ShopsSection from "@components/ShopsSection";
import FAQsSection from "@components/FAQsSection";
import BecomeAPartnerSection from "@components/BecomeAPartnerSection";

interface SectionState {
  data: any[];
  isLoading: boolean;
  error: string | null;
}

export default function Home() {
  // Separate loading states for each section
  const [sections, setSections] = useState<{
    restaurants: SectionState;
    grocery: SectionState;
    medicine: SectionState;
  }>({
    restaurants: { data: [], isLoading: true, error: null },
    grocery: { data: [], isLoading: true, error: null },
    medicine: { data: [], isLoading: true, error: null }
  });

  const fetchRestaurants = async () => {
    try {
      setSections(prev => ({
        ...prev,
        restaurants: { ...prev.restaurants, isLoading: true }
      }));
      const response = await fetch('/api/addShopRestaurant');
      const data = await response.json();
      if (response.ok) {
        setSections(prev => ({
          ...prev,
          restaurants: { data: data.data, isLoading: false, error: null }
        }));
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setSections(prev => ({
        ...prev,
        restaurants: { ...prev.restaurants, isLoading: false, error: 'Failed to load restaurants' }
      }));
    }
  };

  const fetchGroceryStores = async () => {
    try {
      setSections(prev => ({
        ...prev,
        grocery: { ...prev.grocery, isLoading: true }
      }));
      const response = await fetch('/api/addShopGrocery');
      const data = await response.json();
      if (response.ok) {
        setSections(prev => ({
          ...prev,
          grocery: { data: data.data, isLoading: false, error: null }
        }));
      }
    } catch (error) {
      console.error('Error fetching grocery stores:', error);
      setSections(prev => ({
        ...prev,
        grocery: { ...prev.grocery, isLoading: false, error: 'Failed to load grocery stores' }
      }));
    }
  };

  const fetchPharmacies = async () => {
    try {
      setSections(prev => ({
        ...prev,
        medicine: { ...prev.medicine, isLoading: true }
      }));
      const response = await fetch('/api/addShopMedicine');
      const data = await response.json();
      if (response.ok) {
        setSections(prev => ({
          ...prev,
          medicine: { data: data.data, isLoading: false, error: null }
        }));
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      setSections(prev => ({
        ...prev,
        medicine: { ...prev.medicine, isLoading: false, error: 'Failed to load pharmacies' }
      }));
    }
  };

  useEffect(() => {
    fetchRestaurants();
    fetchGroceryStores();
    fetchPharmacies();
  }, []);

  // Loading component for sections
  const LoadingSection = () => (
    <div className="w-full flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
    </div>
  );

  // Error component for sections
  const ErrorSection = ({ message }: { message: string }) => (
    <div className="w-full flex items-center justify-center py-20">
      <div className="text-red-500">{message}</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-top w-full">
      <HomeHero />
      <div id="shops"></div>

      {/* Restaurants Section */}
      {sections.restaurants.isLoading ? (
        <LoadingSection />
      ) : sections.restaurants.error ? (
        <ErrorSection message={sections.restaurants.error} />
      ) : (
        <ShopsSection
          icon="/restaurant.svg"
          heading="Restaurants"
          data={sections.restaurants.data}
        />
      )}

      {/* Medicine Section */}
      {sections.medicine.isLoading ? (
        <LoadingSection />
      ) : sections.medicine.error ? (
        <ErrorSection message={sections.medicine.error} />
      ) : (
        <ShopsSection
          icon="/medicine.svg"
          heading="Medicine"
          data={sections.medicine.data}
        />
      )}

      {/* Grocery Section */}
      {sections.grocery.isLoading ? (
        <LoadingSection />
      ) : sections.grocery.error ? (
        <ErrorSection message={sections.grocery.error} />
      ) : (
        <ShopsSection
          icon="/grocery.svg"
          heading="Grocery"
          data={sections.grocery.data}
        />
      )}

      <div id="faqs"></div>
      <FAQsSection />

      {/* Shop Owner Benefits Section - Added before FAQs */}
      <BecomeAPartnerSection />
    </div>
  );
}
