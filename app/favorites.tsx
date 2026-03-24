import { Trash2 } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../src/constants/Theme';
import { Quote, quoteService } from '../src/services/quotes/QuoteService';

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState<Quote[]>([]);
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Theme.dark : Theme.light;

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        const favs = await quoteService.getFavorites();
        setFavorites(favs);
    };

    const removeFavorite = async (quote: Quote) => {
        await quoteService.toggleFavorite(quote);
        loadFavorites();
    };

    const renderItem = ({ item, index }: { item: Quote, index: number }) => (
        <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 100 }}
            style={[styles.quoteCard, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        >
            <View style={styles.quoteTextContainer}>
                <Text style={[styles.quoteText, { color: colors.text }]}>"{item.quote}"</Text>
                <Text style={[styles.quoteSource, { color: colors.textSecondary }]}>— {item.movie}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFavorite(item)} style={styles.removeButton}>
                <Trash2 size={20} stroke="#FF3B30" />
            </TouchableOpacity>
        </MotiView>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.quote}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No favorites yet.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingTop: 100, // Clearance for header
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    quoteCard: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    quoteTextContainer: {
        flex: 1,
    },
    quoteText: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 22,
        marginBottom: 4,
    },
    quoteSource: {
        fontSize: 14,
        fontWeight: '500',
    },
    removeButton: {
        padding: 8,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontStyle: 'italic',
    }
});
