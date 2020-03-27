import React, { useState, useEffect, memo, useLayoutEffect } from "react";
import styled from "styled-components";

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
	const [gameMode, setGameMode] = useState({ field: 5, delay: 2000 });
	const [name, setName] = useState("Josh");
	const [userPoints, setUserPoints] = useState(0);
	const [computerPoints, setComputerPoints] = useState(0);
	const [compTurn, setCompTurn] = useState(true);
	const [availableFields, setAvailableFields] = useState([]);
	const [selectedNumber, setSelectedNumber] = useState(null);
	const [startTime, setStartTime] = useState(0);
	const [gameEnds, setGameEnds] = useState(false);

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

	useEffect(() => {
		console.log("SN", selectedNumber);
		setAvailableFields(prevFields => [...prevFields, selectedNumber]);
	}, [selectedNumber]);

	const handleSelect = e => {
		const { value } = e.target;
		const selectedMode = settings.filter(
			mode => Object.values(mode)[0].field === Number(value)
		);
		setGameMode(Object.values(selectedMode[0])[0]);
	};

	const getRandomInt = max => {
		let min = 1;
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	const computerTurn = () => {
		let number = getRandomInt(gameMode.field * gameMode.field);
		let element = document.getElementById(number);
		// setAvailableFields(prevFields => [...prevFields, number]);
		// if (availableFields.length > (gameMode.field * gameMode.field) / 2) {
		// 	setGameEnds(true);
		// 	if (userPoints > computerPoints) {
		// 		return;
		// 	} else {
		// 		setName("Computer");
		// 	}
		// 	alert("aaaaaa");
		// 	return;
		// }
		setSelectedNumber(number);
		if (!availableFields.includes(number)) {
			setAvailableFields(prevFields => [...prevFields, number]);
			setTimeout(() => {
				setCompTurn(false);
				element.style.backgroundColor = "blue";
				setStartTime(new Date().getTime());
			}, gameMode.delay);
		} else {
			computerTurn();
		}
	};

	const handleClick = e => {
		let field = e.target;
		let userTime = new Date().getTime();
		let timeDifference = userTime - startTime;
		console.log("adsfasdf", Number(field.id));
		setSelectedNumber(() => Number(field.id));
		if (!compTurn) {
			if (
				Number(field.id) === selectedNumber &&
				timeDifference < gameMode.delay
			) {
				setUserPoints(prevPoints => (prevPoints += 1));
				field.style.background = "green";
			} else {
				setAvailableFields(prevFields => [...prevFields, Number(field.id)]);

				console.log("user turn", availableFields);
				setComputerPoints(prevPoints => (prevPoints += 1));
				field.style.background = "red";
			}

			computerTurn();
			setCompTurn(true);
		} else {
			return;
		}
	};

	const renderFields = () => {
		let fields = [];
		for (let i = 1; i <= gameMode.field * gameMode.field; i++) {
			fields.push(<Field id={i} onClick={handleClick} key={i}></Field>);
			// fields.push(<Field id={i} key={i}></Field>);
		}
		return fields;
	};

	const handlePlayClick = () => {
		if (compTurn) computerTurn();
		else return;
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
				<Button onClick={handlePlayClick}>Play</Button>
				{/* <Button>Play</Button> */}
			</ButtonWrapper>
			<CongratText gameEnds={gameEnds}>{name} Won !</CongratText>
			<Fields number={gameMode.field}>{renderFields()}</Fields>
		</GameWrapper>
	);
};

export default memo(Game);
