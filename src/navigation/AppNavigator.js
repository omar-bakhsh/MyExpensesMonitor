import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import AlertsScreen from '../screens/AlertsScreen';
import OffersScreen from '../screens/OffersScreen';
import AccountScreen from '../screens/AccountScreen';
import GoalsScreen from '../screens/GoalsScreen';
import BankSelectionScreen from '../screens/BankSelectionScreen';
import CardCustomizationScreen from '../screens/CardCustomizationScreen';
import CategoryBudgetScreen from '../screens/CategoryBudgetScreen';
import MerchantStatsScreen from '../screens/MerchantStatsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import HelpScreen from '../screens/HelpScreen';
import TermsScreen from '../screens/TermsScreen';
import IncomeScreen from '../screens/IncomeScreen';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../store';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
    const { t } = useTranslation();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarLabel: t(route.name.toLowerCase()),
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Goals') {
                        iconName = focused ? 'flag' : 'flag-outline';
                    } else if (route.name === 'Alerts') {
                        iconName = focused ? 'notifications' : 'notifications-outline';
                    } else if (route.name === 'Offers') {
                        iconName = focused ? 'pricetags' : 'pricetags-outline';
                    } else if (route.name === 'Account') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#4F46E5',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Goals" component={GoalsScreen} />
            <Tab.Screen name="Alerts" component={AlertsScreen} />
            <Tab.Screen name="Offers" component={OffersScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen
                    name="AddTransaction"
                    component={AddTransactionScreen}
                    options={{ presentation: 'modal' }}
                />
                <Stack.Screen
                    name="BankSelection"
                    component={BankSelectionScreen}
                />
                <Stack.Screen
                    name="CardCustomization"
                    component={CardCustomizationScreen}
                />
                <Stack.Screen
                    name="CategoryBudget"
                    component={CategoryBudgetScreen}
                />
                <Stack.Screen
                    name="MerchantStats"
                    component={MerchantStatsScreen}
                />
                <Stack.Screen
                    name="Reports"
                    component={ReportsScreen}
                />
                <Stack.Screen
                    name="Help"
                    component={HelpScreen}
                />
                <Stack.Screen
                    name="Terms"
                    component={TermsScreen}
                />
                <Stack.Screen
                    name="Income"
                    component={IncomeScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
