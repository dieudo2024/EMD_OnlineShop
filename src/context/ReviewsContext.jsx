import { createContext, useContext, useEffect, useState } from "react";
import {
  loadReviewsFromStorage,
  saveReviewsToStorage,
} from "../services/storage";
import { sanitizeReviewPayload } from "../utils/security";

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  const [userReviews, setUserReviews] = useState(() =>
    loadReviewsFromStorage()
  );

  useEffect(() => {
    saveReviewsToStorage(userReviews);
  }, [userReviews]);

  const addReview = (productId, review) => {
    const safeReview = sanitizeReviewPayload(review);
    setUserReviews((prev) => {
      const current = prev[productId] || [];
      return {
        ...prev,
        [productId]: [...current, safeReview],
      };
    });
  };

  const getAllReviewsForProduct = (productId, apiReviews = []) => {
    const user = userReviews[productId] || [];
    return [...apiReviews, ...user];
  };

  const value = {
    addReview,
    getAllReviewsForProduct,
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewsProvider");
  return ctx;
}