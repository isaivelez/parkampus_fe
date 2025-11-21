import { View, Text, StyleSheet } from 'react-native';

export default function Details() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Details Screen</Text>
            <Text style={styles.subtext}>This is a basic navigation example.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtext: {
        fontSize: 16,
        color: '#666',
    },
});
