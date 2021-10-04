import React, { useState } from "react";
import axios from 'axios';
import { isUrl } from './utils';
import DisplayError from './DisplayError'
import './segmentvideo.css';

function SegmentVideo () {
	const [video_link, setVideoLink] = useState('');
	const [segment_setting, setSegmentSettings] = useState('');
	const [interval_duration, setIntervalDuration] = useState('');
	const [interval_videos, setIntervalVideos] = useState([]);
	const [inProgress, setInProgress] = useState(false);
	const [isError, setError] = useState(false);

	const isButtonDisabled = () => {
		if(!video_link || video_link.trim().length === 0 || !isUrl(video_link) || segment_setting.length === 0 || interval_duration <= 0) {
			return true;
		}

		return false;
	};

	const segmentVideo = () => {
		setInProgress(true);
		const reqObj = { video_link, interval_duration: parseFloat(interval_duration) };

		axios.post(`${process.env.REACT_APP_API_URL}/api/process-interval`, reqObj)
			.then(response => {
				setError(false);
				if(response.data.interval_videos && response.data.interval_videos.length > 0) {
					setIntervalVideos(response.data.interval_videos);
				}
			})
			.catch(error => {
				setError(true);
			})
			.finally (() => {
				setInProgress(false);
			});
	};

	return (
		<div>
			<span className='header'>Segment Video</span>
			<hr />
			<div>
				<div className='input-group'>
					<input type='text' className="video-link" onChange={e=> { setVideoLink(e.target.value) }} required  />
					<span className="highlight"></span>
					<span className="bar"></span>
					<label>Video Link...</label>
				</div>

				<div>
					<span>Select Segment Settings</span> <br />
					<select className="segment-setting dd-style" onChange={e=> setSegmentSettings(e.target.value)} required>
						<option value="">Select Segment Settings</option>
						<option value="Interval Duration">Interval Duration</option>
					</select>
					
				</div>
			
				{segment_setting === 'Interval Duration' && (
					<>
						<div className='input-group'>
							<input type='number' className="interval-duration width-80" onChange={e=> { setIntervalDuration(e.target.value) }} required  />
							<span className="highlight"></span>
							<span className="bar"></span>
							<label>Interval Duration in Seconds</label>
						</div>
					</>
				)}
				<br/>
				<button className='process-video btn-pink' disabled={isButtonDisabled()} onClick={() => { segmentVideo() }} >SEGMENT VIDEO</button>
			</div>
			<div>
				{isError && (<DisplayError />)}
				{inProgress && (<div className="loader"></div>)}
				{interval_videos.length > 0 && (
					interval_videos.map((video, index) =>
						<video key={`${video.video_url}`} className={`video-content segmented-video-${index + 1}`} controls>
							<source src={video.video_url}  className={`segmented-video-source-${index + 1}`} type="video/mp4" />
							Your browser does not support HTML video.
						</video>
					)
				)}
			</div>
		</div>
	)
}

export default SegmentVideo;
