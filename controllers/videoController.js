const httpService = require("../services/httpService");
const Video = require("../db/videoSchema.js");
const Boom = require("boom");

const formatVideoItems = (items) =>
	items.map(
		({
			id,
			snippet: {
				title,
				thumbnails: {
					high: { url },
				},
			},
			contentDetails: { duration, definition },
			statistics: { viewCount, likeCount, dislikeCount },
		}) => ({
			id,
			title,
			thumbnailUrl: url,
			duration,
			definition,
			viewCount,
			likeCount,
			dislikeCount,
		})
	);

exports.getSingleVideo = async (req, res) => {
	const params = { id: req.params.id };

	try {
		const {
			data: { items },
		} = await httpService.fetchVideos(params);
		res.json({ ...formatVideoItems(items)[0] });
	} catch ({ response: { status, data } }) {
		res.status(status).send(data);
	}
};

exports.getTrendVideos = async (req, res) => {
	const params = {
		chart: "mostPopular",
		pageToken: req.query.page || req.params.token || "",
	};
	try {
		const {
			data: { items, nextPageToken },
		} = await httpService.fetchVideos(params);
		res.json({ items: formatVideoItems(items), nextPageToken });
	} catch ({ response: { status, data } }) {
		res.status(status).send(data);
	}
};

exports.searchVideos = async (req, res) => {
	if (!req.query.name) res.json(Boom.badRequest("Name is required"));

	const params = {
		q: req.query.name,
		pageToken: req.query.page || "",
	};

	try {
		const {
			data: { items: searchItems, nextPageToken },
		} = await httpService.searchVideos(params);
		const idList = searchItems.map(({ id: { videoId } }) => videoId).join(",");
		const {
			data: { items },
		} = await httpService.fetchVideos({ id: idList });

		res.json({ items: formatVideoItems(items), nextPageToken });
	} catch ({ response: { status, data } }) {
		res.status(status).send(data);
	}
};

exports.getSavedVideos = async (req, res) => {
	try {
		await Video.find((err, data) => {
			if (err) {
				console.log(err);
			} else {
				res.json(data);
			}
		});
	} catch ({ response: { status, data } }) {
		res.status(status).send(data);
	}
};

exports.saveVideo = async (req, res) => {
	if (!req.body) res.json(Boom.badRequest("Video is required"));
	const { id, title, thumbnailUrl, duration, definition, viewCount, likeCount, dislikeCount, isFavorite } = req.body;

	const video = new Video({
		id,
		title,
		thumbnailUrl,
		duration,
		definition,
		viewCount,
		likeCount,
		dislikeCount,
		isFavorite,
	});
	try {
		const dBresponse = await video.save();
		res.send(dBresponse);
	} catch ({ response: { status, data } }) {
		res.status(status).send(data);
	}
};

exports.deleteVideo = async (req, res) => {
	if (!req.params.id) res.json(Boom.badRequest("Id is required"));
	try {
		const dBresponse = await Video.deleteOne({ id: req.params.id });
		res.send(dBresponse);
	} catch ({ response: { status, data } }) {
		res.status(status).send(data);
	}
};
