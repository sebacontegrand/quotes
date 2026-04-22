import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { Theme, Typography } from '../constants/Theme';
import { Quote } from '../services/quotes/QuoteService';
import { useTranslation } from 'react-i18next';

interface QuoteDisplayProps {
    quote: Quote | null;
    loading?: boolean;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, loading }) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Theme.dark : Theme.light;
    const { t } = useTranslation();

    if (loading || !quote) {
        return (
            <View style={styles.container}>
                <MotiView
                    from={{ opacity: 0.3 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ loop: true, type: 'timing', duration: 1000 }}
                    style={[styles.skeletonLine, { backgroundColor: colors.textSecondary, width: '90%' }]}
                />
                <MotiView
                    from={{ opacity: 0.3 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ loop: true, type: 'timing', duration: 1000, delay: 200 }}
                    style={[styles.skeletonLine, { backgroundColor: colors.textSecondary, width: '70%' }]}
                />
            </View>
        );
    }

    const typeKey = (quote.type || 'movie').toLowerCase();

    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
                type: 'timing',
                duration: 800,
                easing: Easing.out(Easing.quad)
            }}
            style={styles.container}
        >
            <Text style={[Typography.label, { color: colors.textSecondary, marginBottom: 8 }]}>
                {t(`types.${typeKey}`)}
            </Text>
            <Text style={[Typography.quote, { color: colors.text }]}>
                "{quote.quote}"
            </Text>
            <Text style={[Typography.source, { color: colors.textSecondary }]}>
                — {quote.movie}
            </Text>
        </MotiView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 32,
        justifyContent: 'center',
        flex: 1,
    },
    skeletonLine: {
        height: 32,
        borderRadius: 8,
        marginBottom: 16,
    }
});
