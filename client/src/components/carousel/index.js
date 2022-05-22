import React, { useEffect, useState } from "react";
import "./index.css";

import { IconLeftArrow, IconRightArrow } from '../../icon';


const Carousel = (props) => {
	const { imgURLs, selectedTypes } = props

	const [gallery, setGallery] = useState([]);
	const [currentGalleryIdx, setCurrentGalleryIdx] = useState(0);

	const shuffle = (array) => {
		let currentIndex = array.length,
			randomIndex;
		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex],
				array[currentIndex],
			];
		}
		return array;
	}

	useEffect(() => {
		const images = []
		for (const type of selectedTypes) {
			const typeImages = imgURLs[`${type}`];
			if (typeImages !== undefined) {
				images.push(...typeImages);
			}
		}
		setCurrentGalleryIdx(0);
		setGallery(shuffle(images));
	}, [selectedTypes, imgURLs]);


  const showPrevImg = () => {
		if (currentGalleryIdx === 0) return
		setCurrentGalleryIdx(currentGalleryIdx - 1);
  };

	const showNextImg = () => {
		if (currentGalleryIdx + 1 >= gallery.length) return
		setCurrentGalleryIdx(currentGalleryIdx + 1);
	}


	return (
		<div className="Container">
			<button
				type="button"
				className={currentGalleryIdx > 0 ? "Carousel-arrow-icon" : "hide"}
				onClick={showPrevImg}
			>
				<IconLeftArrow fill={`#ffffff`} width={50} height={50} />
			</button>
			{gallery.length > 0 && gallery.length > currentGalleryIdx ? (
				<img
					src={gallery[currentGalleryIdx]}
					alt={selectedTypes.join(" and ")}
					width="600"
					height="500"
				/>
			) : (
				<div>no image</div>
			)}
			<button
				type="button"
				className={gallery.length > currentGalleryIdx + 1 ? "Carousel-arrow-icon" : "hide"}
				onClick={showNextImg}
			>
				<IconRightArrow fill={`#ffffff`} width={50} height={50} />
			</button>
		</div>
	);
};

export default Carousel;
