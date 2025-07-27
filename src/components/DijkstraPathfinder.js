import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GraphCanvas from './GraphCanvas';
import ControlPanel from './ControlPanel';
import ResultsPanel from './ResultsPanel';
import NodeEdgeTable from './NodeEdgeTable';
import DijkstraEngine from './DijkstraEngine';

const Container = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr 300px;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  gap: 1px;
`;

const LeftPanel = styled(motion.div)`
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const CenterCanvas = styled.div`
  background: rgba(15, 15, 35, 0.8);
  position: relative;
  overflow: hidden;
`;

const RightPanel = styled(motion.div)`
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Header = styled(motion.div)`
  padding: 20px;
  text-align: center;
  background: linear-gradient(135deg, #e91e63, #9c27b0);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 0.85rem;
  opacity: 0.9;
  font-weight: 400;
  line-height: 1.3;
`;

const DijkstraPathfinder = () => {
  // Estados del grafo
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // Estados de la interfaz
  const [selectedStartNode, setSelectedStartNode] = useState(null);
  const [selectedEndNode, setSelectedEndNode] = useState(null);
  const [mode, setMode] = useState('node'); // 'node' o 'edge'
  
  // Estados del algoritmo
  const [pathResult, setPathResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [shortestPath, setShortestPath] = useState([]);
  const [distances, setDistances] = useState({});

  // Referencias
  const canvasRef = useRef(null);
  const nodeIdCounter = useRef(1);

  // Funciones para manejar nodos
  const addNode = useCallback((x, y, label = null) => {
    const newNode = {
      id: `node_${nodeIdCounter.current}`,
      label: label || `N${nodeIdCounter.current}`,
      x: x,
      y: y
    };
    nodeIdCounter.current++;
    setNodes(prev => [...prev, newNode]);
    return newNode;
  }, []);

  const updateNodePosition = useCallback((nodeId, x, y) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, x, y } : node
    ));
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setEdges(prev => prev.filter(edge => 
      edge.from !== nodeId && edge.to !== nodeId
    ));
    
    // Limpiar selecciones si el nodo eliminado estaba seleccionado
    if (selectedStartNode === nodeId) setSelectedStartNode(null);
    if (selectedEndNode === nodeId) setSelectedEndNode(null);
  }, [selectedStartNode, selectedEndNode]);

  // Funciones para manejar aristas
  const addEdge = useCallback((fromId, toId, weight = 1) => {
    // Evitar aristas duplicadas
    const existingEdge = edges.find(edge => 
      edge.from === fromId && edge.to === toId
    );
    
    if (existingEdge) return;

    const newEdge = {
      id: `edge_${fromId}_${toId}`,
      from: fromId,
      to: toId,
      weight: weight
    };
    
    setEdges(prev => [...prev, newEdge]);
  }, [edges]);

  const updateEdgeWeight = useCallback((edgeId, weight) => {
    setEdges(prev => prev.map(edge => 
      edge.id === edgeId ? { ...edge, weight: parseFloat(weight) || 1 } : edge
    ));
  }, []);

  const deleteEdge = useCallback((edgeId) => {
    setEdges(prev => prev.filter(edge => edge.id !== edgeId));
  }, []);

  // Función para ejecutar Dijkstra
  const runDijkstra = useCallback(async () => {
    if (!selectedStartNode || !selectedEndNode) {
      alert('Por favor selecciona nodos de inicio y destino');
      return;
    }

    if (selectedStartNode === selectedEndNode) {
      alert('El nodo de inicio y destino deben ser diferentes');
      return;
    }

    setIsCalculating(true);
    
    try {
      const engine = new DijkstraEngine(nodes, edges);
      const result = await engine.findShortestPath(selectedStartNode, selectedEndNode);
      
      setPathResult(result);
      setShortestPath(result.path || []);
      setDistances(result.distances || {});
    } catch (error) {
      console.error('Error ejecutando Dijkstra:', error);
      alert('Error al calcular la ruta: ' + error.message);
    } finally {
      setIsCalculating(false);
    }
  }, [nodes, edges, selectedStartNode, selectedEndNode]);

  // Función para limpiar resultados
  const clearResults = useCallback(() => {
    setPathResult(null);
    setShortestPath([]);
    setDistances({});
    setSelectedStartNode(null);
    setSelectedEndNode(null);
  }, []);

  // Función para limpiar todo el grafo
  const clearGraph = useCallback(() => {
    setNodes([]);
    setEdges([]);
    clearResults();
    nodeIdCounter.current = 1;
  }, [clearResults]);

  return (
    <Container>
      <LeftPanel
        initial={{ x: -350 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Title>Dijkstra Pathfinder</Title>
          <Subtitle>Encuentra el camino más corto</Subtitle>
        </Header>
        
        <ControlPanel
          mode={mode}
          setMode={setMode}
          selectedStartNode={selectedStartNode}
          setSelectedStartNode={setSelectedStartNode}
          selectedEndNode={selectedEndNode}
          setSelectedEndNode={setSelectedEndNode}
          nodes={nodes}
          onRunDijkstra={runDijkstra}
          onClearResults={clearResults}
          onClearGraph={clearGraph}
          isCalculating={isCalculating}
        />

        
      </LeftPanel>

      <CenterCanvas>
        <GraphCanvas
          ref={canvasRef}
          nodes={nodes}
          edges={edges}
          mode={mode}
          selectedStartNode={selectedStartNode}
          selectedEndNode={selectedEndNode}
          shortestPath={shortestPath}
          onAddNode={addNode}
          onUpdateNodePosition={updateNodePosition}
          onDeleteNode={deleteNode}
          onAddEdge={addEdge}
          onNodeSelect={(nodeId) => {
            if (mode === 'start') setSelectedStartNode(nodeId);
            else if (mode === 'end') setSelectedEndNode(nodeId);
            else if (mode === 'delete') deleteNode(nodeId);
          }}
          onEdgeSelect={(edgeId) => {
            if (mode === 'delete') deleteEdge(edgeId);
          }}
        />
      </CenterCanvas>

      <RightPanel
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResultsPanel
          pathResult={pathResult}
          shortestPath={shortestPath}
          distances={distances}
          nodes={nodes}
          isCalculating={isCalculating}
        />
      </RightPanel>
    </Container>
  );
};

export default DijkstraPathfinder;