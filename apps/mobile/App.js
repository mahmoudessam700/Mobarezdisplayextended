import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mobarez DisplayExtended</Text>
            <Text style={styles.subtitle}>Mobile Client (Placeholder)</Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>Ready for Pairing</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3b82f6',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#94a3b8',
        marginBottom: 24,
    },
    badge: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.5)',
    },
    badgeText: {
        color: '#60a5fa',
        fontWeight: '600',
        fontSize: 14,
    }
});
