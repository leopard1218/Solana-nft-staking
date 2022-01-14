import React from "react";
// import { getImg } from "../../hook/Helper";
import styles from './Home.module.sass';
import { CardObj } from './CardObj'
const backgroundImg = {
	backgroundImage: 'url("../../../assets/img/bg.png")'
}
export const Home = () => {

	return (
		<div className={styles.div} style={backgroundImg}>
			<CardObj />
		</div>
	)
}