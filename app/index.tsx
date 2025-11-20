import { View, Text, StyleSheet, Button } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function Home() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello World</Text>
            <Text style={styles.subtext}>Welcome to Parkampus</Text>

            <View style={styles.buttonContainer}>
                <Button
                    title="Go to Details"
                    onPress={() => router.push('/details')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtext: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 20,
    },
});
