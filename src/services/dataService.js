import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as XLSX from 'xlsx';
import { Alert, Platform } from 'react-native';

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

/**
 * Export transactions to PDF file
 */
export const exportToPDF = async (transactions, title = 'Monthly Report', currency = 'SAR', isRTL = false, userInfo = null) => {
    try {
        const html = `
            <html dir="${isRTL ? 'rtl' : 'ltr'}">
            <head>
                <style>
                    body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 20px; color: #333; }
                    h1 { color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; margin-bottom: 5px; }
                    .user-info { margin-bottom: 20px; color: #64748B; font-size: 14px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background-color: #F1F5F9; color: #475569; text-align: left; padding: 12px; border-bottom: 2px solid #E2E8F0; }
                    td { padding: 10px; border-bottom: 1px solid #E2E8F0; }
                    .amount { font-weight: bold; }
                    .total { margin-top: 30px; text-align: right; font-size: 1.2em; font-weight: bold; color: #4F46E5; }
                    .footer { margin-top: 50px; font-size: 0.8em; color: #94A3B8; text-align: center; }
                    [dir="rtl"] { text-align: right; }
                    [dir="rtl"] th { text-align: right; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                ${userInfo ? `
                <div class="user-info">
                    <strong>${userInfo.name}</strong><br/>
                    ${userInfo.position} @ ${userInfo.company}
                </div>
                ` : ''}
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Merchant</th>
                            <th>Category</th>
                            <th>Bank/Card</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transactions.map(tx => `
                            <tr>
                                <td>${new Date(tx.date).toLocaleDateString()}</td>
                                <td>${tx.merchant}</td>
                                <td>${tx.category || 'Uncategorized'}</td>
                                <td>${tx.bankName || ''} ${tx.cardLast4 ? `(**** ${tx.cardLast4})` : ''}</td>
                                <td class="amount">${tx.amount} ${currency}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="total">
                    Total: ${transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)} ${currency}
                </div>
                <div class="footer">
                    Generated by MyExpensesMonitor on ${new Date().toLocaleString()}
                </div>
            </body>
            </html>
        `;

        const { uri } = await Print.printToFileAsync({ html });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri);
            return { success: true, message: 'PDF exported successfully' };
        } else {
            return { success: false, message: 'Sharing is not available' };
        }
    } catch (error) {
        console.error('PDF export error:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Export transactions to Excel file (.xlsx)
 */
export const exportToExcel = async (transactions) => {
    try {
        // Prepare data for Excel
        const data = transactions.map(tx => ({
            'Date': new Date(tx.date).toLocaleDateString(),
            'Merchant': tx.merchant,
            'Amount': tx.amount,
            'Category': tx.category || 'Uncategorized',
            'Bank': tx.bankName || '',
            'Card': tx.cardLast4 ? `**** ${tx.cardLast4}` : '',
            'Original SMS': tx.originalText || ''
        }));

        // Use xlsx to create workbook
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transactions");

        // Convert to base64
        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

        const fileName = `MyExpenses_${new Date().toISOString().split('T')[0]}.xlsx`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, wbout, {
            encoding: 'base64',
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
            return { success: true, message: 'Excel exported successfully' };
        } else {
            return { success: false, message: 'Sharing is not available' };
        }
    } catch (error) {
        console.error('Excel export error:', error);
        return { success: false, message: error.message };
    }
};

export default {
    exportTransactions,
    exportToCSV,
    exportToPDF,
    exportToExcel,
    importTransactions,
    createBackup,
    restoreBackup
};
