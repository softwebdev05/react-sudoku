import React, { Dispatch, FC, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from 'components'
import { BLOCK_COORDS, N, NUMBERS } from 'typings'
import { fillBlock, Reducer } from 'reducers'
import { AnyAction } from 'redux'

interface Props {
  value: NUMBERS
}

interface State {
  selectedBlock?: BLOCK_COORDS
  selectedValue: N
}

const NumberButton: FC<Props> = ({ value }) => {
  const state = useSelector<Reducer, State>(({ selectedBlock, workingGrid }) => ({
    selectedBlock,
    selectedValue:
      workingGrid && selectedBlock ? workingGrid[selectedBlock[0]][selectedBlock[1]] : 0,
  }))

  const dispatch = useDispatch<Dispatch<AnyAction>>()

  const fill = useCallback(() => {
    if (state.selectedBlock && state.selectedValue === 0) {
      dispatch(fillBlock(state.selectedBlock, value))
    }
  }, [dispatch, state.selectedBlock, state.selectedValue, value])

  return <Button onClick={fill}>{value}</Button>
}

export default NumberButton