import React, {useState, useEffect} from 'react';
import styled from "styled-components";
import Cell from "./Cell";
import {dijkstra, getNodesInShortestPathOrder} from "../algorithms/dijkstra";

const CenterDiv = styled.div`
  display: grid;
  align-items: center;
  background-color: whitesmoke;
  margin-right: 10%;
  margin-left: 10%;
`

var START_CELL_ROW = 5
var START_CELL_COL = 2
var END_CELL_ROW = 6
var END_CELL_COL = 46

const GRID_ROWS = 20
const GRID_COLS = 50

export default function PathFinding(props) {
    const[cells, setCells] = useState([])
    const[mouseIsPressed, setMousePressed] = useState(false)
    const[changeStart, setStart] = useState(false)
    const[changeEnd, setEnd] = useState(false)

    const compDidMount = () => {
        const cells = []
        for(let i = 0; i<GRID_ROWS; i++){
            const curr = []
            for(let j = 0; j<GRID_COLS; j++){
                curr.push(createCell(i, j))
            }
            cells.push(curr)
        }
        setCells(cells)
    }

    const createCell = (row, col) => {
        return {
            row,
            col,
            start: row === START_CELL_ROW && col === START_CELL_COL,
            end: row === END_CELL_ROW && col === END_CELL_COL,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null,
        }
    }

    useEffect( () => {
        compDidMount()
    }, [])


    const getDijkstra = () => {
        const grid = cells
        const startNode = grid[START_CELL_ROW][START_CELL_COL];
        const finishNode = grid[END_CELL_ROW][END_CELL_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder)
                }, 10 * i)
                return;
            }
            setTimeout(() => {
                const cell = visitedNodesInOrder[i]
                if(cell.row === START_CELL_ROW && cell.col === START_CELL_COL)
                    document.getElementById(`cell-${cell.row}-${cell.col}`).className = 'cell cell-start'
                else if(cell.row === END_CELL_ROW && cell.col === END_CELL_COL)
                    document.getElementById(`cell-${cell.row}-${cell.col}`).className = 'cell cell-end'
                else
                    document.getElementById(`cell-${cell.row}-${cell.col}`).className = 'cell cell-visited'
            }, 10 * i)
        }
    }

    const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const cell = nodesInShortestPathOrder[i];
                if(cell.row === START_CELL_ROW && cell.col === START_CELL_COL)
                    document.getElementById(`cell-${cell.row}-${cell.col}`).className = 'cell cell-start'
                else if(cell.row === END_CELL_ROW && cell.col === END_CELL_COL)
                    document.getElementById(`cell-${cell.row}-${cell.col}`).className = 'cell cell-end'
                else
                    document.getElementById(`cell-${cell.row}-${cell.col}`).className = 'cell cell-shortest-path';
            }, 50 * i);
        }
    }


    const getNewGridWithWall = (grid, row, col) => {
        const newGrid = cells.slice();
        const cell = newGrid[row][col];
        const newNode = {
            ...cell,
            isWall: !cell.isWall,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    }

    const handleMouseDown = (row, col) => {
        const newGrid = getNewGridWithWall(cells, row, col);
        setCells(newGrid)
        setMousePressed(true)
    }

    const handleMouseEnter = (row, col) => {
        if (!mouseIsPressed) return;
        const newGrid = getNewGridWithWall(cells, row, col);
        setCells(newGrid)
    }

    const clearInput = () => {
        const cells = []
        for(let i = 0; i<GRID_ROWS; i++) {
            const curr = []
            for (let j = 0; j < GRID_COLS; j++) {
                if (i === START_CELL_ROW && j === START_CELL_COL)
                    document.getElementById(`cell-${i}-${j}`).className = 'cell cell-start'
                else if (i === END_CELL_ROW && j === END_CELL_COL)
                    document.getElementById(`cell-${i}-${j}`).className = 'cell cell-end'
                else
                    document.getElementById(`cell-${i}-${j}`).className = 'cell';
                curr.push(createCell(i, j))
            }
            cells.push(curr)
        }
        setCells(cells)
    }

    const changeStartCell = (row, col) => {
        cells[START_CELL_ROW][START_CELL_COL].start = false
        cells[row][col].start = true
        START_CELL_ROW = row
        START_CELL_COL = col
        setStart(false)
        document.getElementById('start-btn').className = 'button-start'
    }

    const changeEndCell = (row, col) => {
        cells[END_CELL_ROW][END_CELL_COL].end = false
        cells[row][col].end = true
        END_CELL_ROW = row
        END_CELL_COL = col
        setEnd(false)
        document.getElementById('end-btn').className = 'button-end'
    }

    const onChangeStart = () => {
        setStart(true)
        setEnd(false)
        document.getElementById('start-btn').className = 'button-dis'
    }

    const onChangeEnd = () => {
        setEnd(true)
        setStart(false)
        document.getElementById('end-btn').className = 'button-dis'
    }


    return (
        <div>
            <button id={'start-btn'} className={'button-start'} onClick={onChangeStart}>
                Change Start
            </button>
            <button id={'end-btn'} className={'button-end'} onClick={onChangeEnd}>
                Change End
            </button>
            <button className={'button-primary'} onClick={getDijkstra}>
                Visualize Dijkstras algorithm
            </button>
            <button className={'b-clear'} onClick={clearInput}>
                CLEAR
            </button>
            <CenterDiv>
                {
                    cells.map((row, rowInx) => {
                        return <div key={rowInx}>
                            {row.map((cell, cellInx) => {
                                    const {start, end, row, col, isWall} = cell;
                                    return (
                                        <Cell key={rowInx}
                                              isStart={start}
                                              isEnd={end}
                                              row={row}
                                              col={col}
                                              isWall={isWall}
                                              mousePressed={mouseIsPressed}
                                              onMouseDown={(row, col) => handleMouseDown(row, col)}
                                              onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                                              onMouseUp={() => setMousePressed(false)}
                                              onClick={(row, col) => {if(changeStart) changeStartCell(row, col); else changeEndCell(row,col);}}
                                              startChange={changeStart}
                                              endChange={changeEnd}
                                        />
                                    );
                                }
                            )}
                        </div>
                    })
                }
            </CenterDiv>
        </div>
    );
}