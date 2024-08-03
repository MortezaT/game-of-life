const app = () => {
  const worldWidth = 30
  const worldHeight = 30

  const worldNode = document.getElementById('world')

  const world = []

  initWorld()
  createWorld()

  // console.log(world)

  function initWorld() {
    for (let i = 0; i < worldHeight; i++) {
      world[i] = []
      for (let j = 0; j < worldWidth; j++) {
        world[i][j] = false
      }
    }
  }

  function createWorld() {
    const result = world.forEach((row, i) => {
      const rowNode = document.createElement('div')
      rowNode.className = 'row'
      
      worldNode.appendChild(rowNode)

      row.forEach((_cell, j) => {
        const cellNode = document.createElement('div')
        cellNode.className = 'cell'
        cellNode.id = `${i},${j}`
        
        rowNode.appendChild(cellNode)
      })
    })
    console.log(result);
  }
}

app()

/* 
div.row
  div.cell
  div.cell
  div.cell
 */