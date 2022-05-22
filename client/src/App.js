import './App.css';
import Carousel from './components/carousel'
import Loader from "./components/loader";
import { useEffect, useState } from 'react';
import axios from "axios";

function App() {
	const [apiGalleryResult, setApiGalleryResult] = useState({});
	const [isLoading, setIsloading] = useState(true)
	const [selectedTypes, setSelectedTypes] = useState([]);


	useEffect(() => {
		axios
			.get(
				"http://localhost:3000/gallery",
			)
			.then(({ data }) => {
				setApiGalleryResult(data);
				setIsloading(false);
				if (data.categories.length > 0) {
					setSelectedTypes([data.categories[0]]);
				}
			})
			.catch((err) => {
				console.error(err)
			})
	}, [])

	const updateSelectedTypes = (type) => {
		const idx = selectedTypes.indexOf(type)
		if (idx === -1) {
			setSelectedTypes([...selectedTypes, type]);
		} else {
			let tempt = [...selectedTypes]
			tempt.splice(idx, 1);
			setSelectedTypes(tempt);
		}
	}

	const getButtons = () => {
		let elements = [];
		for (const property in apiGalleryResult.imgs) {
			elements.push(
				<button
					key={property}
					onClick={() => updateSelectedTypes(property)}
					className={
						selectedTypes.indexOf(property) !== -1
							? "App-top-button App-top-button-active"
							: "App-top-button"
					}
				>
					{property}
				</button>
			);
		}
		return elements;
	}

  return (
		<div className="App">
			<div className="App-container">
				<div className="App-top">
					{isLoading && <Loader />}
					{getButtons()}
				</div>
				<div className="App-main">
					<Carousel
						imgURLs={apiGalleryResult.imgs}
						selectedTypes={selectedTypes}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
