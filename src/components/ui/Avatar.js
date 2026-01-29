'use client';

/**
 * Avatar - Displays user avatar with initials fallback
 * 
 * Features:
 * - Shows user image if available
 * - Falls back to initials from name
 * - Configurable size
 * - Accessible with alt text
 */
export default function Avatar({
    user,
    size = 'md',
    className = '',
    onClick,
}) {
    // Size variants
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
    };

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ').filter(Boolean);
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    // Generate consistent color from name
    const getColorFromName = (name) => {
        if (!name) return 'bg-gray-500';
        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-teal-500',
            'bg-orange-500',
            'bg-cyan-500',
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const initials = getInitials(user?.name);
    const bgColor = getColorFromName(user?.name);
    const sizeClass = sizes[size] || sizes.md;

    const baseClasses = `
        ${sizeClass}
        rounded-full
        flex items-center justify-center
        font-semibold text-white
        overflow-hidden
        flex-shrink-0
        ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-400 transition-all' : ''}
        ${className}
    `.trim();

    if (user?.avatar) {
        return (
            <button
                type="button"
                onClick={onClick}
                disabled={!onClick}
                className={baseClasses}
                aria-label={`${user.name}'s profile`}
            >
                <img
                    src={user.avatar}
                    alt={`${user.name}'s avatar`}
                    className="w-full h-full object-cover"
                />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!onClick}
            className={`${baseClasses} ${bgColor}`}
            aria-label={`${user?.name || 'User'}'s profile`}
        >
            {initials}
        </button>
    );
}
