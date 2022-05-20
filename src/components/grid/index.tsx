import React, { Children, Dispatch, FC, useCallback, useEffect } from 'react'
import useMousetrap from 'react-hook-mousetrap'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from 'redux'

import { createGrid, fillBlock, Reducer, selectBlock } from 'reducers'
import { BLOCK_COORDS, GRID, INDEX, N } from 'typings'

import Block from './block'
import { Container, Row } from './styles'

interface State {
  gameOver: boolean
  puzzleGrid?: GRID
  selectedBlock?: BLOCK_COORDS
  selectedValue: N
  solvedGrid?: GRID
}

const Grid: FC = () => {
  const state = useSelector<Reducer, State>(({ gameOver, puzzleGrid, selectedBlock, solvedGrid, workingGrid }) => ({
    gameOver,
    puzzleGrid,
    selectedBlock,
    selectedValue: workingGrid && selectedBlock ? workingGrid[selectedBlock[0]][selectedBlock[1]] : 0,
    solvedGrid,
  }))

  const dispatch = useDispatch<Dispatch<AnyAction>>()
  const create = useCallback(() => dispatch(createGrid()), [dispatch])

  const fill = useCallback(
    (n: N) => {
      if (state.gameOver) return

      if (
        state.selectedBlock &&
        state.puzzleGrid &&
        state.puzzleGrid[state.selectedBlock[0]][state.selectedBlock[1]] === 0
      ) {
        dispatch(fillBlock(state.selectedBlock, n))
      }
    },
    [dispatch, state.gameOver, state.selectedBlock, state.puzzleGrid]
  )

  const moveDown = () => {
    if (state.selectedBlock && state.selectedBlock[0] < 8) {
      dispatch(selectBlock([(state.selectedBlock[0] + 1) as INDEX, state.selectedBlock[1]]))
    }
  }

  const moveLeft = () => {
    if (state.selectedBlock && state.selectedBlock[1] > 0) {
      dispatch(selectBlock([state.selectedBlock[0], (state.selectedBlock[1] - 1) as INDEX]))
    }
  }

  const moveRight = () => {
    if (state.selectedBlock && state.selectedBlock[1] < 8) {
      dispatch(selectBlock([state.selectedBlock[0], (state.selectedBlock[1] + 1) as INDEX]))
    }
  }

  const moveUp = () => {
    if (state.selectedBlock && state.selectedBlock[0] > 0) {
      dispatch(selectBlock([(state.selectedBlock[0] - 1) as INDEX, state.selectedBlock[1]]))
    }
  }

  useMousetrap('backspace', () => fill(0))
  useMousetrap('del', () => fill(0))
  useMousetrap('space', () => fill(0))

  useMousetrap('0', () => fill(0))
  useMousetrap('1', () => fill(1))
  useMousetrap('2', () => fill(2))
  useMousetrap('3', () => fill(3))
  useMousetrap('4', () => fill(4))
  useMousetrap('5', () => fill(5))
  useMousetrap('6', () => fill(6))
  useMousetrap('7', () => fill(7))
  useMousetrap('8', () => fill(8))
  useMousetrap('9', () => fill(9))

  useMousetrap('down', moveDown)
  useMousetrap('left', moveLeft)
  useMousetrap('right', moveRight)
  useMousetrap('up', moveUp)

  useEffect(() => {
    if (!state.solvedGrid) create()
  }, [create, state.solvedGrid])

  return (
    <Container data-cy="grid-container">
      {Children.toArray(
        [...Array(9)].map((_, rowIndex) => (
          <Row data-cy="grid-row-container">
            {Children.toArray(
              [...Array(9)].map((_, colIndex) => <Block colIndex={colIndex as INDEX} rowIndex={rowIndex as INDEX} />)
            )}
          </Row>
        ))
      )}
    </Container>
  )
}

export default Grid
