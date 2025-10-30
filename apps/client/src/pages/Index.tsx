import { useState, useEffect } from "react";
import { PluginsPanel } from "@/components/dashboard/PluginsPanel";
import { PotentialMarkets } from "@/components/dashboard/PotentialMarkets";
import { ActiveTickets } from "@/components/dashboard/ActiveTickets";
import { mockData } from "@/data/mockData";

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light");
  }, []);

  const handlePluginToggle = (id: string) => {
    console.log("Toggle plugin:", id);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="mx-auto p-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Plugins & Filters */}
        <aside className="lg:col-span-3">
          <PluginsPanel
            plugins={mockData.plugins}
            onPluginToggle={handlePluginToggle}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
          />
        </aside>

        {/* Center: Potential Markets */}
        <section className="lg:col-span-5">
          <PotentialMarkets
            markets={mockData.potentialMarkets}
            selectedCategories={selectedCategories}
          />
        </section>

        {/* Right: Active Tickets */}
        <aside className="lg:col-span-4">
          <ActiveTickets tickets={mockData.activeTickets} />
        </aside>
      </div>
    </div>
  );
};

export default Index;
