import { Button, Tabs } from "@heroui/react";
import { useNodesState, useEdgesState, type Node, type Edge } from '@xyflow/react';
import { useState } from 'react';
import AutomataEditor from './components/AutomataEditor';
import './App.css';
import AlgorithmVisualizer from "./components/AlgorithmVisualizer";

const initialNodes: Node[] = [
  {
    id: 'S0',
    type: 'state',
    position: { x: 250, y: 250 },
    data: { label: 'S0', isInitial: true, isFinal: false },
  },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [alphabet, setAlphabet] = useState<string[]>(['a', 'b']);
  const [selectedTab, setSelectedTab] = useState<string>("editor");

  return (
    <>
      <div className="w-full h-full overflow-hidden bg-zinc-50 text-zinc-900 relative">
        <Tabs
          className="w-full h-full"
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key.toString())}
        >
          <div className="absolute top-4 right-4 z-50">
            <Tabs.ListContainer>
              <Tabs.List aria-label="Options" className="bg-white/80 backdrop-blur-md p-1 rounded-lg border border-zinc-200 shadow-sm">
                <Tabs.Tab id="editor" className="px-4 py-2 text-sm rounded-md data-[selected=true]:bg-zinc-100 transition-colors cursor-pointer font-medium">Éditeur</Tabs.Tab>
                <Tabs.Tab id="visualizer" className="px-4 py-2 text-sm rounded-md data-[selected=true]:bg-zinc-100 transition-colors cursor-pointer font-medium">Visualisation</Tabs.Tab>
                
              </Tabs.List>
            </Tabs.ListContainer>
          </div>
        </Tabs>

        <div className={`w-full h-full absolute top-0 left-0 ${selectedTab === 'editor' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
          <AutomataEditor
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setNodes={setNodes}
            setEdges={setEdges}
            alphabet={alphabet}
            setAlphabet={setAlphabet}
          /> 

         </div>

        <div className={`w-full h-full absolute top-0 left-0 ${selectedTab === 'visualizer' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
          <AlgorithmVisualizer initialNodes={nodes} initialEdges={edges} />
        </div>
     
          <a href="https://github.com/Zakariaaben/automate-reduits" target="_blank" rel="noopener noreferrer" className="py-2 fixed z-10 top-0 right-0 -translate-x-1/2 flex items-center justify-center gap-2 ">
            <Button>
              @zakariaaben
            </Button>
          </a>

      </div>

    </>
  )
}

export default App
