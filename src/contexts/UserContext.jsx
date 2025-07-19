import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [carbonCredits, setCarbonCredits] = useState(250); // Starting with demo credits (₹10 per credit)
  const [redeemedRewards, setRedeemedRewards] = useState([]);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedCredits = localStorage.getItem("carbonCredits");
    const savedRewards = localStorage.getItem("redeemedRewards");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Create demo user
      const demoUser = {
        id: "demo-user",
        email: "demo@ecomart.com",
        full_name: "Demo User",
        carbon_credits: 250,
      };
      setUser(demoUser);
      localStorage.setItem("user", JSON.stringify(demoUser));
    }

    if (savedCredits) {
      setCarbonCredits(parseInt(savedCredits));
    }

    if (savedRewards) {
      setRedeemedRewards(JSON.parse(savedRewards));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          carbon_credits: carbonCredits,
        })
      );
      localStorage.setItem("carbonCredits", carbonCredits.toString());
      localStorage.setItem("redeemedRewards", JSON.stringify(redeemedRewards));
    }
  }, [user, carbonCredits, redeemedRewards]);

  const addCarbonCredits = (amount) => {
    setCarbonCredits((prev) => prev + amount);
  };

  const spendCarbonCredits = (amount) => {
    if (carbonCredits >= amount) {
      setCarbonCredits((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const addRedeemedReward = (reward) => {
    setRedeemedRewards((prev) => [...prev, reward]);
  };

  const login = (email, name) => {
    const newUser = {
      id: Date.now().toString(),
      email,
      full_name: name,
      carbon_credits: carbonCredits,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setCarbonCredits(0);
    setRedeemedRewards([]);
    localStorage.removeItem("user");
    localStorage.removeItem("carbonCredits");
    localStorage.removeItem("redeemedRewards");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        carbonCredits,
        addCarbonCredits,
        spendCarbonCredits,
        redeemedRewards,
        addRedeemedReward,
        isLoggedIn: !!user,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
