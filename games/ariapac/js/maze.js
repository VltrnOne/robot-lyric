/**
 * AriaPac - Maze Generation and Collision Detection
 * Handles maze layout, pathfinding, and collision detection
 */

class Maze {
    constructor() {
        this.grid = [];
        this.playerSpawn = { x: 0, y: 0 };
        this.enemySpawns = [];
        this.pelletCount = 0;
        this.powerPelletLocations = [];

        this.generate();
    }

    generate() {
        // Classic Pacman-style maze layout (28x31 grid)
        // 1 = wall, 0 = empty, 2 = pellet, 3 = power pellet, 4 = player spawn, 5 = enemy spawn

        this.grid = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
            [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,5,5,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,5,5,5,5,5,5,1,0,1,1,2,1,1,1,1,1,1],
            [0,0,0,0,0,0,2,0,0,0,1,5,5,5,5,5,5,1,0,0,0,2,0,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,0,1,5,5,5,5,5,5,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,2,2,1,1,2,2,2,2,2,2,2,2,4,2,2,2,2,2,2,2,1,1,2,2,3,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        this.parseSpawnPoints();
        this.countPellets();
    }

    parseSpawnPoints() {
        this.enemySpawns = [];
        this.powerPelletLocations = [];

        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                const tile = this.grid[y][x];

                if (tile === TileType.SPAWN_PLAYER) {
                    this.playerSpawn = {
                        x: x * TILE_SIZE + TILE_SIZE / 2,
                        y: y * TILE_SIZE + TILE_SIZE / 2
                    };
                    // Convert to pellet after recording spawn
                    this.grid[y][x] = TileType.PELLET;
                } else if (tile === TileType.SPAWN_ENEMY) {
                    this.enemySpawns.push({
                        x: x * TILE_SIZE + TILE_SIZE / 2,
                        y: y * TILE_SIZE + TILE_SIZE / 2,
                        gridX: x,
                        gridY: y
                    });
                } else if (tile === TileType.POWER_PELLET) {
                    this.powerPelletLocations.push({ x, y });
                }
            }
        }
    }

    countPellets() {
        this.pelletCount = 0;

        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                const tile = this.grid[y][x];
                if (tile === TileType.PELLET || tile === TileType.POWER_PELLET) {
                    this.pelletCount++;
                }
            }
        }
    }

    getTile(gridX, gridY) {
        if (gridX < 0 || gridX >= GRID_WIDTH || gridY < 0 || gridY >= GRID_HEIGHT) {
            return TileType.WALL; // Out of bounds = wall
        }
        return this.grid[gridY][gridX];
    }

    setTile(gridX, gridY, tileType) {
        if (gridX >= 0 && gridX < GRID_WIDTH && gridY >= 0 && gridY < GRID_HEIGHT) {
            this.grid[gridY][gridX] = tileType;
        }
    }

    getTileAtPosition(x, y) {
        const gridX = Math.floor(x / TILE_SIZE);
        const gridY = Math.floor(y / TILE_SIZE);
        return this.getTile(gridX, gridY);
    }

    isWall(gridX, gridY) {
        return this.getTile(gridX, gridY) === TileType.WALL;
    }

    isWalkable(gridX, gridY) {
        return !this.isWall(gridX, gridY);
    }

    canMoveTo(x, y, size) {
        // Check all four corners of the entity's bounding box
        const corners = [
            { x: x, y: y },
            { x: x + size, y: y },
            { x: x, y: y + size },
            { x: x + size, y: y + size }
        ];

        return corners.every(corner => {
            const gridX = Math.floor(corner.x / TILE_SIZE);
            const gridY = Math.floor(corner.y / TILE_SIZE);
            return this.isWalkable(gridX, gridY);
        });
    }

    getCenterOfTile(gridX, gridY) {
        return {
            x: gridX * TILE_SIZE + TILE_SIZE / 2,
            y: gridY * TILE_SIZE + TILE_SIZE / 2
        };
    }

    getGridPosition(x, y) {
        return {
            gridX: Math.floor(x / TILE_SIZE),
            gridY: Math.floor(y / TILE_SIZE)
        };
    }

    collectPellet(x, y) {
        const centerX = x + PLAYER_CONFIG.SIZE / 2;
        const centerY = y + PLAYER_CONFIG.SIZE / 2;
        const gridX = Math.floor(centerX / TILE_SIZE);
        const gridY = Math.floor(centerY / TILE_SIZE);

        const tile = this.getTile(gridX, gridY);

        if (tile === TileType.PELLET) {
            this.setTile(gridX, gridY, TileType.EMPTY);
            this.pelletCount--;
            return { type: 'pellet', score: SCORE.PELLET };
        } else if (tile === TileType.POWER_PELLET) {
            this.setTile(gridX, gridY, TileType.EMPTY);
            this.pelletCount--;
            return { type: 'power_pellet', score: SCORE.POWER_PELLET };
        }

        return null;
    }

    // Pathfinding helper - get valid neighbors
    getNeighbors(gridX, gridY) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -1 }, // Up
            { x: 0, y: 1 },  // Down
            { x: -1, y: 0 }, // Left
            { x: 1, y: 0 }   // Right
        ];

        directions.forEach(dir => {
            const newX = gridX + dir.x;
            const newY = gridY + dir.y;

            if (this.isWalkable(newX, newY)) {
                neighbors.push({ x: newX, y: newY });
            }
        });

        return neighbors;
    }

    // Simple BFS pathfinding for AI
    findPath(startX, startY, endX, endY, maxDepth = 20) {
        const start = { x: Math.floor(startX / TILE_SIZE), y: Math.floor(startY / TILE_SIZE) };
        const end = { x: Math.floor(endX / TILE_SIZE), y: Math.floor(endY / TILE_SIZE) };

        if (this.isWall(start.x, start.y) || this.isWall(end.x, end.y)) {
            return null;
        }

        const queue = [{ pos: start, path: [start] }];
        const visited = new Set([`${start.x},${start.y}`]);
        let depth = 0;

        while (queue.length > 0 && depth < maxDepth) {
            const { pos, path } = queue.shift();

            if (pos.x === end.x && pos.y === end.y) {
                return path;
            }

            const neighbors = this.getNeighbors(pos.x, pos.y);

            neighbors.forEach(neighbor => {
                const key = `${neighbor.x},${neighbor.y}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    queue.push({
                        pos: neighbor,
                        path: [...path, neighbor]
                    });
                }
            });

            depth++;
        }

        return null; // No path found
    }

    // Get direction to move from current position toward target
    getDirectionToward(fromX, fromY, toX, toY) {
        const path = this.findPath(fromX, fromY, toX, toY);

        if (!path || path.length < 2) {
            return Direction.NONE;
        }

        const currentGrid = this.getGridPosition(fromX, fromY);
        const nextStep = path[1]; // First step is current position

        const dx = nextStep.x - currentGrid.gridX;
        const dy = nextStep.y - currentGrid.gridY;

        if (dy < 0) return Direction.UP;
        if (dy > 0) return Direction.DOWN;
        if (dx < 0) return Direction.LEFT;
        if (dx > 0) return Direction.RIGHT;

        return Direction.NONE;
    }

    // Calculate Manhattan distance between two points
    getDistance(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    // Get random walkable position
    getRandomWalkablePosition() {
        let attempts = 0;
        const maxAttempts = 100;

        while (attempts < maxAttempts) {
            const gridX = Math.floor(Math.random() * GRID_WIDTH);
            const gridY = Math.floor(Math.random() * GRID_HEIGHT);

            if (this.isWalkable(gridX, gridY)) {
                return this.getCenterOfTile(gridX, gridY);
            }

            attempts++;
        }

        // Fallback to player spawn
        return { ...this.playerSpawn };
    }

    // Handle tunnel wrapping (if implementing Pacman-style side tunnels)
    handleTunnelWrap(x, y) {
        let wrapped = { x, y };

        // Left tunnel
        if (x < 0) {
            wrapped.x = CANVAS_WIDTH + x;
        }
        // Right tunnel
        else if (x > CANVAS_WIDTH) {
            wrapped.x = x - CANVAS_WIDTH;
        }

        return wrapped;
    }

    reset() {
        this.generate();
    }

    clone() {
        const clonedMaze = new Maze();
        clonedMaze.grid = this.grid.map(row => [...row]);
        clonedMaze.playerSpawn = { ...this.playerSpawn };
        clonedMaze.enemySpawns = this.enemySpawns.map(spawn => ({ ...spawn }));
        clonedMaze.pelletCount = this.pelletCount;
        clonedMaze.powerPelletLocations = this.powerPelletLocations.map(loc => ({ ...loc }));
        return clonedMaze;
    }
}
