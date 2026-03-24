import { useRouter } from 'expo-router';
import { Heart, Settings as SettingsIcon } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButtons } from '../src/components/ActionButtons';
import { QuoteDisplay } from '../src/components/QuoteDisplay';
import { Theme } from '../src/constants/Theme';
import { Quote, quoteService } from '../src/services/quotes/QuoteService';

export default function HomeScreen() {
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Theme.dark : Theme.light;
    const router = useRouter();

    const loadDailyQuote = useCallback(async () => {
        setLoading(true);
        try {
            const q = await quoteService.getDailyQuote();
            setQuote(q);
            const fav = await quoteService.isFavorite(q);
            setIsFavorite(fav);
        } catch (error) {
            console.error('Failed to load quote:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadDailyQuote();
    }, [loadDailyQuote]);

    const onRefresh = () => {
        setRefreshing(true);
        loadDailyQuote();
    };

    const handleToggleFavorite = async () => {
        if (!quote) return;
        const fav = await quoteService.toggleFavorite(quote);
        setIsFavorite(fav);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/settings')} style={styles.iconButton}>
                    <SettingsIcon size={24} stroke={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/favorites')} style={styles.iconButton}>
                    <Heart size={24} stroke={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.textSecondary} />
                }
            >
                <QuoteDisplay quote={quote} loading={loading} />
            </ScrollView>

            <ActionButtons
                quote={quote}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
        gap: 16,
    },
    iconButton: {
        padding: 8,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});
