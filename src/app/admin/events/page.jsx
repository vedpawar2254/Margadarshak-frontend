"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { api } from "@/services/api";

export default function AdminEventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        title: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        imageUrl: "",
        isPublished: true
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await api.get("/events?admin=true");
            setEvents(data || []);
        } catch (err) {
            console.error("Failed to fetch events", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        try {
            setUploading(true);
            const response = await api.upload("/upload?type=highlight", formDataUpload);
            if (response.success) {
                setFormData(prev => ({ ...prev, imageUrl: response.data.fileUrl }));
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            // Format date to ISO if needed, but YYYY-MM-DD from input is fine for now, Prisma handles DateTime
            const payload = {
                ...formData,
                date: new Date(formData.date).toISOString()
            };

            if (formData.id) {
                await api.put(`/events/${formData.id}`, payload);
            } else {
                await api.post("/events", payload);
            }

            closeForm();
            fetchEvents();
        } catch (error) {
            console.error("Save failed", error);
            const msg = error.response?.data?.message || error.message || "Failed to save event";
            alert(`Error: ${msg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await api.delete(`/events/${id}`);
            fetchEvents();
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete event");
        }
    };

    const handleEdit = (event) => {
        setFormData({
            id: event.id,
            title: event.title,
            description: event.description,
            date: new Date(event.date).toISOString().split('T')[0],
            imageUrl: event.imageUrl,
            isPublished: event.isPublished
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setFormData({
            id: null,
            title: "",
            description: "",
            date: new Date().toISOString().split('T')[0],
            imageUrl: "",
            isPublished: true
        });
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(events);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setEvents(items);

        const orderedIds = items.map(e => e.id);
        try {
            await api.patch("/events/reorder", { orderedIds });
        } catch (err) {
            console.error("Failed to reorder", err);
        }
    };

    if (loading) return <div className="p-8">Loading events...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Past Highlights Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage past events shown on the events page</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-pink-600/20"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Highlight
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="events-list" direction="horizontal">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {events.map((event, index) => (
                                <Draggable key={event.id} draggableId={event.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative"
                                        >
                                            <div className="aspect-video relative bg-gray-50">
                                                {event.imageUrl ? (
                                                    <Image
                                                        src={event.imageUrl}
                                                        alt={event.title}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-300">
                                                        No Image
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(event)}
                                                        className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(event.id)}
                                                        className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-gray-900 truncate">{event.title}</h3>
                                                <p className="text-xs font-semibold text-pink-600 mb-2">
                                                    {new Date(event.date).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{event.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                {formData.id ? "Edit Highlight" : "Add Highlight"}
                            </h2>
                            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-center mb-4">
                                <div className="relative w-full h-48 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 group">
                                    {formData.imageUrl ? (
                                        <Image
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <span className="text-sm text-gray-400">Upload Event Photo</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <span className="text-white font-bold">Change Photo</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                </div>
                            </div>
                            {uploading && <p className="text-center text-xs text-pink-500">Uploading...</p>}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-gray-900 bg-white"
                                        placeholder="e.g. Annual Tech Symposium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-gray-900 bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-gray-900 bg-white"
                                        placeholder="1-2 lines about the event..."
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isPublished"
                                        checked={formData.isPublished}
                                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                        className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                                    />
                                    <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                                        Publish Immediately
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading || isSubmitting}
                                    className={`flex-1 py-2.5 rounded-xl font-bold shadow-lg shadow-pink-900/20 text-white
                                        ${uploading || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-800'}`}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Highlight'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
