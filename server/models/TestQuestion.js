const mongoose = require("mongoose");

const TestQuestionSchema = new mongoose.Schema(
    {
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
            index: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
        options: {
            type: [String],
            required: true,
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length === 4,
                message: "options must contain exactly 4 items",
            },
        },
        correctIndex: {
            type: Number,
            required: true,
            min: 0,
            max: 3,
        },
    },
    { timestamps: true },
);

// Fast lookup of all questions belonging to a subject, most recent first
TestQuestionSchema.index({ subjectId: 1, createdAt: -1 });

module.exports = mongoose.model("TestQuestion", TestQuestionSchema);