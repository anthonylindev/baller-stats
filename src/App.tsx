import './App.css'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InjuriesTab } from '@/components/injuries/InjuriesTab'
import { StatsTab } from '@/components/stats/StatsTab'

function App() {

  return (
    <main className="container mx-auto px-4 py-8">
      <Tabs defaultValue="player-stats" className="space-y-4">
        <TabsList className="justify-center bg-accent">
          <TabsTrigger value="player-stats" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Player Stats</TabsTrigger>
          <TabsTrigger value="injuries" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Injuries</TabsTrigger>
        </TabsList>
        <TabsContent value="player-stats">
          {/* {selectedPlayerId !== null ? (
            <PlayerStats playerId={selectedPlayerId} />
          ) : (
            <p className="text-center text-muted-foreground mt-8 text-lg">Select a player to view their stats.</p>
          )} */}
          <StatsTab />
        </TabsContent>
        <TabsContent value="injuries">
          <InjuriesTab />
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default App
