export const Theme = {
    light: {
        background: '#F9F9F9', // Off-white
        text: '#121212',
        textSecondary: '#666666',
        accent: '#000000',
        card: '#FFFFFF',
        border: '#EEEEEE',
    },
    dark: {
        background: '#0A0A0A', // Near-black
        text: '#F5F5F5',
        textSecondary: '#AAAAAA',
        accent: '#FFFFFF',
        card: '#121212',
        border: '#222222',
    }
};

export const Typography = {
    quote: {
        fontSize: 32,
        fontWeight: '300' as const,
        lineHeight: 42,
        letterSpacing: -0.5,
    },
    source: {
        fontSize: 18,
        fontWeight: '500' as const,
        marginTop: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: '700' as const,
        textTransform: 'uppercase' as const,
        letterSpacing: 1.5,
        opacity: 0.5,
    }
};
