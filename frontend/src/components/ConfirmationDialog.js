import React, { useEffect, useRef } from 'react';

const ConfirmationDialog = ({ tea, onCancel, onConfirm }) => {
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        cancelButtonRef.current.focus();
    }, []);

    return (
        <div role="dialog" aria-modal="true" aria-labelledby="confirmDialogTitle" aria-describedby="confirmDialogDesc">
            <h2 id="confirmDialogTitle">Confirm Delete</h2>
            <p id="confirmDialogDesc">Are you sure you want to delete this tea: {tea.person} {tea.description}?</p>
            <button ref={cancelButtonRef} onClick={onCancel}>Cancel</button>
            <button onClick={onConfirm}>Delete</button>
        </div>
    );
};

export default ConfirmationDialog;
