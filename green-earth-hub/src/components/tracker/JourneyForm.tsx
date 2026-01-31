import { useState } from 'react';
import { Calculator, Plus } from 'lucide-react';
import { TransportSelector, TransportType } from './TransportSelector';
import { LisboaSlider } from './LisboaSlider';
import { toast } from 'sonner';

// CO2 emissions in kg per km
const emissionFactors: Record<TransportType, number> = {
  bicycle: 0,
  train: 0.041,
  bus: 0.089,
  electric: 0.053,
  car: 0.21,
};

export const JourneyForm = () => {
  const [transport, setTransport] = useState<TransportType | null>(null);
  const [distance, setDistance] = useState(10);
  const [mileage, setMileage] = useState(15);
  const [calculated, setCalculated] = useState<number | null>(null);

  const handleCalculate = () => {
    if (!transport) {
      toast.error('Please select a transport mode');
      return;
    }

    let emissions = distance * emissionFactors[transport];
    
    // Adjust for car mileage (better mileage = less emissions)
    if (transport === 'car') {
      const mileageMultiplier = 15 / mileage; // Base 15 km/l
      emissions = emissions * mileageMultiplier;
    }

    setCalculated(Math.round(emissions * 100) / 100);
    toast.success(`Journey logged: ${emissions.toFixed(2)} kg CO₂`);
  };

  const handleAddJourney = () => {
    if (calculated === null) {
      handleCalculate();
      return;
    }
    
    toast.success('Journey added to your log!');
    setTransport(null);
    setDistance(10);
    setMileage(15);
    setCalculated(null);
  };

  return (
    <div className="lisboa-card space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center">
          <Plus size={20} strokeWidth={2.5} className="text-coral" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Add Journey</h2>
          <p className="text-sm text-muted-foreground">Log your daily commute</p>
        </div>
      </div>

      <TransportSelector selected={transport} onSelect={setTransport} />

      <LisboaSlider
        label="Distance"
        value={distance}
        min={1}
        max={100}
        unit="km"
        onChange={setDistance}
      />

      {transport === 'car' && (
        <LisboaSlider
          label="Fuel Efficiency"
          value={mileage}
          min={5}
          max={30}
          unit="km/l"
          onChange={setMileage}
        />
      )}

      {/* Calculated Result */}
      {calculated !== null && (
        <div className="bg-cream rounded-2xl p-4 text-center animate-slide-up">
          <p className="text-sm text-muted-foreground mb-1">Estimated Emissions</p>
          <p className="text-3xl font-bold text-foreground">
            {calculated} <span className="text-lg text-muted-foreground">kg CO₂</span>
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCalculate}
          className="flex-1 bg-cream text-foreground font-semibold px-4 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-muted transition-colors"
        >
          <Calculator size={18} strokeWidth={2.5} />
          Calculate
        </button>
        <button
          onClick={handleAddJourney}
          className="flex-1 btn-jungle flex items-center justify-center gap-2"
        >
          <Plus size={18} strokeWidth={2.5} />
          Log Journey
        </button>
      </div>
    </div>
  );
};
