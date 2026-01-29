"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { api } from "@/services/api";

export default function AdminWorkshopsPage() {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        title: "",
        mode: "Online",
        description: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        registerUrl: "",
        knowMoreUrl: ""
    });

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = async () => {
        try {
            setLoading(true);
            const data = await api.get("/workshops?admin=true");
            setWorkshops(data || []);
        } catch (err) {
            console.error("Failed to fetch workshops", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            const payload = {
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString()
            };

            if (formData.id) {
                await api.put(`/workshops/${formData.id}`, payload);
            } else {
                await api.post("/workshops", payload);
            }

            closeForm();
            fetchWorkshops();
        } catch (error) {
            console.error("Save failed", error);
            const msg = error.response?.data?.message || error.message || "Failed to save workshop";
            alert(`Error: ${msg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this workshop?")) return;
        try {
            await api.delete(`/workshops/${id}`);
            fetchWorkshops();
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete workshop");
        }
    };

    const handleEdit = (workshop) => {
        setFormData({
            id: workshop.id,
            title: workshop.title,
            mode: workshop.mode,
            description: workshop.description,
            startDate: new Date(workshop.startDate || workshop.eventDate).toISOString().split('T')[0],
            endDate: new Date(workshop.endDate || workshop.eventDate).toISOString().split('T')[0],
            registerUrl: workshop.registerUrl,
            knowMoreUrl: workshop.knowMoreUrl || ""
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setFormData({
            id: null,
            title: "",
            mode: "Online",
            description: "",
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            registerUrl: "",
            knowMoreUrl: ""
        });
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(workshops);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setWorkshops(items);

        const orderedIds = items.map(w => w.id);
        try {
            await api.patch("/workshops/reorder", { orderedIds });
        } catch (err) {
            console.error("Failed to reorder", err);
        }
    };

    if (loading) return <div className="p-8">Loading workshops...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Upcoming Workshops Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage future workshops and registration links</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Workshop
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="workshops-list">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                        >
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Mode</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Date Range</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workshops.map((workshop, index) => (
                                        <Draggable key={workshop.id} draggableId={workshop.id} index={index}>
                                            {(provided) => (
                                                <tr
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 font-medium text-gray-900">{workshop.title}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                            ${workshop.mode === 'Online' ? 'bg-green-100 text-green-700' :
                                                                workshop.mode === 'Offline' ? 'bg-orange-100 text-orange-700' :
                                                                    'bg-purple-100 text-purple-700'}`}>
                                                            {workshop.mode}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {(workshop.startDate || workshop.eventDate) ?
                                                            `${new Date(workshop.startDate || workshop.eventDate).toLocaleDateString()} 
                                                            ${(workshop.endDate && workshop.endDate !== workshop.startDate) ?
                                                                `- ${new Date(workshop.endDate).toLocaleDateString()}` : ''}`
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(workshop)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(workshop.id)}
                                                            className="text-red-600 hover:text-red-800 font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </tbody>
                            </table>
                            {workshops.length === 0 && (
                                <div className="p-8 text-center text-gray-400">
                                    No upcoming workshops found.
                                </div>
                            )}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                {formData.id ? "Edit Workshop" : "Add Workshop"}
                            </h2>
                            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Workshop Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                                    placeholder="e.g. Financial Analysis Fundamentals"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                                    <select
                                        value={formData.mode}
                                        onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                                    >
                                        <option value="Online">Online</option>
                                        <option value="Offline">Offline</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                                    placeholder="2-3 lines about the workshop..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Register URL (Google Form)</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.registerUrl}
                                    onChange={(e) => setFormData({ ...formData, registerUrl: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                                    placeholder="https://forms.google.com/..."
                                />
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
                                    disabled={isSubmitting}
                                    className={`flex-1 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 text-white
                                        ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-800'}`}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Workshop'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
