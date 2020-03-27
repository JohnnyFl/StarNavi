import React, { useState, useEffect, memo } from "react";
import styled from "styled-components";
import getRandomInt from "../../utils/utils";

const GameWrapper = styled.div`
	padding-top: 20vh;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const ButtonWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 0 10px;
	width: 80%;
	margin-top: 5px;
`;

const Select = styled.select`
	background-color: lightgray;
	border: none;
	border-radius: 5px;
	padding: 5px 15px;
	font-size: 1.1rem;
	color: gray;
	cursor: pointer;
`;

const Option = styled.option`
	cursor: pointer;
`;

const Input = styled.input`
	background-color: #f3f3f3;
	border: none;
	border-radius: 5px;
	padding: 5px 15px;
	font-size: 1.1rem;
	color: #94a2a7;
`;

const Button = styled.button`
	background-color: #7b8d93;
	border: none;
	border-radius: 5px;
	color: white;
	font-size: 1.1rem;
	cursor: pointer;
`;

const CongratText = styled.div`
	color: green;
	margin: 40px 0;
	text-transform: uppercase;
	font-size: 1.4rem;
	opacity: ${props => (props.gameEnds ? 1 : 0)};
	user-select: none;
`;

const Fields = styled.div`
	display: grid;
	margin-bottom: 40px;
	grid-template: ${props =>
		`repeat(${props.number}, 1fr) / repeat(${props.number}, 1fr)`};
`;

const Field = styled.div`
	border: 1px solid lightgrey;
	width: 40px;
	height: 40px;
	cursor: pointer;
`;

const Game = () => {
	const [settings, setSettings] = useState([]);

	useEffect(() => {
		const getSettings = async () => {
			try {
				const resp = await fetch(
					"https://starnavi-frontend-test-task.herokuapp.com/game-settings"
				);
				const data = await resp.json();

				const arrayOfArrays = Object.entries(data);
				const arrayOfObjects = arrayOfArrays.map(item => ({
					[item[0]]: item[1]
				}));
				setSettings(arrayOfObjects);
			} catch (e) {
				console.log(e);
			}
		};

		getSettings();
	}, []);

	// useEffect(() => {
	// 	setColoredFields(prev => [...prev, num]);
	// }, [num]);

	const [gameMode, setGameMode] = useState({ field: 5, delay: 2000 });
	const [name, setName] = useState("User");
	const [gameEnds, setGameEnds] = useState(false);
	const [coloredFields, setColoredFields] = useState([]);
	const [isUserMove, setIsUserMove] = useState(false);
	const [num, setNum] = useState(null);
	const [userPoints, setUserPoints] = useState(0);
	const [computerPoints, setComputerPoints] = useState(0);
	const [startTime, setStartTime] = useState();

	const handleSelect = e => {
		const { value } = e.target;
		const selectedMode = settings.filter(
			mode => Object.values(mode)[0].field === Number(value)
		);
		setGameMode(Object.values(selectedMode[0])[0]);
	};

	const userMove = e => {
		let field = e.target;
		let computerField = coloredFields[coloredFields.length - 1];
		let finishTime = new Date().getTime();
		let timeDifference = finishTime - startTime;
		setColoredFields([...coloredFields, Number(field.id)]);
		if (isUserMove) {
			if (
				computerField === Number(field.id) &&
				timeDifference < gameMode.delay
			) {
				field.style.backgroundColor = "green";
				setUserPoints(prev => prev + 1);
			} else {
				field.style.backgroundColor = "red";
				setComputerPoints(prev => prev + 1);
			}

			// setNum(Number(field.id));

			setIsUserMove(false);
			computerMove();
		} else {
			return;
		}
	};

	const renderFields = () => {
		let fields = [];
		for (let i = 1; i <= gameMode.field * gameMode.field; i++) {
			fields.push(<Field onClick={userMove} id={i} key={i}></Field>);
		}
		return fields;
	};

	const computerMove = () => {
		let fields = gameMode.field * gameMode.field;
		let randomID = getRandomInt(fields);
		let square = document.getElementById(randomID);
		if (coloredFields.length > fields / 2) {
			setGameEnds(true);
			if (userPoints > computerPoints) return;
			else setName("Computer");
			return;
		}
		if (!coloredFields.includes(randomID)) {
			setColoredFields([...coloredFields, randomID]);
			// setNum(randomID);
			setTimeout(() => {
				square.style.backgroundColor = "blue";
				setIsUserMove(true);
				setStartTime(new Date().getTime());
			}, gameMode.delay);
		} else {
			computerMove();
		}
	};

	const handlePlayButton = () => {
		if (!gameEnds) {
			computerMove();
		} else {
			console.log("sfgdf");
		}
	};

	return (
		<GameWrapper>
			<ButtonWrapper>
				<Select onChange={handleSelect}>
					<Option value={5}>Pick game mode</Option>
					{settings.length > 0
						? settings.map(item => (
								<Option
									key={Object.keys(item)[0]}
									value={Object.values(item)[0].field}>
									{Object.keys(item)[0]}
								</Option>
						  ))
						: null}
				</Select>
				<Input
					placeholder='Enter your name'
					onChange={e => setName(e.target.value)}
				/>

				<Button onClick={handlePlayButton}>
					{!gameEnds ? "Play" : "Play Again"}
				</Button>
			</ButtonWrapper>
			<CongratText gameEnds={gameEnds}>{name} Won !</CongratText>
			<Fields number={gameMode.field}>{renderFields()}</Fields>
		</GameWrapper>
	);
};

export default memo(Game);
