import React, { useRef, useEffect, useState, forwardRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: 
    radial-gradient(circle at 20% 50%, rgba(233, 30, 99, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  overflow: hidden;
  cursor: ${props => props.mode === 'node' ? 'crosshair' : 'default'};
`;

const NodeContainer = styled(motion.div)`
  position: absolute;
  z-index: 2;
  width: 40px;
  height: 40px;
`;

const Node = styled(motion.div)`
  width: ${props => props.isSelected ? '50px' : '40px'};
  height: ${props => props.isSelected ? '50px' : '40px'};
  border-radius: 50%;
  background: ${props => {
    if (props.isStart) return 'linear-gradient(135deg, #4CAF50, #45a049)';
    if (props.isEnd) return 'linear-gradient(135deg, #f44336, #d32f2f)';
    if (props.isInPath) return 'linear-gradient(135deg, #FF9800, #F57C00)';
    return 'linear-gradient(135deg, #e91e63, #9c27b0)';
  }};
  border: 3px solid ${props => {
    if (props.isSelected) return '#ffffff';
    if (props.isStart || props.isEnd || props.isInPath) return 'rgba(255,255,255,0.8)';
    return 'rgba(255,255,255,0.3)';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  box-shadow: 
    0 4px 20px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.2);
  transition: all 0.3s ease;
  user-select: none;
  transform: ${props => props.isSelected ? 'scale(1.25)' : 'scale(1)'};

  &:hover {
    transform: ${props => props.isSelected ? 'scale(1.35)' : 'scale(1.1)'};
    box-shadow: 
      0 6px 25px rgba(0,0,0,0.4),
      inset 0 1px 0 rgba(255,255,255,0.3);
  }
`;

const NodeLabel = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
`;

const EdgeWeight = styled(motion.div)`
  position: absolute;
  background: rgba(233, 30, 99, 0.9);
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: bold;
  pointer-events: none;
  z-index: 3;
  border: 1px solid rgba(255,255,255,0.3);
`;

const ModeIndicator = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(255,255,255,0.2);
  z-index: 10;
`;

const ConnectionLine = styled.div`
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, #e91e63, #9c27b0);
  pointer-events: none;
  z-index: 1;
  opacity: 0.7;
  transform-origin: left center;
`;

const ArrowHead = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 12px solid;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left-color: ${props => props.color || '#9c27b0'};
  pointer-events: none;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
`;

const MultiEdgeIndicator = styled.div`
  position: absolute;
  background: rgba(255, 193, 7, 0.9);
  color: #000;
  padding: 2px 5px;
  border-radius: 10px;
  font-size: 0.6rem;
  font-weight: bold;
  pointer-events: none;
  z-index: 4;
  border: 1px solid rgba(255,255,255,0.5);
`;

const GraphCanvas = forwardRef(({
  nodes,
  edges,
  mode,
  selectedStartNode,
  selectedEndNode,
  shortestPath,
  onAddNode,
  onUpdateNodePosition,
  onDeleteNode,
  onAddEdge,
  onNodeSelect,
  onEdgeSelect
}, ref) => {
  const containerRef = useRef(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showConnection, setShowConnection] = useState(false);

  // Manejar clics en el canvas
  const handleCanvasClick = (e) => {
    if (mode !== 'node') return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Verificar que no se haga clic sobre un nodo existente
    const clickedOnNode = nodes.some(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance < 25;
    });
    
    if (!clickedOnNode) {
      onAddNode(x, y);
    }
  };

  // Manejar movimiento del mouse
  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const newMousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setMousePosition(newMousePos);

    // Si estamos arrastrando un nodo
    if (draggedNode) {
      const newX = newMousePos.x - dragOffset.x;
      const newY = newMousePos.y - dragOffset.y;
      onUpdateNodePosition(draggedNode, newX, newY);
    }
  };

  // Manejar inicio de arrastre
  const handleMouseDown = (e, nodeId) => {
    e.preventDefault();
    e.stopPropagation();

    if (mode === 'edge') {
      setConnectionStart(nodeId);
      setShowConnection(true);
    } else if (mode === 'start' || mode === 'end') {
      onNodeSelect(nodeId);
    } else if (mode === 'delete') {
      onNodeSelect(nodeId);
    } else if (mode === 'node') {
      // Iniciar arrastre
      const rect = containerRef.current.getBoundingClientRect();
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        setDraggedNode(nodeId);
        setDragOffset({
          x: (e.clientX - rect.left) - node.x,
          y: (e.clientY - rect.top) - node.y
        });
      }
    }
  };

  // Manejar final de arrastre o conexión
  const handleMouseUp = (e, nodeId) => {
    if (mode === 'edge' && connectionStart && connectionStart !== nodeId) {
      const weight = prompt('Ingresa el peso de la arista:', '1');
      if (weight !== null && !isNaN(weight) && parseFloat(weight) > 0) {
        onAddEdge(connectionStart, nodeId, parseFloat(weight));
      }
    }
    
    // Terminar arrastre
    setDraggedNode(null);
    setConnectionStart(null);
    setShowConnection(false);
  };

  // Escuchar eventos globales de mouse
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDraggedNode(null);
      setConnectionStart(null);
      setShowConnection(false);
    };

    if (draggedNode || connectionStart) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [draggedNode, connectionStart]);

  // Manejar doble clic para eliminar nodo
  const handleNodeDoubleClick = (nodeId) => {
    if (window.confirm('¿Eliminar este nodo?')) {
      onDeleteNode(nodeId);
    }
  };

  // Obtener el texto del modo actual
  const getModeText = () => {
    switch (mode) {
      case 'node': return '🔵 Crear Nodos';
      case 'edge': return '🔗 Crear Aristas';
      case 'delete': return '🗑️ Eliminar';
      case 'start': return '🟢 Seleccionar Inicio';
      case 'end': return '🔴 Seleccionar Destino';
      default: return '✋ Navegación';
    }
  };

  // Calcular offset para multiples aristas entre los mismos nodos
  const getEdgeOffset = (edge, edgeIndex) => {
    const sameRouteEdges = edges.filter(e => 
      (e.from === edge.from && e.to === edge.to) ||
      (e.from === edge.to && e.to === edge.from)
    );
    
    if (sameRouteEdges.length === 1) return 0;
    
    const totalEdges = sameRouteEdges.length;
    const centerIndex = (totalEdges - 1) / 2;
    const currentIndex = sameRouteEdges.findIndex(e => e.id === edge.id);
    
    return (currentIndex - centerIndex) * 15; // 15px offset between parallel edges
  };

  // Calcular posición y rotación de las aristas (actualizado para multigrafo)
  const getEdgeStyle = (edge, edgeIndex) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return null;
    
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    const offset = getEdgeOffset(edge, edgeIndex);
    
    // Calcular posición perpendicular para aristas paralelas
    const perpAngle = (angle + 90) * (Math.PI / 180);
    const offsetX = Math.cos(perpAngle) * offset;
    const offsetY = Math.sin(perpAngle) * offset;
    
    const isInShortestPath = shortestPath.length > 1 && 
      shortestPath.includes(edge.from) && 
      shortestPath.includes(edge.to) &&
      shortestPath.indexOf(edge.to) === shortestPath.indexOf(edge.from) + 1;
    
    return {
      left: fromNode.x + offsetX,
      top: fromNode.y + offsetY,
      width: length - 20,
      transform: `rotate(${angle}deg)`,
      background: isInShortestPath
        ? 'linear-gradient(90deg, #4CAF50, #45a049)'
        : 'linear-gradient(90deg, #e91e63, #9c27b0)',
      color: isInShortestPath ? '#4CAF50' : '#9c27b0',
      cursor: mode === 'delete' ? 'pointer' : 'default'
    };
  };

  // Calcular posición de la flecha (actualizado)
  const getArrowPosition = (edge, edgeIndex) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return null;
    
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    const offset = getEdgeOffset(edge, edgeIndex);
    
    // Calcular posición perpendicular para aristas paralelas
    const perpAngle = (angle + 90) * (Math.PI / 180);
    const offsetX = Math.cos(perpAngle) * offset;
    const offsetY = Math.sin(perpAngle) * offset;
    
    // Posicionar la flecha cerca del nodo destino
    const arrowDistance = length - 30;
    const arrowX = fromNode.x + (dx / length) * arrowDistance + offsetX;
    const arrowY = fromNode.y + (dy / length) * arrowDistance + offsetY;
    
    const isInShortestPath = shortestPath.length > 1 && 
      shortestPath.includes(edge.from) && 
      shortestPath.includes(edge.to) &&
      shortestPath.indexOf(edge.to) === shortestPath.indexOf(edge.from) + 1;
    
    return {
      left: arrowX,
      top: arrowY,
      transform: `rotate(${angle}deg)`,
      color: isInShortestPath ? '#4CAF50' : '#9c27b0'
    };
  };

  // Calcular posición del peso de la arista (actualizado)
  const getEdgeWeightPosition = (edge, edgeIndex) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return null;
    
    const offset = getEdgeOffset(edge, edgeIndex);
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Calcular posición perpendicular para aristas paralelas
    const perpAngle = (angle + 90) * (Math.PI / 180);
    const offsetX = Math.cos(perpAngle) * offset;
    const offsetY = Math.sin(perpAngle) * offset;
    
    return {
      left: (fromNode.x + toNode.x) / 2 - 10 + offsetX,
      top: (fromNode.y + toNode.y) / 2 - 10 + offsetY
    };
  };

  // Detectar clic en arista
  const handleEdgeClick = (e, edgeId) => {
    if (mode === 'delete') {
      e.stopPropagation();
      if (onEdgeSelect) {
        onEdgeSelect(edgeId);
      }
    }
  };

  // Contar aristas múltiples entre los mismos nodos
  const getMultiEdgeCount = (fromId, toId) => {
    return edges.filter(e => 
      (e.from === fromId && e.to === toId) ||
      (e.from === toId && e.to === fromId)
    ).length;
  };

  // Dibujar la línea de conexión temporal
  const renderConnectionLine = () => {
    if (!showConnection || !connectionStart) return null;
    
    const startNode = nodes.find(n => n.id === connectionStart);
    if (!startNode) return null;
    
    const dx = mousePosition.x - startNode.x;
    const dy = mousePosition.y - startNode.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    return (
      <ConnectionLine
        style={{
          left: startNode.x,
          top: startNode.y - 1,
          width: length,
          transform: `rotate(${angle}deg)`,
          background: 'linear-gradient(90deg, #ffeb3b, #ffc107)',
          opacity: 0.8
        }}
      />
    );
  };

  return (
    <CanvasContainer
      ref={containerRef}
      mode={mode}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
    >
      <ModeIndicator
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {getModeText()}
      </ModeIndicator>

      {/* Renderizar aristas */}
      {edges.map((edge, index) => {
        const style = getEdgeStyle(edge, index);
        if (!style) return null;
        
        return (
          <ConnectionLine
            key={edge.id}
            style={style}
            onClick={(e) => handleEdgeClick(e, edge.id)}
          />
        );
      })}

      {/* Renderizar flechas de las aristas */}
      {edges.map((edge, index) => {
        const arrowStyle = getArrowPosition(edge, index);
        const edgeStyle = getEdgeStyle(edge, index);
        if (!arrowStyle || !edgeStyle) return null;
        
        return (
          <ArrowHead
            key={`arrow_${edge.id}`}
            style={arrowStyle}
            color={edgeStyle.color}
            onClick={(e) => handleEdgeClick(e, edge.id)}
          />
        );
      })}

      {/* Renderizar pesos de las aristas */}
      {edges.map((edge, index) => {
        const position = getEdgeWeightPosition(edge, index);
        if (!position) return null;
        
        return (
          <EdgeWeight
            key={`weight_${edge.id}`}
            style={position}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => handleEdgeClick(e, edge.id)}
          >
            {edge.weight}
          </EdgeWeight>
        );
      })}

      {/* Renderizar indicadores de aristas múltiples */}
      {edges.map((edge, index) => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return null;
        
        const multiCount = getMultiEdgeCount(edge.from, edge.to);
        if (multiCount <= 1) return null;
        
        const position = getEdgeWeightPosition(edge, index);
        if (!position) return null;
        
        // Solo mostrar el indicador en la primera arista de cada grupo
        const isFirstOfGroup = edges.findIndex(e => 
          (e.from === edge.from && e.to === edge.to) ||
          (e.from === edge.to && e.to === edge.from)
        ) === edges.findIndex(e => e.id === edge.id);
        
        if (!isFirstOfGroup) return null;
        
        return (
          <MultiEdgeIndicator
            key={`multi_${edge.from}_${edge.to}`}
            style={{
              left: position.left + 20,
              top: position.top - 15
            }}
          >
            ×{multiCount}
          </MultiEdgeIndicator>
        );
      })}

      {/* Línea de conexión temporal */}
      {renderConnectionLine()}

      {/* Renderizar nodos */}
      {nodes.map(node => (
        <NodeContainer
          key={node.id}
          style={{ 
            left: node.x - 20, 
            top: node.y - 20
          }}
        >
          <Node
            isStart={selectedStartNode === node.id}
            isEnd={selectedEndNode === node.id}
            isInPath={shortestPath.includes(node.id)}
            isSelected={selectedStartNode === node.id || selectedEndNode === node.id}
            isDragging={draggedNode === node.id}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
            onMouseUp={(e) => handleMouseUp(e, node.id)}
            onDoubleClick={() => mode === 'delete' ? null : handleNodeDoubleClick(node.id)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              cursor: mode === 'delete' ? 'pointer' : (draggedNode === node.id ? 'grabbing' : 'grab')
            }}
          >
            {node.label}
            <NodeLabel>{node.label}</NodeLabel>
          </Node>
        </NodeContainer>
      ))}
    </CanvasContainer>
  );
});

export default GraphCanvas;