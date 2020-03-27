import React, { useState, useEffect, memo } from "react";
import styled from "styled-components";
import BoardItem from "../BoardItem";

const BoardWrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding-top: 20vh;
`;

const Title = styled.h1`
	color: gray;
`;

const ItemWrapper = styled.div`
	overflow-y: scroll;
	height: 333px;
	width: 70%;
`;

const Board = props => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		fetch("https://starnavi-frontend-test-task.herokuapp.com/winners")
			.then(data => data.json())
			.then(res => setUsers(res))
			.catch(e => console.log(e));
	}, []);

	useEffect(() => {
		if (typeof props.winner === "object") {
			setUsers(prev => [...prev, props.winner]);
		}
	}, [props.winner]);

	return (
		<BoardWrapper>
			<Title>Leader Board</Title>
			<ItemWrapper>
				{users.length > 0 ? (
					users.map(user => (
						<BoardItem key={user.id} winner={user.winner} date={user.date} />
					))
				) : (
					<div>Loading...</div>
				)}
			</ItemWrapper>
		</BoardWrapper>
	);
};

export default memo(Board);
