import * as Clipboard from 'expo-clipboard';
import { Copy, Heart, Share2 } from 'lucide-react-native';
import React from 'react';
import { Share, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Theme } from '../constants/Theme';
import { Quote } from '../services/quotes/QuoteService';

interface ActionButtonsProps {
    quote: Quote | null;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ quote, isFavorite, onToggleFavorite }) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Theme.dark : Theme.light;

    const handleCopy = async () => {
        if (!quote) return;
        await Clipboard.setStringAsync(`"${quote.quote}" — ${quote.movie}`);
        // Optional: add a toast notification here
    };

    const handleShare = async () => {
        if (!quote) return;
        try {
            await Share.share({
                message: `"${quote.quote}" — ${quote.movie}`,
            });
        } catch (error) {
            console.error('Sharing Error:', error);
        }
    };

    if (!quote) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={handleCopy}
                style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]}
                activeOpacity={0.7}
            >
                <Copy size={20} stroke={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleShare}
                style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]}
                activeOpacity={0.7}
            >
                <Share2 size={20} stroke={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onToggleFavorite}
                style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]}
                activeOpacity={0.7}
            >
                <Heart
                    size={20}
                    stroke={isFavorite ? '#FF3B30' : colors.text}
                    fill={isFavorite ? '#FF3B30' : 'transparent'}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 48,
        gap: 16,
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});
