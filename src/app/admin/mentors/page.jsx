"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { api } from "@/services/api";

export default function AdminMentorsPage() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Fix double submit
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        role: "",
        bio: "",
        skills: "", // Comma separated
        imageUrl: "",
        isPublished: true
    });

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            setLoading(true);
            const data = await api.get("/mentors"); // Admin should get all
            setMentors(data || []);
        } catch (err) {
            console.error("Failed to fetch mentors", err);
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
            const response = await api.upload("/upload?type=mentor", formDataUpload);
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
        if (isSubmitting) return; // Prevent double click

        try {
            setIsSubmitting(true);
            const payload = {
                ...formData,
                skills: formData.skills.split(",").map(s => s.trim()).filter(s => s)
            };

            if (formData.id) {
                await api.put(`/mentors/${formData.id}`, payload);
            } else {
                await api.post("/mentors", payload);
            }

            closeForm();
            fetchMentors();
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save mentor");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this mentor?")) return;
        try {
            await api.delete(`/mentors/${id}`);
            fetchMentors();
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete mentor");
        }
    };

    const handleEdit = (mentor) => {
        setFormData({
            id: mentor.id,
            name: mentor.name,
            role: mentor.role,
            bio: mentor.bio,
            skills: mentor.skills.join(", "),
            imageUrl: mentor.imageUrl,
            isPublished: mentor.isPublished
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setFormData({
            id: null,
            name: "",
            role: "",
            bio: "",
            skills: "",
            imageUrl: "",
            isPublished: true
        });
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(mentors);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setMentors(items);

        // Persist order
        const orderedIds = items.map(m => m.id);
        try {
            await api.patch("/mentors/reorder", { orderedIds });
        } catch (err) {
            console.error("Failed to reorder", err);
        }
    };

    if (loading) return <div className="p-8">Loading mentors...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mentors Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage mentors showing on the homepage</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Mentor
                </button>
            </div>

            {/* List / Grid */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="mentors-list" direction="horizontal">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {mentors.map((mentor, index) => (
                                <Draggable key={mentor.id} draggableId={mentor.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative"
                                        >
                                            <div className="aspect-[4/3] relative bg-gray-50">
                                                {mentor.imageUrl ? (
                                                    <Image
                                                        src={mentor.imageUrl}
                                                        alt={mentor.name}
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
                                                        onClick={() => handleEdit(mentor)}
                                                        className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(mentor.id)}
                                                        className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-gray-900">{mentor.name}</h3>
                                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">{mentor.role}</p>
                                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{mentor.bio}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {mentor.skills.slice(0, 3).map((skill, i) => (
                                                        <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
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

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                {formData.id ? "Edit Mentor" : "Add Mentor"}
                            </h2>
                            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            {/* Image Upload */}
                            <div className="flex justify-center mb-4">
                                <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 group">
                                    {formData.imageUrl ? (
                                        <Image
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <span className="text-xs text-gray-400">Upload Photo</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <span className="text-white text-xs font-bold">Change</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                </div>
                            </div>
                            {uploading && <p className="text-center text-xs text-blue-500">Uploading...</p>}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Dr. APJ Abdul Kalam"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role / Designation</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Senior Career Counselor"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Short description..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Leadership, Strategy, AI"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isPublished"
                                        checked={formData.isPublished}
                                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
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
                                    className={`flex-1 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 text-white
                                        ${uploading || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#004880] hover:bg-blue-800'}`}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Mentor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
