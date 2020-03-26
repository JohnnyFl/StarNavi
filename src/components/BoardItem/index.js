import React from "react";
import styled from "styled-components";

const Item = styled.div`
	background-color: lightgrey;
	padding: 10px;
	width: 100%;
	color: grey;
	margin-bottom: 5px;
	border-radius: 5px;
	display: flex;
	justify-content: space-between;
	text-transform: uppercase;
	font-size: 1.2rem;
`;

const BoardItem = props => {
	const { winner, date } = props;
	return (
		<Item>
			{winner} <span>{date}</span>
		</Item>
	);
};

export default BoardItem;
