import React, { useState, useCallback } from "react";
import Game from "./components/Game";
import Board from "./components/Board";
import styled from "styled-components";

const WrapperApp = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	height: 100%;
`;

function App() {
	const [winner, setWinner] = useState("");

	const getWinner = useCallback(newWinner => {
		setWinner(newWinner);
	}, []);

	return (
		<WrapperApp>
			<Game getWinner={getWinner} />
			<Board winner={winner} />
		</WrapperApp>
	);
}

export default App;
