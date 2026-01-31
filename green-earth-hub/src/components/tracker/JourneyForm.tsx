import { useState, useEffect } from 'react';
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
  car: 0, // Handled specifically with mileage
};

interface JourneyFormProps {
  onEmissionChange?: (emission: number) => void;
  onJourneySaved?: () => void;
}

export const JourneyForm = ({ onEmissionChange, onJourneySaved }: JourneyFormProps) => {
  const [transport, setTransport] = useState<TransportType | null>(null);
  const [distance, setDistance] = useState(10);
  const [mileage, setMileage] = useState(15);
  const [calculated, setCalculated] = useState<number | null>(null);

  // Real-time calculation
  useEffect(() => {
    if (!transport) {
      setCalculated(null);
      onEmissionChange?.(0);
      return;
    }

    let emissions = 0;
    if (transport === 'car') {
      // Car: (Distance / FuelEfficiency) * 2.31 (approx CO2 per liter of petrol)
      emissions = (distance / mileage) * 2.31;
    } else {
      emissions = distance * emissionFactors[transport];
    }

    const rounded = Math.round(emissions * 100) / 100;
    setCalculated(rounded);
    onEmissionChange?.(rounded);
  }, [transport, distance, mileage, onEmissionChange]);

  const handleCalculate = () => {
    if (!transport) {
      toast.error('Please select a transport mode');
      return;
    }

    // Since it's real-time, we just show the toast here as requested
    if (calculated !== null) {
      toast.success(`Journey logged: ${calculated.toFixed(2)} kg CO₂`);
    }
  };

  const handleAddJourney = async () => {
    if (calculated === null || !transport) {
      toast.error('Please select a transport mode first');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/journey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assuming the auth token is in an httpOnly cookie, so we need to include credentials
          // However, typical fetch doesn't include cookies by default for cross-origin.
          // Since we are likely on localhost:5173 calling localhost:5000, we need 'credentials: include' if using cookies.
        },
        // The backend uses cookies for auth, so we MUST include credentials
        credentials: 'include',
        body: JSON.stringify({
          transportType: transport,
          distance,
          fuelEfficiency: transport === 'car' ? mileage : undefined,
          emissions: calculated
        }),
      });

      if (response.ok) {
        toast.success('Journey added to your log!');
        setTransport(null);
        setDistance(10);
        setMileage(15);
        // calculated will reset via useEffect
        onJourneySaved?.();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save journey');
      }
    } catch (error) {
      console.error('Save Journey Error:', error);
      toast.error('Error saving journey');
    }
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
