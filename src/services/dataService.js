import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

/**
 * Export transactions to JSON file
 */
export const exportTransactions = async (transactions, budget, settings) => {
    try {
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: {
                transactions,
                budget,
                settings
            }
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const fileName = `MyExpenses_${new Date().toISOString().split('T')[0]}.json`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, jsonString);

        // Share the file
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
            return { success: true, message: 'Data exported successfully' };
        } else {
            return { success: false, message: 'Sharing is not available on this device' };
        }
    } catch (error) {
        console.error('Export error:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Export transactions to CSV file
 */
export const exportToCSV = async (transactions) => {
    try {
        // CSV Header
        let csv = 'Date,Merchant,Amount,Category,Bank,Card\n';

        // Add transactions
        transactions.forEach(tx => {
            const date = new Date(tx.date).toLocaleDateString();
            const merchant = tx.merchant.replace(/,/g, ';'); // Replace commas
            const amount = tx.amount;
            const category = tx.category || 'Uncategorized';
            const bank = tx.bankId || '';
            const card = tx.cardId || '';

            csv += `${date},${merchant},${amount},${category},${bank},${card}\n`;
        });

        const fileName = `MyExpenses_${new Date().toISOString().split('T')[0]}.csv`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, csv);

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
            return { success: true, message: 'CSV exported successfully' };
        } else {
            return { success: false, message: 'Sharing is not available on this device' };
        }
    } catch (error) {
        console.error('CSV export error:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Import transactions from JSON file
 */
export const importTransactions = async (fileUri) => {
    try {
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        const importData = JSON.parse(fileContent);

        // Validate data structure
        if (!importData.data || !importData.data.transactions) {
            throw new Error('Invalid file format');
        }

        return {
            success: true,
            data: importData.data
        };
    } catch (error) {
        console.error('Import error:', error);
        return {
            success: false,
            message: error.message
        };
    }
};

/**
 * Create backup of all data
 */
export const createBackup = async (allData) => {
    try {
        const backup = {
            version: '1.0',
            backupDate: new Date().toISOString(),
            data: allData
        };

        const jsonString = JSON.stringify(backup, null, 2);
        const fileName = `MyExpenses_Backup_${new Date().toISOString().split('T')[0]}.json`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, jsonString);

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
            return { success: true, message: 'Backup created successfully' };
        } else {
            return { success: false, message: 'Sharing is not available on this device' };
        }
    } catch (error) {
        console.error('Backup error:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Restore data from backup
 */
export const restoreBackup = async (fileUri) => {
    try {
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        const backup = JSON.parse(fileContent);

        // Validate backup structure
        if (!backup.data) {
            throw new Error('Invalid backup file format');
        }

        return {
            success: true,
            data: backup.data
        };
    } catch (error) {
        console.error('Restore error:', error);
        return {
            success: false,
            message: error.message
        };
    }
};

export default {
    exportTransactions,
    exportToCSV,
    importTransactions,
    createBackup,
    restoreBackup
};
