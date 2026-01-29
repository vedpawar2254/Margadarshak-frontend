'use client';

import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
// Use explicit version to avoid mismatches
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * Secure PDF Viewer using PDF.js
 * Features:
 * - Page-by-page rendering
 * - No download button
 * - Context menu disabled
 * - Text selection disabled
 * - Watermark overlay
 * - Responsive design
 */
const PDFSecureViewer = ({ url, watermarkText = 'Protected Content' }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [containerWidth, setContainerWidth] = useState(800);

    // Prevent context menu (right-click)
    const handleContextMenu = useCallback((e) => {
        e.preventDefault();
        return false;
    }, []);

    // Prevent keyboard shortcuts for printing/saving
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
                e.preventDefault();
                return false;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Reset page number when URL changes (module switch)
    useEffect(() => {
        if (url) {
            setTimeout(() => {
                setPageNumber(1);
                setLoading(true);
                setError(null);
            }, 0);
        }
    }, [url]);

    // Responsive container width
    useEffect(() => {
        const updateWidth = () => {
            const container = document.getElementById('pdf-container');
            if (container) {
                setContainerWidth(container.offsetWidth - 40);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoading(false);
        setError(null);
    };

    const onDocumentLoadError = (error) => {
        console.error('PDF load error:', error);
        console.error('Failed URL:', url);

        // Handle common errors
        if (error.name === 'InvalidPDFException') {
            setError('Invalid PDF file or file corrupted.');
        } else if (error.name === 'MissingPDFException') {
            setError('PDF file not found.');
        } else if (error.status === 404) {
            setError('Document not found (404).');
        } else if (error.status === 403) {
            setError('Access denied (403).');
        } else {
            setError(`Failed to load document: ${error.message}`);
        }
        setLoading(false);
    };

    const goToPrevPage = () => {
        setPageNumber((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
    };

    const zoomIn = () => {
        setScale((prev) => Math.min(prev + 0.25, 2.5));
    };

    const zoomOut = () => {
        setScale((prev) => Math.max(prev - 0.25, 0.5));
    };

    return (
        <div
            id="pdf-container"
            onContextMenu={handleContextMenu}
            style={{
                width: '100%',
                height: '80vh',
                position: 'relative',
                background: '#525659',
                borderRadius: '8px',
                overflow: 'hidden',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
            }}
        >
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#323639',
                borderBottom: '1px solid #484b4e',
                color: 'white',
                fontSize: '14px'
            }}>
                {/* Page Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        style={{
                            padding: '6px 12px',
                            background: pageNumber <= 1 ? '#4a4d50' : '#5a5d60',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        ◀ Prev
                    </button>
                    <span>
                        Page {pageNumber} of {numPages || '...'}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= (numPages || 1)}
                        style={{
                            padding: '6px 12px',
                            background: pageNumber >= (numPages || 1) ? '#4a4d50' : '#5a5d60',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: pageNumber >= (numPages || 1) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Next ▶
                    </button>
                </div>

                {/* Zoom Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={zoomOut}
                        disabled={scale <= 0.5}
                        style={{
                            padding: '6px 10px',
                            background: '#5a5d60',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        −
                    </button>
                    <span>{Math.round(scale * 100)}%</span>
                    <button
                        onClick={zoomIn}
                        disabled={scale >= 2.5}
                        style={{
                            padding: '6px 10px',
                            background: '#5a5d60',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* PDF Content */}
            <div style={{
                height: 'calc(100% - 50px)',
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                padding: '20px'
            }}>
                {loading && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: 'white'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid rgba(255,255,255,0.3)',
                            borderTop: '4px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <style jsx>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                )}

                {error && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#ef4444',
                        textAlign: 'center'
                    }}>
                        <span style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</span>
                        <p>{error}</p>
                    </div>
                )}

                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        width={Math.min(containerWidth, 800)}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                </Document>
            </div>

            {/* Watermark Overlay */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.3)',
                pointerEvents: 'none',
                userSelect: 'none'
            }}>
                {watermarkText}
            </div>
        </div>
    );
};

export default PDFSecureViewer;
