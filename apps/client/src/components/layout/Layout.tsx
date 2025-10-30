import { ReactNode, useState } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { PinnedSummary } from "@/components/dashboard/PinnedSummary";
import { SettingsDialog } from "@/components/dashboard/SettingsDialog";
import { mockData } from "@/data/mockData";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [autopilotOn, setAutopilotOn] = useState(mockData.user.autopilotOn);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [slippage, setSlippage] = useState(1.0);
  const [notifications, setNotifications] = useState({
    desktop: true,
    email: false,
  });

  const handleAutopilotToggle = () => {
    setAutopilotOn(!autopilotOn);
  };

  return (
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col relative">
      {/* Always show TopBar and PinnedSummary */}
      <TopBar
        autopilotOn={autopilotOn}
        onAutopilotToggle={handleAutopilotToggle}
        connectionStatus={mockData.user.connection.status}
        latency={mockData.user.connection.latencyMs}
        performance={mockData.performance}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      <main
        className="flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - (36px + 48px))" }}
      >
        {children}
      </main>

      <PinnedSummary summary={mockData.openTicketsSummary} />
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        slippage={slippage}
        onSlippageChange={setSlippage}
        notifications={notifications}
        onNotificationsChange={setNotifications}
      />
    </div>
  );
};
