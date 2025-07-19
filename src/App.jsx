import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { EcoCoinsBanner } from './components/EcoCoinsBanner';
import { GlobalImpactBanner } from './components/GlobalImpactBanner';
import { Cart } from './components/Cart';
import { RewardsModal } from './components/RewardsModal';
import { CarbonSavingsModal } from './components/CarbonSavingsModal';
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [isCarbonSavingsModalOpen, setIsCarbonSavingsModalOpen] = useState(false);

  const handleRewardRedeemed = (reward) => {
    console.log('Reward redeemed:', reward);
  };

  return (
    <UserProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header onCartClick={() => setIsCartOpen(true)} />
          
          <main>
            <GlobalImpactBanner />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
              <EcoCoinsBanner 
                onRewardsClick={() => setIsRewardsModalOpen(true)}
                onCarbonSavingsClick={() => setIsCarbonSavingsModalOpen(true)}
              />
            </div>
            
            <ProductGrid />
          </main>

          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          
          <RewardsModal 
            isOpen={isRewardsModalOpen}
            onClose={() => setIsRewardsModalOpen(false)}
            onRewardRedeemed={handleRewardRedeemed}
          />
          
          <CarbonSavingsModal 
            isOpen={isCarbonSavingsModalOpen}
            onClose={() => setIsCarbonSavingsModalOpen(false)}
          />
        </div>
      </CartProvider>
    </UserProvider>
  );
}

export default App;