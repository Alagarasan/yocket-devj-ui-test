import React, { useState } from 'react';
import axios from 'axios';
import { isUrl } from './utils';
import DisplayError from './DisplayError'

function VideoCompilation() {
	const [segments, setSegments] = useState([]);
	const [videoHeight, setVideoHeight] = useState('');
	const [videoWidth, setVideoWidth] = useState('');
	const [video_url, setVideoUrl] = useState('');
	const [inProgress, setInProgress] = useState(false);
	const [isError, setError] = useState(false);

	const addVideo = () => {
		setSegments([...segments, {video_url: '', start: '', end: '', id: new Date().getTime()}]);
		setTimeout(() => window.scrollBy(0, 120), 1);
	};

	const editVideo = ({value, name}, index) => {
		const videoValues = [...segments];
		videoValues[index][name] = name === 'video_url' ? value : parseFloat(value);
		setSegments(videoValues);
	};

	const deleteVideo = index => {
		let videoValues = [...segments];
		videoValues.splice(index, 1);
		setSegments(videoValues);
	};

	const isDisabled = () => {
		let disabled = false;
		for (let i = 0; i < segments.length; i++) {
			const { video_url, start, end } = segments[i];
			if(inProgress || !videoHeight || videoHeight < 0 || !videoWidth || videoWidth < 0 || !video_url || video_url.length === 0 || !isUrl(video_url) || isNaN(start) || start < 0 || isNaN(end) || end === 0 || end < start ) {
				disabled = true;
				break;
			}
		}

		return disabled;
	};

	const combineVideos = () => {
		setInProgress(true);

		let reqObj = {
			segments,
			width: parseFloat(videoWidth),
			height: parseFloat(videoHeight)
		};

		axios.post(`${process.env.REACT_APP_API_URL}/api/combine-video`, reqObj)
			.then(response => {
				setError(false);
				console.log(response)
				if(response && response.data && response.data.video_url) {
					console.log('response.data.video_url ', response.data.video_url);
					setVideoUrl(response.data.video_url);
				}
			})
			.catch(err => {
				setError(true);
			})
			.finally(() => {
				setInProgress(false);
			})
	};

	return(
		<div  style={{ marginTop: '20px' }}>
			<div className='header'>Combine Video</div>
			<hr />
			<br />
			<button className='btn-pink add-video' onClick={() => addVideo()}>
				ADD VIDEO
			</button>
			<div>
				{segments.length > 0 && (
					<>
						{segments.map((video, index) =>
							<div className="grid-container" key={`video${video.id}`}>
								<div className="grid-item">
									<div className='input-group'>
										<input type='text' name='video_url' className={`combine-video-${index}`} onChange={e => editVideo(e.target, index) } required  />
										<span className="highlight"></span>
										<span className="bar"></span>
										<label>Video Link...</label>
									</div>
								</div>
								<div className="grid-item">
									<div className='input-group'>
										<input type='number' min='0' name='start' className={`combine-video-range-duration-start-${index}`} onChange={e => editVideo(e.target, index) } required  />
										<span className="highlight"></span>
										<span className="bar"></span>
										<label>Start at</label>
									</div>
								</div>
								<div className="grid-item">
									<div className='input-group'>
										<input type='number' min='0' name='end' className={`combine-video-range-duration-end-${index}`} onChange={e => editVideo(e.target, index) } required  />
										<span className="highlight"></span>
										<span className="bar"></span>
										<label>End at</label>
									</div>	
								</div>  
								<div className="grid-item">
									<button  className={`btn-pink mt-10 delete-combine-video-range-duration-${index}`} key={`delete${index}`} onClick={()=> deleteVideo(index)}>DELETE</button>	
								</div>
							</div>
						)}
						<div>
							<div className="grid-container-small">
								<div className="grid-item">
									<div className='input-group'>
										<input type='number' min='0' className='video-height' onChange={e => setVideoHeight(e.target.value) } required  />
										<span className="highlight"></span>
										<span className="bar"></span>
										<label>Video height</label>
									</div>
								</div>
								<div className="grid-item">
									<div className='input-group'>
										<input type='number' min='0' className='video-width' onChange={e => setVideoWidth(e.target.value) } required  />
										<span className="highlight"></span>
										<span className="bar"></span>
										<label>Video width</label>
									</div>
								</div>
							</div>
						</div>
						<button className='btn-pink' onClick={() => combineVideos()} disabled={isDisabled()}>COMBINE VIDEO(S)</button>
						<br/>
						{isError && (<DisplayError />)}

						{inProgress && (<div className="loader"></div>)}
						{video_url.length > 0 && (
							<video className='mt-10 combined-video'  controls>
								<source src={video_url} className='combined-video-source' type="video/mp4" />
								Your browser does not support HTML video.
							</video>
						)}
					</>
				)}
			</div>
		</div>
	);
}

export default VideoCompilation;
