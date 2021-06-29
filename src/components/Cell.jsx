import React from 'react';

export default function Cell({row, col, isEnd, isStart, isWall, onMouseDown, onMouseEnter, onMouseUp, onClick, startChange, endChange}) {
    const cellType = isEnd ? 'cell-end' : isStart ? 'cell-start' : isWall ? 'cell-wall' : ''
    if(startChange || endChange) {
        return (
            <div id={`cell-${row}-${col}`} className={`cell ${cellType}`}
                 onClick={() => onClick(row, col)}
            />
        );
    }
    return (
        <div id={`cell-${row}-${col}`} className={`cell ${cellType}`}
             onMouseDown={() => onMouseDown(row, col)}
             onMouseUp={() => onMouseUp()}
             onMouseEnter={() => onMouseEnter(row, col)}
        />
    );
}