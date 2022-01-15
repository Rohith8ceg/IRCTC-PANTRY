import * as React from 'react';
import { Layout, Text } from '@ui-kitten/components';

export default function OrderStatusScreen({ navigation }) {
    return (
        <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Order Status Screen</Text>
        </Layout>
    );
}