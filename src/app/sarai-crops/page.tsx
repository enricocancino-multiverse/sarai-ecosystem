'use client';
'use strict';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Detailed data store for Project SARAI's priority crop focus areas
const cropDetails: Record<string, { 
  icon: string; 
  description: string; 
  focus: string[]; 
  practices: string[]; 
  bestTime: string; 
  worstTime: string; 
}> = {
  Rice: {
    icon: "🌾",
    description: "The primary staple crop monitored closely for real-time weather effects, automated forecasting, and drought/flood resilience.",
    focus: ["Sowing date optimization", "Water management systems", "Yield prediction modeling"],
    practices: ["Alternate Wetting and Drying (AWD)", "SARAI advisory-based planting schedules"],
    bestTime: "Wet Season (June to September) for rainfed lowland areas, and early Dry Season (October to December) for irrigated systems.",
    worstTime: "Peak El Niño dry stretches (March to May) without a secure irrigation network, or mid-typhoon season (August to September) in highly flood-prone basins."
  },
  Corn: {
    icon: "🌽",
    description: "Key agricultural commodity deeply integrated into livestock feed and industrial supply chains, optimized for climate shift adaptations.",
    focus: ["Pest tracking & diagnostics", "Soil moisture monitoring", "Nutrient deficiency checks"],
    practices: ["Integrated Pest Management (IPM)", "Precision fertilizer mapping"],
    bestTime: "Main Rainy Season (May to June) or the traditional Dry Season window (October to January).",
    worstTime: "Late wet season planting (August to September) due to severe downpours causing seed rot, waterlogging, and increased fungal stalk rot risks."
  },
  Banana: {
    icon: "🍌",
    description: "Major high-value fruit crop monitored for wind damage vulnerability, disease tracking, and temperature thresholds.",
    focus: ["Typhoon damage tracking", "Panama disease mapping", "Soil quality assessment"],
    practices: ["Proactive propping & pruning", "Site-specific soil treatments"],
    bestTime: "At the onset of the rainy season (May to June) so young plants can establish strong root systems before heavy winds arrive.",
    worstTime: "Late dry season (March to April) when severe soil moisture deficits stress vulnerable young suckers before they mature."
  },
  Coconut: {
    icon: "🥥",
    description: "Long-term tree crop crucial for local farmers, supported by remote sensing data to map canopy health and productivity levels.",
    focus: ["Scale insect infestation tracking", "Drought stress warnings", "Yield trend forecasting"],
    practices: ["Intercropping optimizations", "Biological pest controls"],
    bestTime: "Start of the local wet season (typically May to June or October depending on your regional climate zone) to leverage consistent natural rainfall.",
    worstTime: "Peak dry summer months (March to April) as prolonged dry spells severely hamper early root development and slow down initial frond growth."
  },
  Coffee: {
    icon: "☕",
    description: "Premium cash crop highly sensitive to microclimate shifts, high temperatures, and specific elevation rainfall patterns.",
    focus: ["Microclimate data mapping", "Berry borer infestation alerts", "Shade-growth optimization"],
    practices: ["Agroforestry design", "Post-harvest processing tracking"],
    bestTime: "Onset of the monsoon season (May to June) to ensure adequate hydration for initial field transplanting stabilization.",
    worstTime: "The heart of the dry season (January to April) when scorching heat blocks young seedlings from adjusting to open field conditions."
  },
  Cacao: {
    icon: "🍫",
    description: "Expanding priority crop requiring distinct humidity controls and shade management to maximize bean quality.",
    focus: ["Vascular streak dieback monitoring", "Pod borer prevention", "Humidity index modeling"],
    practices: ["Strategic pruning patterns", "Controlled shade setups"],
    bestTime: "Beginning of the rainy season (June to October) when atmospheric humidity naturally balances the plant's intense moisture needs.",
    worstTime: "March to May. Low ambient humidity combined with extreme ambient heat stress causes intense leaf scorching and sudden seedling mortality."
  },
  Sugarcane: {
    icon: "🌱",
    description: "Industrial crop tracking soil water indices and harvesting timeline predictions to maximize sugar content yields.",
    focus: ["Brix level estimation", "Harvest timeline scheduling", "Biomass tracking"],
    practices: ["Trash farming (mulching)", "Smart scheduling tools"],
    bestTime: "October to December (early dry season) so it hits its critical maturation phase exactly during the sunny months for high sugar accumulation.",
    worstTime: "Mid-rainy season (July to August) because excessive rain during the early growth stage leads to poor root anchoring and low brix accumulation."
  },
  Tomato: {
    icon: "🍅",
    description: "High-yield vegetable susceptible to rapid weather changes, blight outbreaks, and moisture stress.",
    focus: ["Blight early warning systems", "Irrigation scheduling", "Heat stress resilience"],
    practices: ["Drip irrigation deployment", "Protected cultivation covers"],
    bestTime: "Cool, dry months (October to January) when cooler night temperatures naturally trigger maximum fruit set.",
    worstTime: "Peak monsoon season (July to September) due to high humidity causing severe bacterial wilt, leaf blights, and rapid fruit splitting."
  },
  Soybean: {
    icon: "🫛",
    description: "Vital legume option ideal for crop rotation strategies to restore nitrogen levels naturally into farm soils.",
    focus: ["Nitrogen fixation efficiency", "Pod development monitoring", "Rotational pattern yields"],
    practices: ["Rhizobium inoculation", "Strategic crop rotation cycles"],
    bestTime: "Late dry season to early wet season (May to June), or as a post-rice rotational crop around October to December.",
    worstTime: "Heavy rainfall peaks (August) which flood the fields, destroy nodulation capabilities, and induce widespread seed rot."
  }
};

export default function Page() {
  const params = useSearchParams();
  const cropParam = params ? params.get('crop') : null;
  const selected = cropParam && cropDetails[cropParam] ? cropDetails[cropParam] : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/" className="text-sm text-primary underline">← Back</Link>
        <h1 className="text-2xl font-bold">Crop Details</h1>
      </div>

      {selected ? (
        <section className="rounded-lg border p-6">
          <div className="mb-4 text-4xl">{selected.icon}</div>
          <h2 className="mb-2 text-xl font-semibold">{cropParam}</h2>
          <p className="mb-4 text-sm text-muted-foreground">{selected.description}</p>

          <div className="mb-4">
            <h3 className="font-semibold">Focus Areas</h3>
            <ul className="list-disc list-inside mt-2">
              {selected.focus.map((f) => (
                <li key={f} className="text-sm">{f}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Recommended Practices</h3>
            <ul className="list-disc list-inside mt-2">
              {selected.practices.map((p) => (
                <li key={p} className="text-sm">{p}</li>
              ))}
            </ul>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <strong>Best Time:</strong>
              <div className="text-sm">{selected.bestTime}</div>
            </div>
            <div>
              <strong>Worst Time:</strong>
              <div className="text-sm">{selected.worstTime}</div>
            </div>
          </div>
        </section>
      ) : (
        <section>
          <p className="mb-4">Select a crop to view details, or choose from the list below.</p>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(cropDetails).map((name) => (
              <Link
                key={name}
                href={`/sarai-crops?crop=${encodeURIComponent(name)}`}
                className="rounded border p-3 text-sm hover:bg-emerald-50"
              >
                <div className="text-lg">{cropDetails[name].icon} {name}</div>
                <div className="text-xs text-muted-foreground mt-1">{cropDetails[name].description.slice(0, 80)}...</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}