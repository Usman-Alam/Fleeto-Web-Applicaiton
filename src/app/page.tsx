"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Add router import
import HomeHero from "@components/HomeHero";
import ShopsSection from "@components/ShopsSection";
import FAQsSection from "@components/FAQsSection";
import BecomeAPartnerSection from "@components/BecomeAPartnerSection";
import SiteButton from "@components/SiteButton";

interface SectionState {
  data: { id: number; name: string; description?: string; price?: number }[];
  isLoading: boolean;
  error: string | null;
}


export default function Home() {
  useRouter(); // Add router initialization

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

  // Add state for feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

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

      {/* Feedback Buttons Section - Updated */}
      <div className="w-full max-w-[var(--section-width)] my-[60px] flex flex-row items-center justify-center gap-4">
        <SiteButton
          text="Give Feedback"
          variant="filled"
          href="/feedback" // Use href instead of onClick
          className="min-w-[150px] hover:scale-105 transition-transform"
        />
        <SiteButton
          text="View Feedback"
          variant="outlined"
          href="/feedbackDisplay" // Use href instead of onClick
          className="min-w-[150px] hover:scale-105 transition-transform"
        />
      </div>

      <div id="faqs"></div>
      <FAQsSection />
      <BecomeAPartnerSection />

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Give Your Feedback</h3>
            <textarea 
              className="w-full p-2 border rounded mb-4 min-h-[100px]"
              placeholder="Share your thoughts..."
            />
            <div className="flex justify-end gap-2">
              <SiteButton
                text="Cancel"
                variant="outlined"
                onClick={() => setShowFeedbackModal(false)}
              />
              <SiteButton
                text="Submit"
                variant="filled"
                onClick={() => {
                  // Handle feedback submission
                  setShowFeedbackModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
