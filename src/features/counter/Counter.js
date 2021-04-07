import React, {
    useEffect,
    useState
} from 'react';
import {
    useSelector,
    useDispatch
} from 'react-redux';
import {
    changeState,
    setPointAndRandom,
    setInit,
    selectCount,
    clear,
    counterSlice
} from './counterSlice';
import styles from './Counter.module.css';
import { shuffle } from '../../utils';
import left_ic from "../../left_ic.svg"
import right_ic from "../../right_ic.svg"
import down_ic from "../../down_ic.svg"
import up_ic from "../../up_ic.svg"
import rocket_ic from "../../rocket.svg"
import flag from "../../flag.svg"
import wrong_ic from "../../cross.svg"
import correct_ic from "../../correct.svg"
export function Counter() {
    const state = useSelector(selectCount);
    const dispatch = useDispatch();
    const renderSquares = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let icons = {
        up: up_ic,
        down: down_ic,
        left: left_ic,
        right: right_ic
    }
    const setInitPos = (e) => {
        if (state.initPoint === 0) {
            dispatch(setInit(Number(e.target.id)))
            setTimeout(() => dispatch(changeState({ field: "isStart", value: false })), 1000)
        }
        else if (state.initPoint > 0 && state.randomTurns.length === 10) {
            dispatch(changeState({ field: "endPoint", value: Number(e.target.id) }))
            setTimeout(() => dispatch(clear()), 2000)
        }
    }
    const prepareArray = (currentPoint) => {
        let leftEdge = [1, 4, 7]
        let rightEdge = [3, 6, 9]
        let topBottomEdge = [2, 8]
        let list = state.turns.slice()
        if (leftEdge.indexOf(currentPoint) >= 0) {
            switch (currentPoint) {
                case 1:
                    return [state.turns[1], state.turns[3]]
                case 7:
                    return [state.turns[0], state.turns[3]]
                default:
                    list.splice(2, 1)
                    return list
            }
        }
        if (rightEdge.indexOf(currentPoint) >= 0) {
            switch (currentPoint) {
                case 3:
                    return [state.turns[1], state.turns[2]]
                case 9:
                    return [state.turns[0], state.turns[2]]
                default:
                    list.splice(3, 1)
                    return list
            }
        }
        if (topBottomEdge.indexOf(currentPoint) >= 0) {
            switch (currentPoint) {
                case 2:
                    list.splice(0, 1)
                    return list
                case 8:
                    list.splice(1, 1)
                    return list
                default:
                    return null
            }
        }
        return list
    }
    const renderWinFlag = (index) => {
        let wrong = state.endPoint !== state.currentPoint && state.randomTurns.length === 10 && state.endPoint === index + 1
        let right = state.endPoint && state.endPoint !== state.currentPoint && state.randomTurns.length === 10 && state.currentPoint === index + 1
        let win = state.endPoint === state.currentPoint && state.randomTurns.length === 10 && state.endPoint === index + 1

        if (wrong) {
            return <img src={wrong_ic} />
        }
        else if (right) {
            setTimeout(() => dispatch(changeState({ field: "isRight", value: true })), 1000)
            return state.isRight ? <img src={flag} /> : null
        }
        else if (win) {
            return <img src={correct_ic} />
        }
    }

    useEffect(() => {
        if (state.randomTurns.length < 10 && state.currentPoint > 0) {
            let list = prepareArray(state.currentPoint)
            let step = shuffle(list)
            let finalpoint = state.stepConvertor[step[0]]
            let randomList = state.randomTurns.slice()
            setTimeout(() => dispatch(setPointAndRandom({ current: finalpoint, random: [...randomList, step[0]] })), 700)
        }
        else if (state.randomTurns.length === 10 && state.currentPoint > 0) {
            let { currentPoint, initPoint, randomTurns, stepConvertor } = state
            let updatedStep = ""
            if (currentPoint === initPoint) {
                let prevPoint = currentPoint - stepConvertor[randomTurns[9]]
                let list = prepareArray(prevPoint)
                for (let index = 0; index < list.length; index++) {
                    if (randomTurns[9] !== list[index]) {
                        console.log("in loop  " + list[index])
                        updatedStep = list[index]
                        break
                    }
                }
                let newlist = randomTurns.slice()
                newlist[9] = updatedStep
                setTimeout(() => dispatch(setPointAndRandom({ current: -currentPoint + prevPoint + stepConvertor[newlist[9]], random: [...newlist] })), 700)
            }
        }
    }, [state.currentPoint])
    return <div className={styles.mainblock}>
        <div className={styles.mainblock__grids}>
            <div className={styles.mainfield}>
                {renderSquares.map((square, index) => <div key={square} id={index + 1} className={styles.mainfield__square} onClick={setInitPos}>
                    {state.initPoint === index + 1 && state.isStart ? <img src={rocket_ic} /> : null}
                    {renderWinFlag(index)}
                </div>)}
            </div>
            <div className={styles.turnfield}>
                {renderSquares.map((square, index) => <div key={square} id={index + 1} className={styles.turnfield__square}>
                    {state.randomTurns[index] ? <img src={icons[state.randomTurns[index]]} /> : null}
                </div>)}
                <div id={10} className={styles.turnfield__square}>
                    {state.randomTurns[9] ? <img src={icons[state.randomTurns[9]]} /> : null}
                </div>
            </div>
        </div>

    </div>

}