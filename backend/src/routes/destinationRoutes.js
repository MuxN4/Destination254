import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Destination from "../models/Destination.js"
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, async(req, res) => {
    try {
        const { title, caption, rating, image } = req.body;
        
        if(!title || !caption || !rating || !image) {
            return res.status(400).json({ message: "Please provide all fields" });
        };

        // upload image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url

        // save image to db
        const newDestination = new Destination({
            title,
            caption,
            rating,
            image: imageUrl,
            user:req.user._id,
        });

        await newDestination.save();

        res.status(201).json(newDestination)

    } catch (error) {
        console.log("Error creating destination:", error);
        res.status(500).json({ message: error.message });
    }
});

// pagination - infinite scrolling
router.get("/", protectRoute, async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const destinations = await Destination.find()
        .sort({ createdAt: -1 }) // newest destinations first
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage");

        const totalDestinations = await Destination.countDocuments();
        res.send({
            destinations,
            currentPage: page,
            totalDestinations,
            totalPages: Math.ceil(totalDestinations / limit),
        });

    } catch (error) {
        console.log("Error fetching destinations:", error);
        res.sendStatus(500).json({ message: "Failed to fetch destinations" });
    }
});

// get recommended destinations by the logged in user
router.get("/user", protectRoute, async(req, res) => {
    try {
        const destinations = await Destination.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.json(destinations);

    } catch (error) {
        console.error("Error fetching user destinations:", error.message);
        res.status(500).json({ message: "Failed to fetch user destinations" })
    }
})

router.delete("/:id", protectRoute, async(req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);

        if(!destination) return res.status(404).json({ message: "Destination not found" });

        // check if user is the creator of the destination
        if(destination.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: "You are not allowed to delete this destination" });
        }

        // delete image from cloudinary
        if(destination.image && destination.image.includes("cloudinary")) {
            try {
                const publicId = destination.image.split("/").pop().split(".")[0];

                await cloudinary.uploader.destroy(publicId);

            } catch (deleteError) {
                console.log("Error deleting image from cloudinary:", deleteError);
            }
        }

        await destination.deleteOne();

        res.json({ message: "Destination deleted successfully" });
    } catch (error) {
        console.log("Error deleting destination:", error);
        res.status(500).json({ message: "Failed to delete destination" });
    }
});

export default router;