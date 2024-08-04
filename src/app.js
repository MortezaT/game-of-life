const app = () => {
  const worldWidth = 100
  const worldHeight = 100
  const interval = 100

  const worldNode = document.getElementById('world')

  /*

    # O O
    # # #
    # # O 

   */
  /* world: [ 
    row: [
      cell: true
      cell: false, 
      cell: true
    ], 
    row: [
      cell: false, 
      cell: true
      cell: false, 
    ], 
    row: [
      cell: false, 
      cell: true
      cell: false, 
    ], 
  ] */

  let worldMap = createWorldMap()
  createWorld()
  worldMap[1][1] = true
  worldMap[1][3] = true
  worldMap[2][2] = true
  worldMap[2][3] = true
  worldMap[3][2] = true
  
  renderWorld()
  setInterval(() => {
    worldMap = calculateNextStep()
    renderWorld()
  }, interval)

  function createWorldMap() {
    const world = []
    for (let i = 0; i < worldHeight; i++) {
      world[i] = []
      for (let j = 0; j < worldWidth; j++) {
        world[i][j] = false
      }
    }

    return world
  }

  function createWorld() {
    const result = worldMap.forEach((row, i) => {
      const rowNode = document.createElement('div')
      rowNode.className = 'row'

      worldNode.appendChild(rowNode)

      row.forEach((_cell, j) => {
        const cellNode = document.createElement('div')
        cellNode.className = 'cell'
        cellNode.id = getCellId(i, j)
        // cellNode.innerText = [i, j].join(', ')

        rowNode.appendChild(cellNode)
      })
    })
  }

  function renderWorld() {
    worldMap.forEach((row, i) => {
      row.forEach((isAlive, j) => {
        const cellNode = document.querySelector(`.cell#${getCellId(i, j)}`)

        if (isAlive) {
          cellNode.classList.add('live')
        } else {
          cellNode.classList.remove('live')
        }
      })
    })
  }

  function calculateNextStep() {
    const newWorldMap = createWorldMap()
    worldMap.forEach((row, i) => {
      row.forEach((isAlive, j) => {
        const cellNode = document.querySelector(`.cell#${getCellId(i, j)}`)
        // const neighbors = getNeighbors(i, j) // [true, false, false, true, ...]
        // const liveNeighbors = neighbors
        // let liveNeighborCount = o
        // neighbors.forEach(isAlive => {
        //   if (isAlive) { liveNeighborCount++ }
        // })
        // const liveNeighborsCount = neighbors.filter((isAlive) => isAlive).length
        const liveNeighborsCount = getLiveNeighborsCount(i, j)
        newWorldMap[i][j] = willSurvive(isAlive, liveNeighborsCount)
      })
    })

    return newWorldMap
  }

  function getCellId(i, j) {
    return `cell-${i}-${j}`
  }

  function getLiveNeighborsCount(i, j) {
    /*
      # # # [i-1, j-1]  [i-1, j]  [i-1, j+1]
      #   # [i, j-1]    [i, j]    [i, j+1]
      # # # [i+1, j-1]  [i+1, j]  [i+1, j+1]
    */
    /* const neighbors = [
      [i - 1, j - 1], [i - 1, j], [i - 1, j + 1],
      [i, j - 1], [i, j + 1],
      [i + 1, j - 1], [i + 1, j], [i + 1, j + 1]
    ].map(([x, y]) => world[x][y]) */
    const neighbors = []
    for (let x = i - 1; x <= i + 1; x++) {
      for (let y = j - 1; y <= j + 1; y++) {
        if (x == i && y == j) continue
        // worldMap && worldMap[x] && worldMap[x][y]
        // worldMap?.[x]?.[y]
        neighbors.push(worldMap[x]?.[y])
      }
    }

    return neighbors.filter(Boolean).length;
  }

  function willSurvive(isAlive, liveNeighborsCount) {
    // Any live cell with fewer than two live neighbors dies, as if by under-population.
    if (liveNeighborsCount < 2)
      return false
    // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
    if (liveNeighborsCount == 3 && !isAlive)
      return true
    // Any live cell with two or three live neighbors lives on to the next generation.
    if (liveNeighborsCount == 2 || liveNeighborsCount == 3)
      return isAlive
    // Any live cell with more than three live neighbors dies, as if by overpopulation.
    if (liveNeighborsCount > 3)
      return false
  }
}

app()

