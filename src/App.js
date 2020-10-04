import React, { useEffect, useState } from "react";
import { FIELD_1 } from "./field.js";
import "./styles.css";

/* 
w - white;
b - black;
r - red;
g - green;
0 - white with ship;
1 - white without ship;
*/

const MISSED = -1;
const EMPTY = 0;
const SHIP = 1;
const TARGET = 2;
const TURN_PLAYER = "player";
const TURN_ROBOT = "robot";
const HIT_MISS = "miss";
const HIT_PLAYER = "player hit";
const HIT_ROBOT = "robot hit";

export function SeaFight(props) {
  const [player, setPlayer] = useState({
    field: null,
    input: [1, 1],
    score: 0,
    isHideShips: false
  });
  const [robot, setRobot] = useState({
    field: null,
    input: [1, 1],
    score: 0,
    isHideShips: true
  });
  const [turn, setTurn] = useState(TURN_PLAYER);
  const [gameStarted, setGameStarted] = useState(false);
  const [hit, setHit] = useState("");

  useEffect(() => {
    if (turn === TURN_ROBOT) {
      setTimeout(() => {
        const [x, y] = getRandomXY();
        const playerField = player.field.map((i) => i.slice());
        let score = 0;
        switch (playerField[x][y]) {
          case EMPTY:
            playerField[x][y] = MISSED;
            break;
          case SHIP:
            playerField[x][y] = TARGET;
            score = 1;
            break;
          default:
            break;
        }
        setRobot((robot) => ({
          ...robot,
          score: robot.score + score
        }));
        setPlayer((player) => ({
          ...player,
          field: playerField
        }));
        setHit(score === 0 ? HIT_MISS : HIT_ROBOT);
        setTurn(score === 0 ? TURN_PLAYER : TURN_ROBOT);
      }, getRandomValue(1000, 3000));
    }
  }, [turn, player.field]);

  function startGame() {
    setPlayer({ ...player, field: getField() });
    setRobot({ ...robot, field: getField() });
    setGameStarted(true);
  }
  function onChangeX(event) {
    const x = +event.target.value;
    setPlayer({ ...player, input: [x, player.input[1]] });
  }
  function onChangeY(event) {
    const y = +event.target.value;
    setPlayer({ ...player, input: [player.input[0], y] });
  }
  function verifyInput() {
    return player.input.every((item) => item >= 1 && item <= 10);
  }
  function playerFire() {
    if (!verifyInput()) return;
    const [x, y] = player.input;
    const robotField = robot.field.map((i) => i.slice());
    let score = 0;
    switch (robotField[x - 1][y - 1]) {
      case EMPTY:
        robotField[x - 1][y - 1] = MISSED;
        break;
      case SHIP:
        robotField[x - 1][y - 1] = TARGET;
        score = 1;
        break;
      default:
        break;
    }
    setRobot({ ...robot, field: robotField });
    setPlayer({ ...player, score: player.score + score });
    setHit(score === 0 ? HIT_MISS : HIT_PLAYER);
    setTurn(score === 0 ? TURN_ROBOT : TURN_PLAYER);
  }
  return (
    <div>
      {(robot.score === 20 || player.score === 20) && <Winner robot={robot} />}
      <h1>Морской бой:</h1>
      {gameStarted && (
        <Turn turn={turn} hit={hit} robot={robot} player={player} />
      )}
      {!gameStarted && <Start start={startGame} />}
      {robot.field && <Robot robot={robot} />}
      {player.field && (
        <Player
          turn={turn}
          onChangeX={onChangeX}
          onChangeY={onChangeY}
          player={player}
          playerFire={playerFire}
        />
      )}
    </div>
  );
}
function Robot(props) {
  return (
    <div>
      <h2>Robot:</h2>
      <Field obj={props.robot} />
    </div>
  );
}
function Controls(props) {
  const [x, y] = props.input;
  return (
    <div>
      <input
        onChange={(event) => props.onChangeX(event)}
        value={x}
        type="number"
      />
      <input
        onChange={(event) => props.onChangeY(event)}
        value={y}
        type="number"
      />
      <button
        disabled={areDisabled(props.turn)}
        className="strela"
        onClick={() => props.playerFire()}
      >
        Fire
      </button>
    </div>
  );
}
function Player(props) {
  return (
    <div>
      <h2>You:</h2>
      <Field obj={props.player} />
      <Controls
        turn={props.turn}
        onChangeX={props.onChangeX}
        onChangeY={props.onChangeY}
        playerFire={props.playerFire}
        input={props.player.input}
      />
    </div>
  );
}
function Field(props) {
  return (
    <>
      {props.obj.field.map((row) => (
        <div>
          {row.map((item) => (
            <button className={getClass(item, props.obj.isHideShips)}></button>
          ))}
        </div>
      ))}
    </>
  );
}
function Turn(props) {
  return (
    <div>
      <h4>{props.turn === TURN_PLAYER ? "player turn" : "robot turn"}</h4>
      <h4>{props.hit}</h4>
      <h2>
        bot:{props.robot.score} you:{props.player.score}
      </h2>
    </div>
  );
}
function Start(props) {
  return (
    <button onClick={() => props.start()} className="start">
      start ►
    </button>
  );
}
function Winner(props) {
  return <h1>{props.robot.score === 20 ? "robot wins" : "player wins"}</h1>;
}
function areDisabled(turn) {
  return turn === TURN_ROBOT;
}

function getRandomValue(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
function getRandomXY() {
  return [getRandomValue(0, 9), getRandomValue(0, 9)];
}
function getField() {
  return FIELD_1.map((array) => array.slice());
}
function getClass(number, isHideShips = true) {
  switch (number) {
    case EMPTY:
    case SHIP:
      if (isHideShips || number === 0) return "white";

      return "black";
    case TARGET:
      return "red";
    case MISSED:
      return "grey";
    default:
      return null;
  }
}
