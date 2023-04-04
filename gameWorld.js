const width = 100;
const height = 100;

const gameWorldContainer = document.createElement("div");
const terrainTypes = ["grass", "water", "mountain", "desert"];
const resourceTypes = ["wood", "stone", "food", "water"];
const dangerTypes = ["predator", ""];

function createGameWorld() {


    const randomElement = (arr) => {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    const createPredatorAgent = (x, y) => {
        const predator = document.createElement("div");
        predator.className = "predator";
        predator.style.width = "16px";
        predator.style.height = "16px";
        predator.dataset.x = x;
        predator.dataset.y = y;
        return predator;
    };

    const createWildlifeAgent = (x, y) => {
        const wildlife = document.createElement("div");
        wildlife.className = "wildlife";
        wildlife.style.width = "16px";
        wildlife.style.height = "16px";
        wildlife.dataset.x = x;
        wildlife.dataset.y = y;
        return wildlife;
    };

    
    gameWorldContainer.id = "gameWorld";
    gameWorldContainer.style.width = `${width * 16}px`;
    gameWorldContainer.style.height = `${height * 16}px`;
    gameWorldContainer.style.display = "grid";
    gameWorldContainer.style.gridTemplateColumns = `repeat(${width}, 16px)`;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const terrain = randomElement(terrainTypes);
            const resource = Math.random() < 0.2 ? randomElement(resourceTypes) : null;
            const danger = Math.random() < 0.02 ? randomElement(dangerTypes) : null;

            const cell = document.createElement("div");
            cell.className = `cell ${terrain}`;
            if (resource) {
                cell.classList.add(resource);
            }
            cell.style.width = "16px";
            cell.style.height = "16px";
            cell.dataset.x = x;
            cell.dataset.y = y;

            if (danger === "predator") {
                const predator = createPredatorAgent(x, y);
                gameWorldContainer.appendChild(predator);
            } else if (Math.random() < 0.1) {
                const wildlifeAgent = createWildlifeAgent(x, y);
                gameWorldContainer.appendChild(wildlifeAgent);
            }

            gameWorldContainer.appendChild(cell);
        }
    }

    document.body.appendChild(gameWorldContainer);
}

function countNeighbors(x, y, type1, type2 = null) {
    const neighbors = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
  
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const cell = gameWorldContainer.children[ny * width + nx];
          if (cell.classList.contains(type1) && (type2 === null || cell.classList.contains(type2))) {
            neighbors.push(cell);
          }
        }
      }
    }
    return neighbors;
  }
  
  
  function moveAgent(agentCell, targetCell) {
    if (agentCell) {
    const agentType = agentCell.classList.contains("wildlife") ? "wildlife" : "predator";
    agentCell.classList.remove(agentType);
    targetCell.classList.add(agentType);

    const agent = agentCell.querySelector(`.${agentType}`);
    agentCell.removeChild(agent);
    targetCell.appendChild(agent);
    agent.setAttribute("data-x", targetCell.getAttribute("data-x"));
    agent.setAttribute("data-y", targetCell.getAttribute("data-y"));
    }
}

  
  function killAndEat(predatorCell, targetCell) {
    targetCell.removeChild(targetCell.querySelector(".wildlife"));
    targetCell.classList.remove("wildlife");
  }
  
  function reproduce(agentCell, type) {
    const emptyNeighbors = countNeighbors(agentCell.dataset.x, agentCell.dataset.y, "cell");
    if (emptyNeighbors.length > 0) {
      const targetCell = randomElement(emptyNeighbors);
      targetCell.classList.add(type);
  
      const newAgent = type === "wildlife" ? createWildlifeAgent(targetCell.dataset.x, targetCell.dataset.y) : createPredatorAgent(targetCell.dataset.x, targetCell.dataset.y);
      targetCell.appendChild(newAgent);
    }
  }
  

  function seekResources(x, y) {
    x = parseInt(x);
    y = parseInt(y);
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
  
    let target = null;
    let minDistance = Infinity;
  
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
  
      if (
        newX >= 0 &&
        newX < width &&
        newY >= 0 &&
        newY < height
      ) {
        const cell = gameWorldContainer.children[newY * width + newX];
        if (cell.classList.contains("food") || cell.classList.contains("water")) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < minDistance) {
            minDistance = distance;
            target = cell;
          }
        }
      }
    }
  
    return target;
  }
  
  function fleePredators(x, y) {
    x = parseInt(x);
    y = parseInt(y);
    const predatorNeighbors = countNeighbors(x, y, "predator");
  
    if (predatorNeighbors > 0) {
      const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
  
      let target = null;
  
      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
  
        if (
          newX >= 0 &&
          newX < width &&
          newY >= 0 &&
          newY < height
        ) {
          const cell = gameWorldContainer.children[newY * width + newX];
          if (!cell.classList.contains("predator")) {
            target = cell;
            break;
          }
        }
      }
  
      return target;
    }
  
    return null;
  }
  
  function huntWildlife(x, y) {
    x = parseInt(x);
    y = parseInt(y);
    const wildlifeNeighbors = countNeighbors(x, y, "wildlife");
  
    if (wildlifeNeighbors > 0) {
      const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
  
      let target = null;
  
      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
  
        if (
          newX >= 0 &&
          newX < width &&
          newY >= 0 &&
          newY < height
        ) {
          const cell = gameWorldContainer.children[newY * width + newX];
          if (cell.classList.contains("wildlife")) {
            target = cell;
            break;
          }
        }
      }
  
      return target;
    }
  
    return null;
  }
  
  function gameLoop() {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = gameWorldContainer.children[y * width + x];
  
        if (cell.classList.contains("wildlife")) {
          const agentX = parseInt(cell.getAttribute("data-x"));
          const agentY = parseInt(cell.getAttribute("data-y"));
  
          const resourceTarget = seekResources(agentX, agentY);
          const predatorTarget = fleePredators(agentX, agentY);
  
          if (predatorTarget) {
            moveAgent(cell, predatorTarget);
          } else if (resourceTarget) {
            moveAgent(cell, resourceTarget);
          }
  
          const wildlifeNeighbors = countNeighbors(agentX, agentY, "wildlife");
          if (wildlifeNeighbors.length >= 3) {
            reproduce(cell, "wildlife");
          }
        } else if (cell.classList.contains("predator")) {
          const agentX = parseInt(cell.getAttribute("data-x"));
          const agentY = parseInt(cell.getAttribute("data-y"));
  
          const wildlifeTarget = huntWildlife(agentX, agentY);
  
          if (wildlifeTarget) {
            moveAgent(cell, wildlifeTarget);
            killAndEat(cell, wildlifeTarget);
          }
  
          const predatorNeighbors = countNeighbors(agentX, agentY, "predator");
          if (predatorNeighbors.length >= 3) {
            reproduce(cell, "predator");
          }
        }
      }
    }
  }
  
  
  createGameWorld();
  // Call the game loop every second
  setInterval(gameLoop, 1000);