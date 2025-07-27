class DijkstraEngine {
  constructor(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
    this.graph = this.buildAdjacencyList();
  }

  // Construir lista de adyacencia del grafo dirigido
  buildAdjacencyList() {
    const graph = {};
    
    // Inicializar todos los nodos
    this.nodes.forEach(node => {
      graph[node.id] = [];
    });
    
    // Agregar las aristas dirigidas
    this.edges.forEach(edge => {
      if (graph[edge.from]) {
        graph[edge.from].push({
          to: edge.to,
          weight: edge.weight
        });
      }
    });
    
    return graph;
  }

  // Implementación del algoritmo de Dijkstra
  async findShortestPath(startNodeId, endNodeId) {
    // Validaciones
    if (!this.graph[startNodeId] || !this.graph[endNodeId]) {
      throw new Error('Nodo de inicio o destino no existe');
    }

    // Inicializar distancias y conjunto de nodos visitados
    const distances = {};
    const previous = {};
    const visited = new Set();
    const unvisited = new Set();

    // Inicializar todas las distancias como infinito
    this.nodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });

    // La distancia del nodo inicial a sí mismo es 0
    distances[startNodeId] = 0;

    while (unvisited.size > 0) {
      // Encontrar el nodo no visitado con la menor distancia
      let currentNode = null;
      let minDistance = Infinity;
      
      for (const nodeId of unvisited) {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          currentNode = nodeId;
        }
      }

      // Si no hay nodo alcanzable, terminar
      if (currentNode === null || distances[currentNode] === Infinity) {
        break;
      }

      // Marcar el nodo actual como visitado
      unvisited.delete(currentNode);
      visited.add(currentNode);

      // Si llegamos al nodo destino, podemos terminar
      if (currentNode === endNodeId) {
        break;
      }

      // Examinar todos los vecinos del nodo actual
      const neighbors = this.graph[currentNode] || [];
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.to)) {
          // Calcular la nueva distancia a través del nodo actual
          const newDistance = distances[currentNode] + neighbor.weight;
          
          // Si encontramos un camino más corto, actualizarlo
          if (newDistance < distances[neighbor.to]) {
            distances[neighbor.to] = newDistance;
            previous[neighbor.to] = currentNode;
          }
        }
      }
    }

    // Reconstruir el camino más corto
    const path = this.reconstructPath(previous, startNodeId, endNodeId);
    
    // Verificar si se encontró un camino
    if (path.length === 0 || distances[endNodeId] === Infinity) {
      return {
        success: false,
        message: 'No hay camino entre los nodos seleccionados',
        distance: Infinity,
        path: [],
        distances: distances,
        visited: Array.from(visited)
      };
    }

    return {
      success: true,
      message: `Camino más corto encontrado con distancia ${distances[endNodeId]}`,
      distance: distances[endNodeId],
      path: path,
      distances: distances,
      visited: Array.from(visited)
    };
  }

  // Reconstruir el camino desde el nodo destino hasta el origen
  reconstructPath(previous, startNodeId, endNodeId) {
    const path = [];
    let currentNode = endNodeId;

    // Si no hay camino al nodo destino
    if (previous[currentNode] === null && currentNode !== startNodeId) {
      return [];
    }

    // Reconstruir el camino hacia atrás
    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = previous[currentNode];
    }

    // Verificar que el camino comience en el nodo de inicio
    if (path[0] !== startNodeId) {
      return [];
    }

    return path;
  }

  // Método auxiliar para obtener información del grafo
  getGraphInfo() {
    const nodeCount = this.nodes.length;
    const edgeCount = this.edges.length;
    const isConnected = this.isGraphConnected();
    
    return {
      nodeCount,
      edgeCount,
      isConnected,
      nodes: this.nodes.map(n => ({ id: n.id, label: n.label })),
      edges: this.edges.map(e => ({ 
        from: e.from, 
        to: e.to, 
        weight: e.weight 
      }))
    };
  }

  // Verificar si el grafo es conexo (considerando que es dirigido)
  isGraphConnected() {
    if (this.nodes.length === 0) return true;
    
    // Para un grafo dirigido, verificamos si hay un camino desde el primer nodo
    // a todos los demás nodos
    const startNode = this.nodes[0].id;
    const reachable = this.getReachableNodes(startNode);
    
    return reachable.size === this.nodes.length;
  }

  // Obtener todos los nodos alcanzables desde un nodo dado
  getReachableNodes(startNodeId) {
    const reachable = new Set();
    const stack = [startNodeId];
    
    while (stack.length > 0) {
      const currentNode = stack.pop();
      
      if (!reachable.has(currentNode)) {
        reachable.add(currentNode);
        
        const neighbors = this.graph[currentNode] || [];
        for (const neighbor of neighbors) {
          if (!reachable.has(neighbor.to)) {
            stack.push(neighbor.to);
          }
        }
      }
    }
    
    return reachable;
  }

  // Variante simplificada del algoritmo (para propósitos educativos)
  async findShortestPathSimple(startNodeId, endNodeId) {
    console.log('🚀 Ejecutando variante simplificada de Dijkstra');
    
    // Esta es una versión más didáctica del algoritmo
    const distances = { [startNodeId]: 0 };
    const previous = {};
    const queue = [startNodeId];
    const visited = new Set();

    console.log(`📍 Iniciando desde: ${startNodeId}, destino: ${endNodeId}`);

    while (queue.length > 0) {
      // Encontrar el nodo con menor distancia en la cola
      let currentIndex = 0;
      for (let i = 1; i < queue.length; i++) {
        if ((distances[queue[i]] || Infinity) < (distances[queue[currentIndex]] || Infinity)) {
          currentIndex = i;
        }
      }
      
      const currentNode = queue.splice(currentIndex, 1)[0];
      
      if (visited.has(currentNode)) continue;
      visited.add(currentNode);
      
      console.log(`🔍 Visitando nodo: ${currentNode}, distancia actual: ${distances[currentNode]}`);

      if (currentNode === endNodeId) {
        console.log('🎯 ¡Destino alcanzado!');
        break;
      }

      // Explorar vecinos
      const neighbors = this.graph[currentNode] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.to)) {
          const newDistance = distances[currentNode] + neighbor.weight;
          
          if (!distances[neighbor.to] || newDistance < distances[neighbor.to]) {
            distances[neighbor.to] = newDistance;
            previous[neighbor.to] = currentNode;
            queue.push(neighbor.to);
            
            console.log(`  ➡️ Actualizando ${neighbor.to}: distancia ${newDistance}`);
          }
        }
      }
    }

    const path = this.reconstructPath(previous, startNodeId, endNodeId);
    
    return {
      success: path.length > 0,
      message: path.length > 0 ? 
        `Camino encontrado con distancia ${distances[endNodeId]}` : 
        'No hay camino disponible',
      distance: distances[endNodeId] || Infinity,
      path: path,
      distances: distances,
      visited: Array.from(visited)
    };
  }
}

export default DijkstraEngine;