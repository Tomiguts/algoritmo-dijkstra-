import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Route, MapPin, Clock, Target, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const Container = styled(motion.div)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  overflow-y: auto;
`;

const Section = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const SectionTitle = styled.h3`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  opacity: 0.3;
`;

const ResultCard = styled(motion.div)`
  background: ${props => props.success ? 
    'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(69, 160, 73, 0.2))' : 
    'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(211, 47, 47, 0.2))'};
  border: 1px solid ${props => props.success ? 
    'rgba(76, 175, 80, 0.4)' : 
    'rgba(244, 67, 54, 0.4)'};
  border-radius: 12px;
  padding: 20px;
  color: white;
  margin-bottom: 15px;
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const ResultIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.success ? '#4CAF50' : '#f44336'};
`;

const ResultTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const ResultMessage = styled.p`
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
  line-height: 1.4;
`;

const PathContainer = styled.div`
  margin-top: 15px;
`;

const PathTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.8);
`;

const PathNodes = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
`;

const PathNode = styled.div`
  background: linear-gradient(135deg, #FF9800, #F57C00);
  color: white;
  padding: 4px 8px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const PathArrow = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 15px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #e91e63;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

const DistanceTable = styled.div`
  margin-top: 15px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.8rem;
  
  &:last-child {
    border-bottom: none;
    border-radius: 0 0 8px 8px;
  }

  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const NodeLabel = styled.div`
  color: rgba(255, 255, 255, 0.9);
`;

const DistanceValue = styled.div`
  color: ${props => props.isInfinite ? '#f44336' : '#4CAF50'};
  font-weight: 600;
  text-align: right;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #e91e63;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(233, 30, 99, 0.3);
  border-top: 3px solid #e91e63;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TipSection = styled.div`
  background: rgba(156, 39, 176, 0.1);
  border: 1px solid rgba(156, 39, 176, 0.3);
  border-radius: 10px;
  padding: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  line-height: 1.4;
`;

const TipTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  color: #9c27b0;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ResultsPanel = ({ 
  pathResult, 
  shortestPath, 
  distances, 
  nodes, 
  isCalculating 
}) => {
  const getNodeLabel = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.label : nodeId;
  };

  const renderPathVisualization = () => {
    if (!shortestPath || shortestPath.length === 0) return null;

    return (
      <PathContainer>
        <PathTitle>🛤️ Camino Más Corto:</PathTitle>
        <PathNodes>
          {shortestPath.map((nodeId, index) => (
            <React.Fragment key={nodeId}>
              <PathNode>{getNodeLabel(nodeId)}</PathNode>
              {index < shortestPath.length - 1 && (
                <PathArrow>→</PathArrow>
              )}
            </React.Fragment>
          ))}
        </PathNodes>
      </PathContainer>
    );
  };

  const renderDistanceTable = () => {
    if (!distances || Object.keys(distances).length === 0) return null;

    return (
      <DistanceTable>
        <TableHeader>
          <div>Nodo</div>
          <div>Distancia</div>
        </TableHeader>
        {Object.entries(distances).map(([nodeId, distance]) => (
          <TableRow key={nodeId}>
            <NodeLabel>{getNodeLabel(nodeId)}</NodeLabel>
            <DistanceValue isInfinite={distance === Infinity}>
              {distance === Infinity ? '∞' : distance.toFixed(2)}
            </DistanceValue>
          </TableRow>
        ))}
      </DistanceTable>
    );
  };

  if (isCalculating) {
    return (
      <Container
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Section>
          <LoadingState>
            <LoadingSpinner />
            Ejecutando algoritmo de Dijkstra...
          </LoadingState>
        </Section>
      </Container>
    );
  }

  if (!pathResult) {
    return (
      <Container
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Section>
          <SectionTitle>
            <Route size={16} />
            Resultados
          </SectionTitle>
          <EmptyState>
            <EmptyIcon>🎯</EmptyIcon>
            <div>
              Los resultados del algoritmo aparecerán aquí después de ejecutar Dijkstra
            </div>
          </EmptyState>
        </Section>

        <TipSection>
          <TipTitle>
            <TrendingUp size={14} />
            Cómo usar:
          </TipTitle>
          1. Crea nodos haciendo clic en el canvas<br/>
          2. Conecta nodos con aristas dirigidas<br/>
          3. Selecciona nodos de inicio y destino<br/>
          4. Ejecuta el algoritmo de Dijkstra<br/>
          5. Observa el camino más corto resaltado
        </TipSection>
      </Container>
    );
  }

  return (
    <Container
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Section>
        <SectionTitle>
          <Route size={16} />
          Resultado del Algoritmo
        </SectionTitle>

        <ResultCard 
          success={pathResult.success}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ResultHeader>
            <ResultIcon success={pathResult.success}>
              {pathResult.success ? 
                <CheckCircle size={14} /> : 
                <XCircle size={14} />
              }
            </ResultIcon>
            <ResultTitle>
              {pathResult.success ? '¡Camino Encontrado!' : 'Sin Solución'}
            </ResultTitle>
          </ResultHeader>
          <ResultMessage>{pathResult.message}</ResultMessage>
          
          {pathResult.success && renderPathVisualization()}
        </ResultCard>

        {pathResult.success && (
          <StatsGrid>
            <StatCard>
              <StatValue>
                {pathResult.distance === Infinity ? '∞' : pathResult.distance.toFixed(2)}
              </StatValue>
              <StatLabel>Distancia Total</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatValue>{shortestPath.length}</StatValue>
              <StatLabel>Nodos en Ruta</StatLabel>
            </StatCard>
          </StatsGrid>
        )}
      </Section>

      <Section>
        <SectionTitle>
          <MapPin size={16} />
          Tabla de Distancias
        </SectionTitle>
        
        {distances && Object.keys(distances).length > 0 ? 
          renderDistanceTable() : 
          <EmptyState>
            <div>No hay datos de distancias disponibles</div>
          </EmptyState>
        }
      </Section>

      <TipSection>
        <TipTitle>
          <Target size={14} />
          Sobre el Algoritmo:
        </TipTitle>
        El algoritmo de Dijkstra encuentra el camino más corto desde un nodo origen 
        hasta todos los demás nodos en un grafo con pesos no negativos. Los nodos 
        en verde indican el camino óptimo encontrado.
      </TipSection>
    </Container>
  );
};

export default ResultsPanel;