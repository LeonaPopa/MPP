import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReviewForm = () => {
    const [review, setReview] = useState({
        title: '',
        content: ''
    });
    const [loading, setLoading] = useState(false);
    const { teaId, reviewId } = useParams();
    const navigate = useNavigate();

    // Load review details if reviewId is present
    useEffect(() => {
        if (reviewId) {
            setLoading(true);
            axios.get(`http://localhost:3000/teas/${teaId}/reviews/${reviewId}`)
                .then(response => {
                    setReview(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching review:', error);
                    setLoading(false);
                    toast.error("Error fetching review details.");
                });
        }
    }, [teaId, reviewId]);

    const handleChange = (e) => {
        setReview({ ...review, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const method = reviewId ? 'patch' : 'post';
        const url = reviewId ? `http://localhost:3000/teas/${teaId}/reviews/${reviewId}` : `http://localhost:3000/teas/${teaId}/reviews`;

        axios[method](url, review)
            .then(() => {
                toast.success(`Review ${reviewId ? 'updated' : 'added'} successfully!`);
                navigate(`/tea/${teaId}/reviews`);
            })
            .catch(error => {
                console.error('Error saving review:', error);
                toast.error(`Failed to ${reviewId ? 'update' : 'add'} review.`);
            })
            .finally(() => setLoading(false));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="review-form-container">
            <h1>{reviewId ? 'Edit Review' : 'Add Review'}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="review-form-label">Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={review.title}
                        onChange={handleChange}
                        required
                        className="review-form-field"
                    />
                </div>
                <div>
                    <label className="review-form-label">Content:</label>
                    <textarea
                        name="content"
                        value={review.content}
                        onChange={handleChange}
                        required
                        className="review-form-field"
                    />
                </div>
                <button type="submit" disabled={loading} className="review-form-button">
                    {reviewId ? 'Update' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
