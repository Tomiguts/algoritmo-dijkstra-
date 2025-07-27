import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Play, Square, Trash2, MousePointer, Link, Navigation, Target } from 'lucide-react';

const Container = styled(motion.div)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
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

const ModeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
`;

const ModeButton = styled(motion.button)`
  background: ${props => props.active ? 
    'linear-gradient(135deg, #e91e63, #9c27b0)' : 
    'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? 
    'rgba(255, 255, 255, 0.3)' : 
    'rgba(255, 255, 255, 0.2)'};
  border-radius: 10px;
  color: white;
  padding: 12px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 
      'linear-gradient(135deg, #e91e63, #9c27b0)' : 
      'rgba(255, 255, 255, 0.15)'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const NodeSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SelectorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SelectorLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  font-weight: 500;
  min-width: 50px;
`;

const NodeSelect = styled.select`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  padding: 8px 10px;
  font-size: 0.8rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #e91e63;
    background: rgba(255, 255, 255, 0.15);
  }

  option {
    background: #1a1a2e;
    color: white;
  }
`;

const SelectedNodeIndicator = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => {
    if (props.type === 'start') return 'linear-gradient(135deg, #4CAF50, #45a049)';
    if (props.type === 'end') return 'linear-gradient(135deg, #f44336, #d32f2f)';
    return 'rgba(255, 255, 255, 0.3)';
  }};
  border: 2px solid rgba(255, 255, 255, 0.5);
`;

const ActionButtonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const ActionButton = styled(motion.button)`
  background: ${props => {
    if (props.variant === 'primary') return 'linear-gradient(135deg, #4CAF50, #45a049)';
    if (props.variant === 'secondary') return 'linear-gradient(135deg, #ff9800, #f57c00)';
    if (props.variant === 'danger') return 'linear-gradient(135deg, #f44336, #d32f2f)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  padding: 12px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Instructions = styled.div`
  background: rgba(233, 30, 99, 0.1);
  border: 1px solid rgba(233, 30, 99, 0.3);
  border-radius: 10px;
  padding: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  line-height: 1.4;
`;

const InstructionTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  color: #e91e63;
`;

const ControlPanel = ({
  mode,
  setMode,
  selectedStartNode,
  setSelectedStartNode,
  selectedEndNode,
  setSelectedEndNode,
  nodes,
  onRunDijkstra,
  onClearResults,
  onClearGraph,
  isCalculating
}) => {
  const modes = [
    { id: 'node', label: 'Crear Nodos', icon: MousePointer },
    { id: 'edge', label: 'Crear Aristas', icon: Link },
    { id: 'delete', label: 'Eliminar', icon: Trash2 },
    { id: 'start', label: 'Nodo Inicio', icon: Navigation },
    { id: 'end', label: 'Nodo Destino', icon: Target }
  ];

  const getInstructions = () => {
    switch (mode) {
      case 'node':
        return {
          title: '🔵 Crear Nodos',
          text: 'Haz clic en cualquier lugar del canvas para crear un nuevo nodo.'
        };
      case 'edge':
        return {
          title: '🔗 Crear Aristas',
          text: 'Haz clic y arrastra desde un nodo hasta otro para crear una arista dirigida.'
        };
      case 'delete':
        return {
          title: '🗑️ Eliminar',
          text: 'Haz clic en cualquier nodo o arista para eliminarlo del grafo.'
        };
      case 'start':
        return {
          title: '🟢 Seleccionar Inicio',
          text: 'Haz clic en un nodo para establecerlo como punto de inicio.'
        };
      case 'end':
        return {
          title: '🔴 Seleccionar Destino',
          text: 'Haz clic en un nodo para establecerlo como punto de destino.'
        };
      default:
        return {
          title: '✋ Navegación',
          text: 'Modo de navegación. Puedes arrastrar los nodos para reorganizar el grafo.'
        };
    }
  };

  const instructions = getInstructions();

  return (
    <Container
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Section>
        <SectionTitle>
          <MousePointer size={16} />
          Modo de Interacción
        </SectionTitle>
        
        <ModeGrid style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {modes.map(({ id, label, icon: Icon }) => (
            <ModeButton
              key={id}
              active={mode === id}
              onClick={() => setMode(id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ fontSize: '0.75rem', padding: '10px 8px' }}
            >
              <Icon size={12} />
              {label}
            </ModeButton>
          ))}
        </ModeGrid>

        <Instructions>
          <InstructionTitle>{instructions.title}</InstructionTitle>
          {instructions.text}
        </Instructions>
      </Section>

      <Section>
        <SectionTitle>
          <Navigation size={16} />
          Selección de Nodos
        </SectionTitle>
        
        <NodeSelector>
          <SelectorRow>
            <SelectorLabel>Inicio:</SelectorLabel>
            <NodeSelect
              value={selectedStartNode || ''}
              onChange={(e) => setSelectedStartNode(e.target.value || null)}
            >
              <option value="">Seleccionar...</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.label}
                </option>
              ))}
            </NodeSelect>
            <SelectedNodeIndicator type="start" />
          </SelectorRow>

          <SelectorRow>
            <SelectorLabel>Destino:</SelectorLabel>
            <NodeSelect
              value={selectedEndNode || ''}
              onChange={(e) => setSelectedEndNode(e.target.value || null)}
            >
              <option value="">Seleccionar...</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.label}
                </option>
              ))}
            </NodeSelect>
            <SelectedNodeIndicator type="end" />
          </SelectorRow>
        </NodeSelector>
      </Section>

      <Section>
        <SectionTitle>
          <Play size={16} />
          Algoritmo de Dijkstra
        </SectionTitle>
        
        <ActionButtonGrid>
          <ActionButton
            variant="primary"
            onClick={onRunDijkstra}
            disabled={isCalculating || !selectedStartNode || !selectedEndNode}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCalculating ? (
              <>
                <LoadingSpinner />
                Calculando...
              </>
            ) : (
              <>
                <Play size={14} />
                Ejecutar
              </>
            )}
          </ActionButton>

          <ActionButton
            variant="secondary"
            onClick={onClearResults}
            disabled={isCalculating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Square size={14} />
            Limpiar
          </ActionButton>
        </ActionButtonGrid>
      </Section>

      <Section>
        <SectionTitle>
          <Trash2 size={16} />
          Gestión del Grafo
        </SectionTitle>
        
        <ActionButton
          variant="danger"
          onClick={onClearGraph}
          disabled={isCalculating}
          style={{ width: '100%' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trash2 size={14} />
          Eliminar Todo el Grafo
        </ActionButton>
      </Section>
    </Container>
  );
};

export default ControlPanel;