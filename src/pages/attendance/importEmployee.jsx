// @ts-ignore
import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const ImportEmployee = () => {
    // @ts-ignore
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                if (!evt.target) return;
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const jsonData = XLSX.utils.sheet_to_json(ws);
                // @ts-ignore
                setData(jsonData);
            };
            reader.readAsBinaryString(selectedFile);
        }
    };

    // importEmployee.jsx - Update the handleImport function

    const handleImport = async () => {
        if (data.length === 0) {
            setMessage({ type: 'error', text: 'No data to import.' });
            return;
        }

        setLoading(true);
        let successCount = 0;
        let failCount = 0;

        try {
            for (const row of data) {
                // Enhanced mapping to match your full employee schema
                const employee = {
                    // Personal Information
                    employeeid: String(row['Employee ID'] || row['employeeid'] || row['ID'] || ''),
                    // @ts-ignore
                    firstName: row['First Name'] || row['firstName'] || row['Name']?.split(' ')[0] || '',
                    // @ts-ignore
                    lastName: row['Last Name'] || row['lastName'] || row['Name']?.split(' ')[1] || '',
                    gender: row['Gender'] || row['gender'] || '',
                    dateOfBirth: row['Date of Birth'] || row['dateOfBirth'] || '',
                    bloodGroup: row['Blood Group'] || row['bloodGroup'] || '',
                    maritalStatus: row['Marital Status'] || row['maritalStatus'] || '',
                    fatherOrHusbandName: row['Father/Husband Name'] || row['fatherOrHusbandName'] || '',

                    // Employment Details
                    department: row['Department'] || row['department'] || row['Dept'] || '',
                    branch: row['Branch'] || row['branch'] || '',
                    dateOfJoining: row['Date of Joining'] || row['dateOfJoining'] || '',
                    shift: row['Shift'] || row['shift'] || '',
                    shiftTime: row['Shift Time'] || row['shiftTime'] || '',
                    position: row['Position'] || row['position'] || '',
                    // @ts-ignore
                    employmentStatus: (row['Status'] || row['employmentStatus'] || row['STATUS'] || 'active').toLowerCase(),
                    previousExperience: row['Previous Experience'] || row['previousExperience'] || row['EXPERIENCE'] || 0,
                    currentCompanyExperience: row['Current Experience'] || row['currentCompanyExperience'] || 0,
                    enrollmentNumber: row['Enrollment Number'] || row['enrollmentNumber'] || '',
                    casualLeave: row['Casual Leave'] || row['casualLeave'] || 0,
                    qualifications: row['Qualifications'] || row['qualifications'] || '',

                    // Contact Information
                    email: row['Email'] || row['email'] || '',
                    phone: row['Phone'] || row['phone'] || '',
                    emergencyContact: row['Emergency Contact'] || row['emergencyContact'] || '',
                    address: row['Address'] || row['address'] || '',

                    // Financial Information
                    aadharNumber: row['Aadhar Number'] || row['aadharNumber'] || '',
                    esiNumber: row['ESI Number'] || row['esiNumber'] || '',
                    panNumber: row['PAN Number'] || row['panNumber'] || '',
                    accountNumber: row['Account Number'] || row['accountNumber'] || '',
                    ifscCode: row['IFSC Code'] || row['ifscCode'] || '',
                    grossSalary: row['Gross Salary'] || row['grossSalary'] || 0,
                    salaryNet: row['Salary Net'] || row['salaryNet'] || row['Salary'] || 0,

                    // References
                    references: [
                        row['Reference 1'] || row['reference1'] || '',
                        row['Reference 2'] || row['reference2'] || ''
                    ],

                    // Metadata
                    createdAt: new Date(),
                    uid: row['UID'] || row['uid'] || '' // If you have Firebase UID
                };

                // Validate required fields
                if (employee.employeeid && employee.firstName && employee.email) {
                    // Check for existing employee ID
                    const q = query(collection(db, "employees"), where("employeeid", "==", employee.employeeid));
                    const querySnapshot = await getDocs(q);

                    if (querySnapshot.empty) {
                        await addDoc(collection(db, "employees"), employee);
                        successCount++;
                    } else {
                        console.warn(`Employee ID ${employee.employeeid} already exists.`);
                        failCount++;
                    }
                } else {
                    console.warn("Missing required fields:", employee);
                    failCount++;
                }
            }

            setMessage({
                type: 'success',
                text: `Import completed. ${successCount} added, ${failCount} skipped/failed.`
            });

            if (successCount > 0) {
                setTimeout(() => navigate('/admin/emplist'), 2000);
            }
        } catch (error) {
            console.error("Import error:", error);
            setMessage({ type: 'error', text: 'An error occurred during import.' });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Import Employees</h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Excel or CSV File
                    </label>
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        Expected headers: Employee ID, First Name, Last Name, Email, Phone, Department, Branch, Position, Date of Joining, Status
                    </p>
                </div>

                {data.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Preview (First 5 rows):</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {Object.keys(data[0]).slice(0, 5).map(key => (
                                            <th key={key} className="px-2 py-1 text-left border-b">{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.slice(0, 5).map((row, i) => (
                                        <tr key={i}>
                                            {Object.values(row).slice(0, 5).map((val, j) => (
                                                <td key={j} className="px-2 py-1 border-b">{String(val)}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {message.text && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => navigate('/admin/emplist')}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={loading || data.length === 0}
                        className={`px-6 py-2 rounded-lg text-white ${loading || data.length === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? 'Importing...' : 'Start Import'}
                    </button>
                </div>
            </div>
        </div>
    );
    
};

export default ImportEmployee;
