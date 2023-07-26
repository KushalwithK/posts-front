import React from 'react'
import { AiFillPlayCircle, AiFillPauseCircle } from 'react-icons/ai'
import { styled } from 'styled-components'

const TimerLabel = ({ timerInfo, setTimerInfo }) => {

    const handleTimerStart = () => {
        if (!timerInfo.start) {

        }
    }

    const handleTimerStop = () => {

    }

    return (
        <Main>
            <span className="controls" onClick={handleTimerStart}><AiFillPlayCircle color='green' size={25} /></span>
            <p>0.00</p>
            <span className="controls" onClick={handleTimerStop}><AiFillPauseCircle color='red' size={25} /></span>
        </Main>
    )
}

const Main = styled.div`
display: flex;
align-items: center;
gap: .5rem;
    .controls {
        cursor: pointer;
    }
`

export default TimerLabel