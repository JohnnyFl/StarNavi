import React from "react";
import Game from "./components/Game";
import Board from "./components/Board";
import styled from "styled-components";

const WrapperApp = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	border: 10px solid lightgray;
	height: 100%;
`;

function App() {
	return (
		<WrapperApp>
			<Game />
			<Board />
		</WrapperApp>
	);
}

export default App;
