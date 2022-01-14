import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { db } from "../firebaseConfig";

export default function HomeScreen({ navigation }) {
    const adding = () => {
        db.ref(`/orders/orderid/`).push({
            userid: 1,
            items:{
                id:1,
                quantity:5
            },
            cost: 1000,
        });
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('This is the "Home" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Home Screen</Text>
            <Button
                title="Add"
                onPress={adding}
            />
        </View>
    );
}