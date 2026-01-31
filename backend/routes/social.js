import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verifyToken } from '../middleware/authMiddleware.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/i;
        const extname = filetypes.test(path.extname(file.originalname));
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        console.error('File Upload Rejected:', {
            originalName: file.originalname,
            mimetype: file.mimetype,
            extTest: extname,
            mimeTest: mimetype
        });
        cb(new Error('Only images (jpeg, jpg, png, gif, webp) are allowed'));
    }
});

// Create Post
router.post('/create', verifyToken, upload.array('images', 3), async (req, res) => {
    try {
        const { content } = req.body;
        const images = req.files.map(file => `/uploads/${file.filename}`);

        const newPost = new Post({
            userId: req.userId,
            content,
            images,
            likes: [],
            comments: []
        });

        await newPost.save();

        // Populate user details for real-time broadcast
        const populatedPost = await Post.findById(newPost._id).populate('userId', 'fullName points');

        // Emit Socket Event
        const io = req.app.get('io');
        io.emit('post:create', populatedPost);

        res.status(201).json(populatedPost);
    } catch (error) {
        console.error('Create Post Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Feed
router.get('/feed', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'fullName points')
            .populate('comments.userId', 'fullName points');
        res.json(posts);
    } catch (error) {
        console.error('Fetch Feed Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User Posts
router.get('/user/:userId', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'fullName points')
            .populate('comments.userId', 'fullName points');
        res.json(posts);
    } catch (error) {
        console.error('Fetch User Posts Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Like Post
router.post('/:id/like', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const isLiked = post.likes.includes(req.userId);
        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== req.userId);
        } else {
            post.likes.push(req.userId);
        }

        await post.save();

        const io = req.app.get('io');
        io.emit('post:like', { postId: post._id, likes: post.likes });

        res.json(post.likes);
    } catch (error) {
        console.error('Like Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add Comment
router.post('/:id/comment', verifyToken, async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const newComment = {
            userId: req.userId,
            text,
            createdAt: new Date(),
            reactions: []
        };

        post.comments.push(newComment);
        await post.save();

        // Need to populate the new comment's user info for the frontend
        const updatedPost = await Post.findById(post._id).populate('comments.userId', 'fullName points');
        const addedComment = updatedPost.comments[updatedPost.comments.length - 1];

        const io = req.app.get('io');
        io.emit('post:comment', { postId: post._id, comment: addedComment });

        res.json(addedComment);
    } catch (error) {
        console.error('Comment Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// React to Comment
router.post('/:id/comment/:commentId/react', verifyToken, async (req, res) => {
    try {
        const { type } = req.body; // e.g., 'heart', 'like'
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Toggle reaction logic (simplified: one reaction per user per comment)
        const existingReactionIndex = comment.reactions.findIndex(r => r.userId.toString() === req.userId);

        if (existingReactionIndex > -1) {
            // If same type, remove it (toggle off). If different, update it.
            if (comment.reactions[existingReactionIndex].type === type) {
                comment.reactions.splice(existingReactionIndex, 1);
            } else {
                comment.reactions[existingReactionIndex].type = type;
            }
        } else {
            comment.reactions.push({ userId: req.userId, type });
        }

        await post.save();

        const io = req.app.get('io');
        io.emit('comment:react', {
            postId: post._id,
            commentId: comment._id,
            reactions: comment.reactions
        });

        res.json(comment.reactions);
    } catch (error) {
        console.error('Reaction Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
