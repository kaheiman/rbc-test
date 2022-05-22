function SvgLeftArrow(props) {
	return (
		<svg viewBox="0 0 100 100" {...props}>
			<path
				d="M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z"
				className="arrow"
				transform="translate(15,0)"
			></path>
		</svg>
	);
}

export default SvgLeftArrow;
