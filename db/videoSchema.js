(function videoSchema() {
	const mongoose = require("mongoose");
	const Schema = mongoose.Schema;

	const videoSchema = new Schema(
		{
			id: { type: String, required: true },
			title: { type: String, required: true },
			thumbnailUrl: { type: String, required: true },
			duration: { type: String, required: true },
			definition: { type: String, required: true },
			viewCount: { type: String, required: true },
			likeCount: { type: String, required: true },
			dislikeCount: { type: String, required: true },
			isFavorite: { type: Boolean, required: true },
		},
		{ timestamps: true }
	);

	const video = mongoose.model("Video", videoSchema);
	module.exports = video;
})();
